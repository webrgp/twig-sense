import {
  CompletionItem,
  CompletionItemKind,
  TextDocumentPositionParams,
  InsertTextFormat,
  MarkupKind,
} from "vscode-languageserver/node";
import { TextDocument } from "vscode-languageserver-textdocument";
import type { Tree } from "web-tree-sitter";
import {
  FILTER_DOCS,
  FUNCTION_DOCS,
  KEYWORD_DOCS,
  TEST_DOCS,
  LOOP_VARIABLE_DOCS,
} from "./completion-docs";
import {
  analyzeDocument,
  getScopeAtPosition,
  getAvailableVariables,
  type ScopeInfo,
  type BlockType,
} from "./document-analyzer";

/**
 * Context types for Twig completions
 */
export type TwigContext = "output" | "block" | "filter" | "none";

/**
 * Twig keywords used in block statements ({% ... %})
 */
const TWIG_KEYWORDS: CompletionItem[] = [
  {
    label: "if",
    kind: CompletionItemKind.Keyword,
    insertText: "if ${1:condition}",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Conditional statement",
    documentation: KEYWORD_DOCS["if"],
  },
  {
    label: "elseif",
    kind: CompletionItemKind.Keyword,
    insertText: "elseif ${1:condition}",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Else-if branch",
    documentation: KEYWORD_DOCS["elseif"],
  },
  {
    label: "else",
    kind: CompletionItemKind.Keyword,
    detail: "Else branch",
    documentation: KEYWORD_DOCS["else"],
  },
  {
    label: "endif",
    kind: CompletionItemKind.Keyword,
    detail: "End if statement",
    documentation: KEYWORD_DOCS["endif"],
  },
  {
    label: "for",
    kind: CompletionItemKind.Keyword,
    insertText: "for ${1:item} in ${2:items}",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "For loop",
    documentation: KEYWORD_DOCS["for"],
  },
  {
    label: "endfor",
    kind: CompletionItemKind.Keyword,
    detail: "End for loop",
    documentation: KEYWORD_DOCS["endfor"],
  },
  {
    label: "block",
    kind: CompletionItemKind.Keyword,
    insertText: "block ${1:name}",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Define a block",
    documentation: KEYWORD_DOCS["block"],
  },
  {
    label: "endblock",
    kind: CompletionItemKind.Keyword,
    detail: "End block",
    documentation: KEYWORD_DOCS["endblock"],
  },
  {
    label: "extends",
    kind: CompletionItemKind.Keyword,
    insertText: "extends '${1:template}'",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Extend a template",
    documentation: KEYWORD_DOCS["extends"],
  },
  {
    label: "include",
    kind: CompletionItemKind.Keyword,
    insertText: "include '${1:template}'",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Include a template",
    documentation: KEYWORD_DOCS["include"],
  },
  {
    label: "set",
    kind: CompletionItemKind.Keyword,
    insertText: "set ${1:name} = ${2:value}",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Set a variable",
    documentation: KEYWORD_DOCS["set"],
  },
  {
    label: "endset",
    kind: CompletionItemKind.Keyword,
    detail: "End set block",
    documentation: KEYWORD_DOCS["endset"],
  },
  {
    label: "macro",
    kind: CompletionItemKind.Keyword,
    insertText: "macro ${1:name}(${2:args})",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Define a macro",
    documentation: KEYWORD_DOCS["macro"],
  },
  {
    label: "endmacro",
    kind: CompletionItemKind.Keyword,
    detail: "End macro",
    documentation: KEYWORD_DOCS["endmacro"],
  },
  {
    label: "import",
    kind: CompletionItemKind.Keyword,
    insertText: "import '${1:template}' as ${2:name}",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Import macros",
    documentation: KEYWORD_DOCS["import"],
  },
  {
    label: "from",
    kind: CompletionItemKind.Keyword,
    insertText: "from '${1:template}' import ${2:macro}",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Import specific macros",
    documentation: KEYWORD_DOCS["from"],
  },
  {
    label: "with",
    kind: CompletionItemKind.Keyword,
    insertText: "with { ${1:key}: ${2:value} }",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Pass variables",
    documentation: KEYWORD_DOCS["with"],
  },
  {
    label: "apply",
    kind: CompletionItemKind.Keyword,
    insertText: "apply ${1:filter}",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Apply filter to block",
    documentation: KEYWORD_DOCS["apply"],
  },
  {
    label: "endapply",
    kind: CompletionItemKind.Keyword,
    detail: "End apply block",
    documentation: KEYWORD_DOCS["endapply"],
  },
  {
    label: "autoescape",
    kind: CompletionItemKind.Keyword,
    insertText: "autoescape '${1|html,js,css,url,html_attr|}'",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Auto-escape block",
    documentation: KEYWORD_DOCS["autoescape"],
  },
  {
    label: "endautoescape",
    kind: CompletionItemKind.Keyword,
    detail: "End autoescape",
    documentation: KEYWORD_DOCS["endautoescape"],
  },
  {
    label: "embed",
    kind: CompletionItemKind.Keyword,
    insertText: "embed '${1:template}'",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Embed a template",
    documentation: KEYWORD_DOCS["embed"],
  },
  {
    label: "endembed",
    kind: CompletionItemKind.Keyword,
    detail: "End embed",
    documentation: KEYWORD_DOCS["endembed"],
  },
  {
    label: "flush",
    kind: CompletionItemKind.Keyword,
    detail: "Flush output buffer",
    documentation: KEYWORD_DOCS["flush"],
  },
  {
    label: "sandbox",
    kind: CompletionItemKind.Keyword,
    detail: "Sandbox block",
    documentation: KEYWORD_DOCS["sandbox"],
  },
  {
    label: "endsandbox",
    kind: CompletionItemKind.Keyword,
    detail: "End sandbox",
    documentation: KEYWORD_DOCS["endsandbox"],
  },
  {
    label: "use",
    kind: CompletionItemKind.Keyword,
    insertText: "use '${1:template}'",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Use template traits",
    documentation: KEYWORD_DOCS["use"],
  },
  {
    label: "verbatim",
    kind: CompletionItemKind.Keyword,
    detail: "Raw output (no parsing)",
    documentation: KEYWORD_DOCS["verbatim"],
  },
  {
    label: "endverbatim",
    kind: CompletionItemKind.Keyword,
    detail: "End verbatim",
    documentation: KEYWORD_DOCS["endverbatim"],
  },
  {
    label: "do",
    kind: CompletionItemKind.Keyword,
    insertText: "do ${1:expression}",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Execute without output",
    documentation: KEYWORD_DOCS["do"],
  },
  {
    label: "cache",
    kind: CompletionItemKind.Keyword,
    insertText: "cache '${1:key}'",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Cache block",
    documentation: KEYWORD_DOCS["cache"],
  },
  {
    label: "endcache",
    kind: CompletionItemKind.Keyword,
    detail: "End cache",
    documentation: KEYWORD_DOCS["endcache"],
  },
  {
    label: "deprecated",
    kind: CompletionItemKind.Keyword,
    insertText: "deprecated '${1:message}'",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Mark as deprecated",
    documentation: KEYWORD_DOCS["deprecated"],
  },
];

