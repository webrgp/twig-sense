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
  TWIG_KEYWORDS,
  TWIG_FILTERS,
  TWIG_FUNCTIONS,
  TWIG_TESTS,
  LOOP_VARIABLE_COMPLETIONS,
} from "./data";
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
