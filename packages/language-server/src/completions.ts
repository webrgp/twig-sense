import {
  CompletionItem,
  CompletionItemKind,
  TextDocumentPositionParams,
  InsertTextFormat,
} from "vscode-languageserver/node";
import { TextDocument } from "vscode-languageserver-textdocument";

/**
 * Context types for Twig completions
 */
export type TwigContext = "output" | "block" | "filter" | "none";

/**
 * Twig keywords used in block statements ({% ... %})
 */
const TWIG_KEYWORDS: CompletionItem[] = [
  { label: "if", kind: CompletionItemKind.Keyword, insertText: "if ${1:condition}", insertTextFormat: InsertTextFormat.Snippet, detail: "Conditional statement" },
  { label: "elseif", kind: CompletionItemKind.Keyword, insertText: "elseif ${1:condition}", insertTextFormat: InsertTextFormat.Snippet, detail: "Else-if branch" },
  { label: "else", kind: CompletionItemKind.Keyword, detail: "Else branch" },
  { label: "endif", kind: CompletionItemKind.Keyword, detail: "End if statement" },
  { label: "for", kind: CompletionItemKind.Keyword, insertText: "for ${1:item} in ${2:items}", insertTextFormat: InsertTextFormat.Snippet, detail: "For loop" },
  { label: "endfor", kind: CompletionItemKind.Keyword, detail: "End for loop" },
  { label: "block", kind: CompletionItemKind.Keyword, insertText: "block ${1:name}", insertTextFormat: InsertTextFormat.Snippet, detail: "Define a block" },
  { label: "endblock", kind: CompletionItemKind.Keyword, detail: "End block" },
  { label: "extends", kind: CompletionItemKind.Keyword, insertText: "extends '${1:template}'", insertTextFormat: InsertTextFormat.Snippet, detail: "Extend a template" },
  { label: "include", kind: CompletionItemKind.Keyword, insertText: "include '${1:template}'", insertTextFormat: InsertTextFormat.Snippet, detail: "Include a template" },
  { label: "set", kind: CompletionItemKind.Keyword, insertText: "set ${1:name} = ${2:value}", insertTextFormat: InsertTextFormat.Snippet, detail: "Set a variable" },
  { label: "endset", kind: CompletionItemKind.Keyword, detail: "End set block" },
  { label: "macro", kind: CompletionItemKind.Keyword, insertText: "macro ${1:name}(${2:args})", insertTextFormat: InsertTextFormat.Snippet, detail: "Define a macro" },
  { label: "endmacro", kind: CompletionItemKind.Keyword, detail: "End macro" },
  { label: "import", kind: CompletionItemKind.Keyword, insertText: "import '${1:template}' as ${2:name}", insertTextFormat: InsertTextFormat.Snippet, detail: "Import macros" },
  { label: "from", kind: CompletionItemKind.Keyword, insertText: "from '${1:template}' import ${2:macro}", insertTextFormat: InsertTextFormat.Snippet, detail: "Import specific macros" },
  { label: "with", kind: CompletionItemKind.Keyword, insertText: "with { ${1:key}: ${2:value} }", insertTextFormat: InsertTextFormat.Snippet, detail: "Pass variables" },
  { label: "apply", kind: CompletionItemKind.Keyword, insertText: "apply ${1:filter}", insertTextFormat: InsertTextFormat.Snippet, detail: "Apply filter to block" },
  { label: "endapply", kind: CompletionItemKind.Keyword, detail: "End apply block" },
  { label: "autoescape", kind: CompletionItemKind.Keyword, insertText: "autoescape '${1|html,js,css,url,html_attr|}'", insertTextFormat: InsertTextFormat.Snippet, detail: "Auto-escape block" },
  { label: "endautoescape", kind: CompletionItemKind.Keyword, detail: "End autoescape" },
  { label: "embed", kind: CompletionItemKind.Keyword, insertText: "embed '${1:template}'", insertTextFormat: InsertTextFormat.Snippet, detail: "Embed a template" },
  { label: "endembed", kind: CompletionItemKind.Keyword, detail: "End embed" },
  { label: "flush", kind: CompletionItemKind.Keyword, detail: "Flush output buffer" },
  { label: "sandbox", kind: CompletionItemKind.Keyword, detail: "Sandbox block" },
  { label: "endsandbox", kind: CompletionItemKind.Keyword, detail: "End sandbox" },
  { label: "use", kind: CompletionItemKind.Keyword, insertText: "use '${1:template}'", insertTextFormat: InsertTextFormat.Snippet, detail: "Use template traits" },
  { label: "verbatim", kind: CompletionItemKind.Keyword, detail: "Raw output (no parsing)" },
  { label: "endverbatim", kind: CompletionItemKind.Keyword, detail: "End verbatim" },
  { label: "do", kind: CompletionItemKind.Keyword, insertText: "do ${1:expression}", insertTextFormat: InsertTextFormat.Snippet, detail: "Execute without output" },
  { label: "cache", kind: CompletionItemKind.Keyword, insertText: "cache '${1:key}'", insertTextFormat: InsertTextFormat.Snippet, detail: "Cache block" },
  { label: "endcache", kind: CompletionItemKind.Keyword, detail: "End cache" },
  { label: "deprecated", kind: CompletionItemKind.Keyword, insertText: "deprecated '${1:message}'", insertTextFormat: InsertTextFormat.Snippet, detail: "Mark as deprecated" },
];