/**
 * Twig built-in filters
 */
const TWIG_FILTERS: CompletionItem[] = [
  {
    label: "abs",
    kind: CompletionItemKind.Function,
    detail: "Absolute value",
    documentation: FILTER_DOCS["abs"],
  },
  {
    label: "batch",
    kind: CompletionItemKind.Function,
    insertText: "batch(${1:size})",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Batch items",
    documentation: FILTER_DOCS["batch"],
  },
  {
    label: "capitalize",
    kind: CompletionItemKind.Function,
    detail: "Capitalize first char",
    documentation: FILTER_DOCS["capitalize"],
  },
  {
    label: "column",
    kind: CompletionItemKind.Function,
    insertText: "column('${1:name}')",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Extract column",
    documentation: FILTER_DOCS["column"],
  },
  {
    label: "convert_encoding",
    kind: CompletionItemKind.Function,
    insertText: "convert_encoding('${1:to}', '${2:from}')",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Convert encoding",
    documentation: FILTER_DOCS["convert_encoding"],
  },
  {
    label: "country_name",
    kind: CompletionItemKind.Function,
    detail: "Country name",
    documentation: FILTER_DOCS["country_name"],
  },
  {
    label: "currency_name",
    kind: CompletionItemKind.Function,
    detail: "Currency name",
    documentation: FILTER_DOCS["currency_name"],
  },
  {
    label: "currency_symbol",
    kind: CompletionItemKind.Function,
    detail: "Currency symbol",
    documentation: FILTER_DOCS["currency_symbol"],
  },
  {
    label: "data_uri",
    kind: CompletionItemKind.Function,
    detail: "Data URI",
    documentation: FILTER_DOCS["data_uri"],
  },
  {
    label: "date",
    kind: CompletionItemKind.Function,
    insertText: "date('${1:format}')",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Format date",
    documentation: FILTER_DOCS["date"],
  },
  {
    label: "date_modify",
    kind: CompletionItemKind.Function,
    insertText: "date_modify('${1:modifier}')",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Modify date",
    documentation: FILTER_DOCS["date_modify"],
  },
  {
    label: "default",
    kind: CompletionItemKind.Function,
    insertText: "default('${1:value}')",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Default value",
    documentation: FILTER_DOCS["default"],
  },
  {
    label: "escape",
    kind: CompletionItemKind.Function,
    insertText: "escape('${1|html,js,css,url,html_attr|}')",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Escape string",
    documentation: FILTER_DOCS["escape"],
  },
  {
    label: "e",
    kind: CompletionItemKind.Function,
    insertText: "e('${1|html,js,css,url,html_attr|}')",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Escape (alias)",
    documentation: FILTER_DOCS["e"],
  },
  {
    label: "filter",
    kind: CompletionItemKind.Function,
    insertText: "filter(${1:arrow})",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Filter items",
    documentation: FILTER_DOCS["filter"],
  },
  {
    label: "first",
    kind: CompletionItemKind.Function,
    detail: "First element",
    documentation: FILTER_DOCS["first"],
  },
  {
    label: "format",
    kind: CompletionItemKind.Function,
    insertText: "format(${1:args})",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Format string",
    documentation: FILTER_DOCS["format"],
  },
  {
    label: "format_currency",
    kind: CompletionItemKind.Function,
    insertText: "format_currency('${1:currency}')",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Format currency",
    documentation: FILTER_DOCS["format_currency"],
  },
  {
    label: "format_date",
    kind: CompletionItemKind.Function,
    detail: "Format date (locale)",
    documentation: FILTER_DOCS["format_date"],
  },
  {
    label: "format_datetime",
    kind: CompletionItemKind.Function,
    detail: "Format datetime",
    documentation: FILTER_DOCS["format_datetime"],
  },
  {
    label: "format_number",
    kind: CompletionItemKind.Function,
    detail: "Format number",
    documentation: FILTER_DOCS["format_number"],
  },
  {
    label: "format_time",
    kind: CompletionItemKind.Function,
    detail: "Format time",
    documentation: FILTER_DOCS["format_time"],
  },
  {
    label: "html_to_markdown",
    kind: CompletionItemKind.Function,
    detail: "HTML to Markdown",
    documentation: FILTER_DOCS["html_to_markdown"],
  },
  {
    label: "inline_css",
    kind: CompletionItemKind.Function,
    detail: "Inline CSS",
    documentation: FILTER_DOCS["inline_css"],
  },
  {
    label: "inky_to_html",
    kind: CompletionItemKind.Function,
    detail: "Inky to HTML",
    documentation: FILTER_DOCS["inky_to_html"],
  },
  {
    label: "join",
    kind: CompletionItemKind.Function,
    insertText: "join('${1:glue}')",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Join array",
    documentation: FILTER_DOCS["join"],
  },
  {
    label: "json_encode",
    kind: CompletionItemKind.Function,
    detail: "Encode as JSON",
    documentation: FILTER_DOCS["json_encode"],
  },
  {
    label: "keys",
    kind: CompletionItemKind.Function,
    detail: "Array keys",
    documentation: FILTER_DOCS["keys"],
  },
  {
    label: "language_name",
    kind: CompletionItemKind.Function,
    detail: "Language name",
    documentation: FILTER_DOCS["language_name"],
  },
  {
    label: "last",
    kind: CompletionItemKind.Function,
    detail: "Last element",
    documentation: FILTER_DOCS["last"],
  },
  {
    label: "length",
    kind: CompletionItemKind.Function,
    detail: "Length/count",
    documentation: FILTER_DOCS["length"],
  },
  {
    label: "locale_name",
    kind: CompletionItemKind.Function,
    detail: "Locale name",
    documentation: FILTER_DOCS["locale_name"],
  },
  {
    label: "lower",
    kind: CompletionItemKind.Function,
    detail: "Lowercase",
    documentation: FILTER_DOCS["lower"],
  },
  {
    label: "map",
    kind: CompletionItemKind.Function,
    insertText: "map(${1:arrow})",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Map items",
    documentation: FILTER_DOCS["map"],
  },
  {
    label: "markdown_to_html",
    kind: CompletionItemKind.Function,
    detail: "Markdown to HTML",
    documentation: FILTER_DOCS["markdown_to_html"],
  },
  {
    label: "merge",
    kind: CompletionItemKind.Function,
    insertText: "merge(${1:array})",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Merge arrays",
    documentation: FILTER_DOCS["merge"],
  },
  {
    label: "nl2br",
    kind: CompletionItemKind.Function,
    detail: "Newlines to <br>",
    documentation: FILTER_DOCS["nl2br"],
  },
  {
    label: "number_format",
    kind: CompletionItemKind.Function,
    insertText: "number_format(${1:decimals})",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Format number",
    documentation: FILTER_DOCS["number_format"],
  },
  {
    label: "raw",
    kind: CompletionItemKind.Function,
    detail: "Raw output",
    documentation: FILTER_DOCS["raw"],
  },
  {
    label: "reduce",
    kind: CompletionItemKind.Function,
    insertText: "reduce(${1:arrow})",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Reduce array",
    documentation: FILTER_DOCS["reduce"],
  },
  {
    label: "replace",
    kind: CompletionItemKind.Function,
    insertText: "replace({ '${1:from}': '${2:to}' })",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Replace text",
    documentation: FILTER_DOCS["replace"],
  },
  {
    label: "reverse",
    kind: CompletionItemKind.Function,
    detail: "Reverse array/string",
    documentation: FILTER_DOCS["reverse"],
  },
  {
    label: "round",
    kind: CompletionItemKind.Function,
    insertText: "round(${1:precision})",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Round number",
    documentation: FILTER_DOCS["round"],
  },
  {
    label: "slice",
    kind: CompletionItemKind.Function,
    insertText: "slice(${1:start}, ${2:length})",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Slice array/string",
    documentation: FILTER_DOCS["slice"],
  },
  {
    label: "slug",
    kind: CompletionItemKind.Function,
    detail: "URL slug",
    documentation: FILTER_DOCS["slug"],
  },
  {
    label: "sort",
    kind: CompletionItemKind.Function,
    detail: "Sort array",
    documentation: FILTER_DOCS["sort"],
  },
  {
    label: "spaceless",
    kind: CompletionItemKind.Function,
    detail: "Remove whitespace",
    documentation: FILTER_DOCS["spaceless"],
  },
  {
    label: "split",
    kind: CompletionItemKind.Function,
    insertText: "split('${1:delimiter}')",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Split string",
    documentation: FILTER_DOCS["split"],
  },
  {
    label: "striptags",
    kind: CompletionItemKind.Function,
    detail: "Strip HTML tags",
    documentation: FILTER_DOCS["striptags"],
  },
  {
    label: "timezone_name",
    kind: CompletionItemKind.Function,
    detail: "Timezone name",
    documentation: FILTER_DOCS["timezone_name"],
  },
  {
    label: "title",
    kind: CompletionItemKind.Function,
    detail: "Title case",
    documentation: FILTER_DOCS["title"],
  },
  {
    label: "trim",
    kind: CompletionItemKind.Function,
    detail: "Trim whitespace",
    documentation: FILTER_DOCS["trim"],
  },
  {
    label: "u",
    kind: CompletionItemKind.Function,
    detail: "Unicode string",
    documentation: FILTER_DOCS["u"],
  },
  {
    label: "upper",
    kind: CompletionItemKind.Function,
    detail: "Uppercase",
    documentation: FILTER_DOCS["upper"],
  },
  {
    label: "url_encode",
    kind: CompletionItemKind.Function,
    detail: "URL encode",
    documentation: FILTER_DOCS["url_encode"],
  },
];

