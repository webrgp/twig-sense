import { CompletionItem } from "vscode-languageserver/node";
import { TWIG_FILTERS } from "../../data";
import type { CompletionStrategy, CompletionParams } from "./base";

/**
 * Strategy for filter context completions (after | character)
 * Returns only filter completions
 */
export class FilterContextStrategy implements CompletionStrategy {
  getCompletions(_params: CompletionParams): CompletionItem[] {
    return [...TWIG_FILTERS];
  }
}
