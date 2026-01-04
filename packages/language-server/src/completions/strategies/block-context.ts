import { CompletionItem } from "vscode-languageserver/node";
import { TWIG_KEYWORDS, TWIG_FUNCTIONS, TWIG_TESTS } from "../../data";
import type { CompletionStrategy, CompletionParams } from "./base";
import { getVariableCompletions, getMacroCompletions } from "../dynamic-completions";
import {
  createLoopVariableCompletion,
  filterKeywordsByContext,
  prioritizeParentIfInBlock,
} from "../utils";

/**
 * Strategy for block context completions (inside {% ... %})
 * Provides: keywords, functions, variables, macros
 */
export class BlockContextStrategy implements CompletionStrategy {
  getCompletions(params: CompletionParams): CompletionItem[] {
    const { tree, context, scope, line, character } = params;

    // If after 'is' keyword, only return test completions
    if (context.isAfterIsKeyword) {
      return [...TWIG_TESTS];
    }

    // Filter keywords by context (only show relevant end*, else, elseif)
    const filteredKeywords = scope
      ? filterKeywordsByContext([...TWIG_KEYWORDS], scope)
      : [...TWIG_KEYWORDS];

    const completions = [...filteredKeywords, ...TWIG_FUNCTIONS];

    // Add document-specific completions if tree is available
    if (tree && scope) {
      // Add variable completions
      completions.push(...getVariableCompletions(tree, line, character));

      // Add macro completions
      completions.push(...getMacroCompletions(tree));

      // Add loop variable if inside a for loop
      if (scope.insideForLoop) {
        completions.push(createLoopVariableCompletion());
      }

      // Prioritize parent() if inside a block
      return prioritizeParentIfInBlock(completions, scope.insideBlock);
    }

    return completions;
  }
}