/**
 * Twig built-in functions
 */
const TWIG_FUNCTIONS: CompletionItem[] = [
  {
    label: "attribute",
    kind: CompletionItemKind.Function,
    insertText: "attribute(${1:object}, ${2:method})",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Dynamic attribute access",
    documentation: FUNCTION_DOCS["attribute"],
  },
  {
    label: "block",
    kind: CompletionItemKind.Function,
    insertText: "block('${1:name}')",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Render a block",
    documentation: FUNCTION_DOCS["block"],
  },
  {
    label: "constant",
    kind: CompletionItemKind.Function,
    insertText: "constant('${1:name}')",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Get constant value",
    documentation: FUNCTION_DOCS["constant"],
  },
  {
    label: "country_names",
    kind: CompletionItemKind.Function,
    detail: "List country names",
    documentation: FUNCTION_DOCS["country_names"],
  },
  {
    label: "country_timezones",
    kind: CompletionItemKind.Function,
    detail: "List country timezones",
    documentation: FUNCTION_DOCS["country_timezones"],
  },
  {
    label: "currency_names",
    kind: CompletionItemKind.Function,
    detail: "List currency names",
    documentation: FUNCTION_DOCS["currency_names"],
  },
  {
    label: "cycle",
    kind: CompletionItemKind.Function,
    insertText: "cycle(${1:array}, ${2:position})",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Cycle through values",
    documentation: FUNCTION_DOCS["cycle"],
  },
  {
    label: "date",
    kind: CompletionItemKind.Function,
    insertText: "date('${1:date}')",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Create date object",
    documentation: FUNCTION_DOCS["date"],
  },
  {
    label: "dump",
    kind: CompletionItemKind.Function,
    insertText: "dump(${1:variable})",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Debug dump",
    documentation: FUNCTION_DOCS["dump"],
  },
  {
    label: "html_classes",
    kind: CompletionItemKind.Function,
    insertText: "html_classes(${1:classes})",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Generate class list",
    documentation: FUNCTION_DOCS["html_classes"],
  },
  {
    label: "include",
    kind: CompletionItemKind.Function,
    insertText: "include('${1:template}')",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Include template",
    documentation: FUNCTION_DOCS["include"],
  },
  {
    label: "language_names",
    kind: CompletionItemKind.Function,
    detail: "List language names",
    documentation: FUNCTION_DOCS["language_names"],
  },
  {
    label: "locale_names",
    kind: CompletionItemKind.Function,
    detail: "List locale names",
    documentation: FUNCTION_DOCS["locale_names"],
  },
  {
    label: "max",
    kind: CompletionItemKind.Function,
    insertText: "max(${1:values})",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Maximum value",
    documentation: FUNCTION_DOCS["max"],
  },
  {
    label: "min",
    kind: CompletionItemKind.Function,
    insertText: "min(${1:values})",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Minimum value",
    documentation: FUNCTION_DOCS["min"],
  },
  {
    label: "parent",
    kind: CompletionItemKind.Function,
    detail: "Parent block content",
    documentation: FUNCTION_DOCS["parent"],
  },
  {
    label: "random",
    kind: CompletionItemKind.Function,
    insertText: "random(${1:values})",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Random value",
    documentation: FUNCTION_DOCS["random"],
  },
  {
    label: "range",
    kind: CompletionItemKind.Function,
    insertText: "range(${1:low}, ${2:high})",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Generate range",
    documentation: FUNCTION_DOCS["range"],
  },
  {
    label: "script_names",
    kind: CompletionItemKind.Function,
    detail: "List script names",
    documentation: FUNCTION_DOCS["script_names"],
  },
  {
    label: "source",
    kind: CompletionItemKind.Function,
    insertText: "source('${1:template}')",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Template source",
    documentation: FUNCTION_DOCS["source"],
  },
  {
    label: "template_from_string",
    kind: CompletionItemKind.Function,
    insertText: "template_from_string('${1:template}')",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Template from string",
    documentation: FUNCTION_DOCS["template_from_string"],
  },
  {
    label: "timezone_names",
    kind: CompletionItemKind.Function,
    detail: "List timezone names",
    documentation: FUNCTION_DOCS["timezone_names"],
  },
];

