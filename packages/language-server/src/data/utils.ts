import { MarkupContent, MarkupKind } from "vscode-languageserver/node";

/**
 * Create a MarkupContent object for markdown documentation
 */
export function md(content: string): MarkupContent {
  return { kind: MarkupKind.Markdown, value: content };
}
