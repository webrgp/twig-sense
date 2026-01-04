import {
  CompletionItem,
  CompletionItemKind,
  InsertTextFormat,
  MarkupKind,
} from "vscode-languageserver/node";
import type { Tree } from "web-tree-sitter";
import { analyzeDocument, getAvailableVariables } from "../document-analyzer";

/**
 * Get variable completions from the document analysis
 */
export function getVariableCompletions(
  tree: Tree,
  line: number,
  character: number
): CompletionItem[] {
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
export function getMacroCompletions(tree: Tree): CompletionItem[] {
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
export function getBlockNameCompletions(tree: Tree): CompletionItem[] {
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