/**
 * Twig tests (used with 'is' operator)
 */
const TWIG_TESTS: CompletionItem[] = [
  {
    label: "constant",
    kind: CompletionItemKind.Keyword,
    insertText: "constant('${1:name}')",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Test against constant",
    documentation: TEST_DOCS["constant"],
  },
  {
    label: "defined",
    kind: CompletionItemKind.Keyword,
    detail: "Is defined",
    documentation: TEST_DOCS["defined"],
  },
  {
    label: "divisible by",
    kind: CompletionItemKind.Keyword,
    insertText: "divisible by(${1:number})",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Divisibility test",
    documentation: TEST_DOCS["divisible by"],
  },
  {
    label: "empty",
    kind: CompletionItemKind.Keyword,
    detail: "Is empty",
    documentation: TEST_DOCS["empty"],
  },
  {
    label: "even",
    kind: CompletionItemKind.Keyword,
    detail: "Is even",
    documentation: TEST_DOCS["even"],
  },
  {
    label: "iterable",
    kind: CompletionItemKind.Keyword,
    detail: "Is iterable",
    documentation: TEST_DOCS["iterable"],
  },
  {
    label: "null",
    kind: CompletionItemKind.Keyword,
    detail: "Is null",
    documentation: TEST_DOCS["null"],
  },
  {
    label: "odd",
    kind: CompletionItemKind.Keyword,
    detail: "Is odd",
    documentation: TEST_DOCS["odd"],
  },
  {
    label: "same as",
    kind: CompletionItemKind.Keyword,
    insertText: "same as(${1:value})",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Strict equality",
    documentation: TEST_DOCS["same as"],
  },
];

