import { CompletionItem, TextDocumentPositionParams } from "vscode-languageserver/node";
import { TextDocument } from "vscode-languageserver-textdocument";
import type { Tree } from "web-tree-sitter";
import { LOOP_VARIABLE_COMPLETIONS } from "../data";
import { getScopeAtPosition } from "../document-analyzer";
import { detectContext as getContextInfo, type TwigContextType } from "../context";
import {
  CompletionStrategy,
  BlockContextStrategy,
  OutputContextStrategy,
  FilterContextStrategy,
} from "./strategies";
import { getBlockNameCompletions } from "./dynamic-completions";

// Re-export types for backwards compatibility
export type { TwigContextType as TwigContext } from "../context";

// Re-export detectContext with backwards-compatible signature that returns just the type
export function detectContextType(
  document: TextDocument,
  position: { line: number; character: number }
): TwigContextType {
  return getContextInfo(document, position).type;
}

// Backwards compatibility alias
export { detectContextType as detectContext };

/**
 * Strategy registry map
 */
const strategies: Record<Exclude<TwigContextType, "none">, CompletionStrategy> = {
  block: new BlockContextStrategy(),
  output: new OutputContextStrategy(),
  filter: new FilterContextStrategy(),
};

/**
 * Get completions for a given document and position
 */
export function getCompletions(
  document: TextDocument,
  params: TextDocumentPositionParams,
  tree?: Tree
): CompletionItem[] {
  const { line, character } = params.position;
  const context = getContextInfo(document, params.position);

  // Get scope info if tree is available
  const scope = tree ? getScopeAtPosition(tree, line, character) : undefined;

  // Handle special cases first

  // Check for loop variable completions (loop.xxx)
  if (tree && context.isAfterLoopDot) {
    if (scope?.insideForLoop) {
      return LOOP_VARIABLE_COMPLETIONS;
    }
    // If not inside a for loop, don't suggest loop variables
    return [];
  }

  // Check for block name completions in block() function
  if (tree && context.isInBlockFunction) {
    return getBlockNameCompletions(tree);
  }

  // Check for block name completions after {% block keyword
  if (tree && context.isAfterBlockKeyword) {
    return getBlockNameCompletions(tree);
  }

  // If not in a Twig context, return empty
  if (context.type === "none") {
    return [];
  }

  // Delegate to appropriate strategy
  const strategy = strategies[context.type];
  return strategy.getCompletions({
    document,
    tree,
    context,
    scope,
    line,
    character,
  });
}
