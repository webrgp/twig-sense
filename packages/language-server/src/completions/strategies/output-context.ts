import { CompletionItem } from "vscode-languageserver/node";
import { TWIG_FUNCTIONS, TWIG_TESTS } from "../../data";
import type { CompletionStrategy, CompletionParams } from "./base";
import { getVariableCompletions, getMacroCompletions } from "../dynamic-completions";
import { createLoopVariableCompletion, prioritizeParentIfInBlock } from "../utils";

/**
 * Strategy for output context completions (inside {{ ... }})
 * Provides: functions, variables, macros (no keywords)
 */
export class OutputContextStrategy implements CompletionStrategy {
  getCompletions(params: CompletionParams): CompletionItem[] {
    const { tree, context, scope, line, character } = params;

    // If after 'is' keyword, only return test completions
    if (context.isAfterIsKeyword) {
      return [...TWIG_TESTS];
    }

    const completions = [...TWIG_FUNCTIONS];

    // Add document-specific completions if tree is available
    if (tree) {
      // Add variable completions
      completions.push(...getVariableCompletions(tree, line, character));

      // Add macro completions
      completions.push(...getMacroCompletions(tree));

      // Add loop variable if inside a for loop
      if (scope?.insideForLoop) {
        completions.push(createLoopVariableCompletion());
      }

      // Prioritize parent() if inside a block
      if (scope) {
        return prioritizeParentIfInBlock(completions, scope.insideBlock);
      }
    }

    return completions;
  }
}