/**
 * Detect the Twig context at a given position
 */
export function detectContext(
  document: TextDocument,
  position: { line: number; character: number }
): TwigContext {
  const text = document.getText();
  const offset = document.offsetAt(position);

  // Find the text before the cursor
  const textBefore = text.substring(0, offset);

  // Check for filter context (after |)
  const lastPipe = textBefore.lastIndexOf("|");
  if (lastPipe !== -1) {
    const afterPipe = textBefore.substring(lastPipe + 1);
    // If there's no space or only identifier chars after pipe, we're in filter context
    if (/^\s*[a-zA-Z_]*$/.test(afterPipe)) {
      // But make sure we're inside {{ or {%
      const lastOutputOpen = textBefore.lastIndexOf("{{");
      const lastOutputClose = textBefore.lastIndexOf("}}");
      const lastBlockOpen = textBefore.lastIndexOf("{%");
      const lastBlockClose = textBefore.lastIndexOf("%}");

      const inOutput =
        lastOutputOpen !== -1 && (lastOutputClose === -1 || lastOutputOpen > lastOutputClose);
      const inBlock =
        lastBlockOpen !== -1 && (lastBlockClose === -1 || lastBlockOpen > lastBlockClose);

      if (inOutput || inBlock) {
        return "filter";
      }
    }
  }

  // Check for block context (inside {% ... %})
  const lastBlockOpen = textBefore.lastIndexOf("{%");
  const lastBlockClose = textBefore.lastIndexOf("%}");
  if (lastBlockOpen !== -1 && (lastBlockClose === -1 || lastBlockOpen > lastBlockClose)) {
    return "block";
  }

  // Check for output context (inside {{ ... }})
  const lastOutputOpen = textBefore.lastIndexOf("{{");
  const lastOutputClose = textBefore.lastIndexOf("}}");
  if (lastOutputOpen !== -1 && (lastOutputClose === -1 || lastOutputOpen > lastOutputClose)) {
    return "output";
  }

  return "none";
}

