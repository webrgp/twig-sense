import { CompletionItem } from "vscode-languageserver/node";
import { TextDocument } from "vscode-languageserver-textdocument";
import type { Tree } from "web-tree-sitter";
import type { ContextInfo } from "../../context";
import type { ScopeInfo } from "../../document-analyzer";

/**
 * Parameters passed to completion strategies
 */
export interface CompletionParams {
  /** The text document */
  document: TextDocument;
  /** The parsed tree (if available) */
  tree?: Tree;
  /** The context information at the cursor position */
  context: ContextInfo;
  /** The scope information at the cursor position (if tree is available) */
  scope?: ScopeInfo;
  /** Line number (0-indexed) */
  line: number;
  /** Character position (0-indexed) */
  character: number;
}

/**
 * Interface for context-specific completion strategies
 */
export interface CompletionStrategy {
  /**
   * Get completions for this strategy's context
   */
  getCompletions(params: CompletionParams): CompletionItem[];
}