/**
 * Twig built-in filters
 */
const TWIG_FILTERS: CompletionItem[] = [
  { label: "abs", kind: CompletionItemKind.Function, detail: "Absolute value" },
  { label: "batch", kind: CompletionItemKind.Function, insertText: "batch(${1:size})", insertTextFormat: InsertTextFormat.Snippet, detail: "Batch items" },
  { label: "capitalize", kind: CompletionItemKind.Function, detail: "Capitalize first char" },
  { label: "column", kind: CompletionItemKind.Function, insertText: "column('${1:name}')", insertTextFormat: InsertTextFormat.Snippet, detail: "Extract column" },
  { label: "convert_encoding", kind: CompletionItemKind.Function, insertText: "convert_encoding('${1:to}', '${2:from}')", insertTextFormat: InsertTextFormat.Snippet, detail: "Convert encoding" },
  { label: "country_name", kind: CompletionItemKind.Function, detail: "Country name" },
  { label: "currency_name", kind: CompletionItemKind.Function, detail: "Currency name" },
  { label: "currency_symbol", kind: CompletionItemKind.Function, detail: "Currency symbol" },
  { label: "data_uri", kind: CompletionItemKind.Function, detail: "Data URI" },
  { label: "date", kind: CompletionItemKind.Function, insertText: "date('${1:format}')", insertTextFormat: InsertTextFormat.Snippet, detail: "Format date" },
  { label: "date_modify", kind: CompletionItemKind.Function, insertText: "date_modify('${1:modifier}')", insertTextFormat: InsertTextFormat.Snippet, detail: "Modify date" },
  { label: "default", kind: CompletionItemKind.Function, insertText: "default('${1:value}')", insertTextFormat: InsertTextFormat.Snippet, detail: "Default value" },
  { label: "escape", kind: CompletionItemKind.Function, insertText: "escape('${1|html,js,css,url,html_attr|}')", insertTextFormat: InsertTextFormat.Snippet, detail: "Escape string" },
  { label: "e", kind: CompletionItemKind.Function, insertText: "e('${1|html,js,css,url,html_attr|}')", insertTextFormat: InsertTextFormat.Snippet, detail: "Escape (alias)" },
  { label: "filter", kind: CompletionItemKind.Function, insertText: "filter(${1:arrow})", insertTextFormat: InsertTextFormat.Snippet, detail: "Filter items" },
  { label: "first", kind: CompletionItemKind.Function, detail: "First element" },
  { label: "format", kind: CompletionItemKind.Function, insertText: "format(${1:args})", insertTextFormat: InsertTextFormat.Snippet, detail: "Format string" },
  { label: "format_currency", kind: CompletionItemKind.Function, insertText: "format_currency('${1:currency}')", insertTextFormat: InsertTextFormat.Snippet, detail: "Format currency" },
  { label: "format_date", kind: CompletionItemKind.Function, detail: "Format date (locale)" },
  { label: "format_datetime", kind: CompletionItemKind.Function, detail: "Format datetime" },
  { label: "format_number", kind: CompletionItemKind.Function, detail: "Format number" },
  { label: "format_time", kind: CompletionItemKind.Function, detail: "Format time" },
  { label: "html_to_markdown", kind: CompletionItemKind.Function, detail: "HTML to Markdown" },
  { label: "inline_css", kind: CompletionItemKind.Function, detail: "Inline CSS" },
  { label: "inky_to_html", kind: CompletionItemKind.Function, detail: "Inky to HTML" },
  { label: "join", kind: CompletionItemKind.Function, insertText: "join('${1:glue}')", insertTextFormat: InsertTextFormat.Snippet, detail: "Join array" },
  { label: "json_encode", kind: CompletionItemKind.Function, detail: "Encode as JSON" },
  { label: "keys", kind: CompletionItemKind.Function, detail: "Array keys" },
  { label: "language_name", kind: CompletionItemKind.Function, detail: "Language name" },
  { label: "last", kind: CompletionItemKind.Function, detail: "Last element" },
  { label: "length", kind: CompletionItemKind.Function, detail: "Length/count" },
  { label: "locale_name", kind: CompletionItemKind.Function, detail: "Locale name" },
  { label: "lower", kind: CompletionItemKind.Function, detail: "Lowercase" },
  { label: "map", kind: CompletionItemKind.Function, insertText: "map(${1:arrow})", insertTextFormat: InsertTextFormat.Snippet, detail: "Map items" },
  { label: "markdown_to_html", kind: CompletionItemKind.Function, detail: "Markdown to HTML" },
  { label: "merge", kind: CompletionItemKind.Function, insertText: "merge(${1:array})", insertTextFormat: InsertTextFormat.Snippet, detail: "Merge arrays" },
  { label: "nl2br", kind: CompletionItemKind.Function, detail: "Newlines to <br>" },
  { label: "number_format", kind: CompletionItemKind.Function, insertText: "number_format(${1:decimals})", insertTextFormat: InsertTextFormat.Snippet, detail: "Format number" },
  { label: "raw", kind: CompletionItemKind.Function, detail: "Raw output" },
  { label: "reduce", kind: CompletionItemKind.Function, insertText: "reduce(${1:arrow})", insertTextFormat: InsertTextFormat.Snippet, detail: "Reduce array" },
  { label: "replace", kind: CompletionItemKind.Function, insertText: "replace({ '${1:from}': '${2:to}' })", insertTextFormat: InsertTextFormat.Snippet, detail: "Replace text" },
  { label: "reverse", kind: CompletionItemKind.Function, detail: "Reverse array/string" },
  { label: "round", kind: CompletionItemKind.Function, insertText: "round(${1:precision})", insertTextFormat: InsertTextFormat.Snippet, detail: "Round number" },
  { label: "slice", kind: CompletionItemKind.Function, insertText: "slice(${1:start}, ${2:length})", insertTextFormat: InsertTextFormat.Snippet, detail: "Slice array/string" },
  { label: "slug", kind: CompletionItemKind.Function, detail: "URL slug" },
  { label: "sort", kind: CompletionItemKind.Function, detail: "Sort array" },
  { label: "spaceless", kind: CompletionItemKind.Function, detail: "Remove whitespace" },
  { label: "split", kind: CompletionItemKind.Function, insertText: "split('${1:delimiter}')", insertTextFormat: InsertTextFormat.Snippet, detail: "Split string" },
  { label: "striptags", kind: CompletionItemKind.Function, detail: "Strip HTML tags" },
  { label: "timezone_name", kind: CompletionItemKind.Function, detail: "Timezone name" },
  { label: "title", kind: CompletionItemKind.Function, detail: "Title case" },
  { label: "trim", kind: CompletionItemKind.Function, detail: "Trim whitespace" },
  { label: "u", kind: CompletionItemKind.Function, detail: "Unicode string" },
  { label: "upper", kind: CompletionItemKind.Function, detail: "Uppercase" },
  { label: "url_encode", kind: CompletionItemKind.Function, detail: "URL encode" },
];