/**
 * Check if cursor is after 'is' keyword (for tests)
 */
function isAfterIsKeyword(document: TextDocument, offset: number): boolean {
  const text = document.getText();
  const textBefore = text.substring(0, offset);

  // Find the nearest Twig delimiter
  const lastOutputOpen = textBefore.lastIndexOf("{{");
  const lastBlockOpen = textBefore.lastIndexOf("{%");
  const delimiterPos = Math.max(lastOutputOpen, lastBlockOpen);

  if (delimiterPos === -1) return false;

  const insideDelimiter = textBefore.substring(delimiterPos);
  // Check if there's an 'is' keyword followed by optional whitespace
  return /\bis\s+[a-zA-Z_]*$/.test(insideDelimiter);
}

/**
 * Loop variable completions (available inside for loops after "loop.")
 */
const LOOP_VARIABLE_COMPLETIONS: CompletionItem[] = [
  {
    label: "index",
    kind: CompletionItemKind.Property,
    detail: "Current iteration (1-indexed)",
    documentation: LOOP_VARIABLE_DOCS["index"],
  },
  {
    label: "index0",
    kind: CompletionItemKind.Property,
    detail: "Current iteration (0-indexed)",
    documentation: LOOP_VARIABLE_DOCS["index0"],
  },
  {
    label: "revindex",
    kind: CompletionItemKind.Property,
    detail: "Iterations from end (1-indexed)",
    documentation: LOOP_VARIABLE_DOCS["revindex"],
  },
  {
    label: "revindex0",
    kind: CompletionItemKind.Property,
    detail: "Iterations from end (0-indexed)",
    documentation: LOOP_VARIABLE_DOCS["revindex0"],
  },
  {
    label: "first",
    kind: CompletionItemKind.Property,
    detail: "True if first iteration",
    documentation: LOOP_VARIABLE_DOCS["first"],
  },
  {
    label: "last",
    kind: CompletionItemKind.Property,
    detail: "True if last iteration",
    documentation: LOOP_VARIABLE_DOCS["last"],
  },
  {
    label: "length",
    kind: CompletionItemKind.Property,
    detail: "Total number of items",
    documentation: LOOP_VARIABLE_DOCS["length"],
  },
  {
    label: "parent",
    kind: CompletionItemKind.Property,
    detail: "Parent context in nested loops",
    documentation: LOOP_VARIABLE_DOCS["parent"],
  },
];

/**
 * Check if cursor is after "loop." for loop variable completions
 */
function isAfterLoopDot(document: TextDocument, offset: number): boolean {
  const text = document.getText();
  const textBefore = text.substring(0, offset);

  // Check if we're after "loop."
  return /\bloop\.\s*[a-zA-Z_]*$/.test(textBefore);
}

/**
 * Check if cursor is after "block('" for block name completions
 */
function isInBlockFunction(document: TextDocument, offset: number): boolean {
  const text = document.getText();
  const textBefore = text.substring(0, offset);

  // Check if we're inside block('...')
  return /\bblock\s*\(\s*['"][^'"]*$/.test(textBefore);
}

/**
 * Check if cursor is after "{% block " for block name completions
 */
function isAfterBlockKeyword(document: TextDocument, offset: number): boolean {
  const text = document.getText();
  const textBefore = text.substring(0, offset);

  // Find the last {% and check if it's followed by "block "
  const lastBlockOpen = textBefore.lastIndexOf("{%");
  if (lastBlockOpen === -1) return false;

  const afterDelimiter = textBefore.substring(lastBlockOpen);
  return /\{%-?\s*block\s+[a-zA-Z_]*$/.test(afterDelimiter);
}

/**
 * Get variable completions from the document analysis
 */
function getVariableCompletions(tree: Tree, line: number, character: number): CompletionItem[] {
  const variables = getAvailableVariables(tree, line, character);

  return variables.map((v) => ({
    label: v.name,
    kind: CompletionItemKind.Variable,
    detail: "Variable",
    documentation: {
      kind: MarkupKind.Markdown,
      value: `Variable defined at line ${v.line + 1}`,
    },
  }));
}

/**
 * Get macro completions from the document analysis
 */
function getMacroCompletions(tree: Tree): CompletionItem[] {
  const analysis = analyzeDocument(tree);

  return analysis.macros.map((m) => {
    const paramSnippet =
      m.parameters.length > 0 ? m.parameters.map((p, i) => `\${${i + 1}:${p}}`).join(", ") : "";

    return {
      label: m.name,
      kind: CompletionItemKind.Function,
      detail: `Macro(${m.parameters.join(", ")})`,
      insertText: m.parameters.length > 0 ? `${m.name}(${paramSnippet})` : `${m.name}()`,
      insertTextFormat: InsertTextFormat.Snippet,
      documentation: {
        kind: MarkupKind.Markdown,
        value: `Macro defined at line ${m.line + 1}\n\n**Parameters:** ${m.parameters.length > 0 ? m.parameters.join(", ") : "none"}`,
      },
    };
  });
}

/**
 * Get block name completions from the document analysis
 */
function getBlockNameCompletions(tree: Tree): CompletionItem[] {
  const analysis = analyzeDocument(tree);

  return analysis.blocks.map((b) => ({
    label: b.name,
    kind: CompletionItemKind.Class,
    detail: "Block",
    documentation: {
      kind: MarkupKind.Markdown,
      value: `Block defined at line ${b.line + 1}`,
    },
  }));
}

/**
 * Mapping of end keywords to their opening block types
 */
const END_KEYWORD_TO_BLOCK_TYPE: Record<string, BlockType> = {
  endif: "if",
  endfor: "for",
  endblock: "block",
  endmacro: "macro",
  endapply: "apply",
  endautoescape: "autoescape",
  endembed: "embed",
  endsandbox: "sandbox",
  endverbatim: "verbatim",
  endcache: "cache",
  endset: "set",
};

/**
 * Filter keywords based on current scope context
 * - Shows end* keywords only when inside corresponding block
 * - Shows else/elseif only inside if blocks
 * - Shows else inside for blocks (for loop else)
 */
function filterKeywordsByContext(keywords: CompletionItem[], scope: ScopeInfo): CompletionItem[] {
  // Get set of block types currently in scope
  const activeBlockTypes = new Set(scope.blockStack.map((b) => b.type));

  return keywords.filter((keyword) => {
    const label = keyword.label;

    // Handle end* keywords
    if (label.startsWith("end")) {
      const blockType = END_KEYWORD_TO_BLOCK_TYPE[label];
      if (blockType) {
        // Only show if we're inside the corresponding block
        return activeBlockTypes.has(blockType);
      }
    }

    // Handle else/elseif - only show inside if blocks
    if (label === "else") {
      // Show else if inside if OR inside for (for loop else)
      return scope.insideIf || scope.insideForLoop;
    }

    if (label === "elseif") {
      // Only show inside if blocks
      return scope.insideIf;
    }

    // All other keywords are always shown
    return true;
  });
}

/**
 * Get completions for a given document and position
 */
export function getCompletions(
  document: TextDocument,
  params: TextDocumentPositionParams,
  tree?: Tree
): CompletionItem[] {
  const context = detectContext(document, params.position);
  const offset = document.offsetAt(params.position);
  const { line, character } = params.position;

  // Check for loop variable completions (loop.xxx)
  if (tree && isAfterLoopDot(document, offset)) {
    const scope = getScopeAtPosition(tree, line, character);
    if (scope.insideForLoop) {
      return LOOP_VARIABLE_COMPLETIONS;
    }
    // If not inside a for loop, don't suggest loop variables
    return [];
  }

  // Check for block name completions in block() function
  if (tree && isInBlockFunction(document, offset)) {
    return getBlockNameCompletions(tree);
  }

  // Check for block name completions after {% block keyword
  if (tree && isAfterBlockKeyword(document, offset)) {
    return getBlockNameCompletions(tree);
  }

  switch (context) {
    case "filter":
      return TWIG_FILTERS;

    case "block": {
      // In block context, provide keywords
      // Also check if after 'is' for test completions
      if (isAfterIsKeyword(document, offset)) {
        return TWIG_TESTS;
      }

      // Get scope info if tree is available for context-aware filtering
      const scope = tree ? getScopeAtPosition(tree, line, character) : null;

      // Filter keywords by context (only show relevant end*, else, elseif)
      const filteredKeywords = scope
        ? filterKeywordsByContext(TWIG_KEYWORDS, scope)
        : TWIG_KEYWORDS;

      const completions = [...filteredKeywords, ...TWIG_FUNCTIONS];

      // Add document-specific completions if tree is available
      if (tree && scope) {
        // Add variable completions
        completions.push(...getVariableCompletions(tree, line, character));

        // Add macro completions
        completions.push(...getMacroCompletions(tree));

        // Add loop variable if inside a for loop
        if (scope.insideForLoop) {
          completions.push({
            label: "loop",
            kind: CompletionItemKind.Variable,
            detail: "Loop variable",
            documentation: {
              kind: MarkupKind.Markdown,
              value: "Access loop information like `loop.index`, `loop.first`, `loop.last`, etc.",
            },
          });
        }

        // Prioritize parent() if inside a block
        if (scope.insideBlock) {
          const parentIndex = completions.findIndex((c) => c.label === "parent");
          if (parentIndex > 0) {
            const parentCompletion = completions[parentIndex];
            if (parentCompletion) {
              completions.splice(parentIndex, 1);
              completions.unshift({
                label: parentCompletion.label,
                kind: parentCompletion.kind,
                detail: parentCompletion.detail,
                documentation: parentCompletion.documentation,
                insertText: parentCompletion.insertText,
                insertTextFormat: parentCompletion.insertTextFormat,
                sortText: "0000parent", // Sort first
                preselect: true,
              });
            }
          }
        }
      }

      return completions;
    }

    case "output": {
      // In output context, provide functions and check for 'is' tests
      if (isAfterIsKeyword(document, offset)) {
        return TWIG_TESTS;
      }

      const completions = [...TWIG_FUNCTIONS];

      // Add document-specific completions if tree is available
      if (tree) {
        const scope = getScopeAtPosition(tree, line, character);

        // Add variable completions
        completions.push(...getVariableCompletions(tree, line, character));

        // Add macro completions
        completions.push(...getMacroCompletions(tree));

        // Add loop variable if inside a for loop
        if (scope.insideForLoop) {
          completions.push({
            label: "loop",
            kind: CompletionItemKind.Variable,
            detail: "Loop variable",
            documentation: {
              kind: MarkupKind.Markdown,
              value: "Access loop information like `loop.index`, `loop.first`, `loop.last`, etc.",
            },
          });
        }

        // Prioritize parent() if inside a block
        if (scope.insideBlock) {
          const parentIndex = completions.findIndex((c) => c.label === "parent");
          if (parentIndex > 0) {
            const parentCompletion = completions[parentIndex];
            if (parentCompletion) {
              completions.splice(parentIndex, 1);
              completions.unshift({
                label: parentCompletion.label,
                kind: parentCompletion.kind,
                detail: parentCompletion.detail,
                documentation: parentCompletion.documentation,
                insertText: parentCompletion.insertText,
                insertTextFormat: parentCompletion.insertTextFormat,
                sortText: "0000parent", // Sort first
                preselect: true,
              });
            }
          }
        }
      }

      return completions;
    }

    case "none":
    default:
      return [];
  }
}