/**
 * Twig built-in functions
 */
const TWIG_FUNCTIONS: CompletionItem[] = [
  { label: "attribute", kind: CompletionItemKind.Function, insertText: "attribute(${1:object}, ${2:method})", insertTextFormat: InsertTextFormat.Snippet, detail: "Dynamic attribute access" },
  { label: "block", kind: CompletionItemKind.Function, insertText: "block('${1:name}')", insertTextFormat: InsertTextFormat.Snippet, detail: "Render a block" },
  { label: "constant", kind: CompletionItemKind.Function, insertText: "constant('${1:name}')", insertTextFormat: InsertTextFormat.Snippet, detail: "Get constant value" },
  { label: "country_names", kind: CompletionItemKind.Function, detail: "List country names" },
  { label: "country_timezones", kind: CompletionItemKind.Function, detail: "List country timezones" },
  { label: "currency_names", kind: CompletionItemKind.Function, detail: "List currency names" },
  { label: "cycle", kind: CompletionItemKind.Function, insertText: "cycle(${1:array}, ${2:position})", insertTextFormat: InsertTextFormat.Snippet, detail: "Cycle through values" },
  { label: "date", kind: CompletionItemKind.Function, insertText: "date('${1:date}')", insertTextFormat: InsertTextFormat.Snippet, detail: "Create date object" },
  { label: "dump", kind: CompletionItemKind.Function, insertText: "dump(${1:variable})", insertTextFormat: InsertTextFormat.Snippet, detail: "Debug dump" },
  { label: "html_classes", kind: CompletionItemKind.Function, insertText: "html_classes(${1:classes})", insertTextFormat: InsertTextFormat.Snippet, detail: "Generate class list" },
  { label: "include", kind: CompletionItemKind.Function, insertText: "include('${1:template}')", insertTextFormat: InsertTextFormat.Snippet, detail: "Include template" },
  { label: "language_names", kind: CompletionItemKind.Function, detail: "List language names" },
  { label: "locale_names", kind: CompletionItemKind.Function, detail: "List locale names" },
  { label: "max", kind: CompletionItemKind.Function, insertText: "max(${1:values})", insertTextFormat: InsertTextFormat.Snippet, detail: "Maximum value" },
  { label: "min", kind: CompletionItemKind.Function, insertText: "min(${1:values})", insertTextFormat: InsertTextFormat.Snippet, detail: "Minimum value" },
  { label: "parent", kind: CompletionItemKind.Function, detail: "Parent block content" },
  { label: "random", kind: CompletionItemKind.Function, insertText: "random(${1:values})", insertTextFormat: InsertTextFormat.Snippet, detail: "Random value" },
  { label: "range", kind: CompletionItemKind.Function, insertText: "range(${1:low}, ${2:high})", insertTextFormat: InsertTextFormat.Snippet, detail: "Generate range" },
  { label: "script_names", kind: CompletionItemKind.Function, detail: "List script names" },
  { label: "source", kind: CompletionItemKind.Function, insertText: "source('${1:template}')", insertTextFormat: InsertTextFormat.Snippet, detail: "Template source" },
  { label: "template_from_string", kind: CompletionItemKind.Function, insertText: "template_from_string('${1:template}')", insertTextFormat: InsertTextFormat.Snippet, detail: "Template from string" },
  { label: "timezone_names", kind: CompletionItemKind.Function, detail: "List timezone names" },
];

/**
 * Twig tests (used with 'is' operator)
 */
const TWIG_TESTS: CompletionItem[] = [
  { label: "constant", kind: CompletionItemKind.Keyword, insertText: "constant('${1:name}')", insertTextFormat: InsertTextFormat.Snippet, detail: "Test against constant" },
  { label: "defined", kind: CompletionItemKind.Keyword, detail: "Is defined" },
  { label: "divisible by", kind: CompletionItemKind.Keyword, insertText: "divisible by(${1:number})", insertTextFormat: InsertTextFormat.Snippet, detail: "Divisibility test" },
  { label: "empty", kind: CompletionItemKind.Keyword, detail: "Is empty" },
  { label: "even", kind: CompletionItemKind.Keyword, detail: "Is even" },
  { label: "iterable", kind: CompletionItemKind.Keyword, detail: "Is iterable" },
  { label: "null", kind: CompletionItemKind.Keyword, detail: "Is null" },
  { label: "odd", kind: CompletionItemKind.Keyword, detail: "Is odd" },
  { label: "same as", kind: CompletionItemKind.Keyword, insertText: "same as(${1:value})", insertTextFormat: InsertTextFormat.Snippet, detail: "Strict equality" },
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
        lastOutputOpen !== -1 &&
        (lastOutputClose === -1 || lastOutputOpen > lastOutputClose);
      const inBlock =
        lastBlockOpen !== -1 &&
        (lastBlockClose === -1 || lastBlockOpen > lastBlockClose);

      if (inOutput || inBlock) {
        return "filter";
      }
    }
  }

  // Check for block context (inside {% ... %})
  const lastBlockOpen = textBefore.lastIndexOf("{%");
  const lastBlockClose = textBefore.lastIndexOf("%}");
  if (
    lastBlockOpen !== -1 &&
    (lastBlockClose === -1 || lastBlockOpen > lastBlockClose)
  ) {
    return "block";
  }

  // Check for output context (inside {{ ... }})
  const lastOutputOpen = textBefore.lastIndexOf("{{");
  const lastOutputClose = textBefore.lastIndexOf("}}");
  if (
    lastOutputOpen !== -1 &&
    (lastOutputClose === -1 || lastOutputOpen > lastOutputClose)
  ) {
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
 * Get completions for a given document and position
 */
export function getCompletions(
  document: TextDocument,
  params: TextDocumentPositionParams
): CompletionItem[] {
  const context = detectContext(document, params.position);
  const offset = document.offsetAt(params.position);

  switch (context) {
    case "filter":
      return TWIG_FILTERS;

    case "block":
      // In block context, provide keywords
      // Also check if after 'is' for test completions
      if (isAfterIsKeyword(document, offset)) {
        return TWIG_TESTS;
      }
      return [...TWIG_KEYWORDS, ...TWIG_FUNCTIONS];

    case "output":
      // In output context, provide functions and check for 'is' tests
      if (isAfterIsKeyword(document, offset)) {
        return TWIG_TESTS;
      }
      return TWIG_FUNCTIONS;

    case "none":
    default:
      return [];
  }
}
