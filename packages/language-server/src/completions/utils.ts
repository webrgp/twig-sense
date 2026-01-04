import { CompletionItem, CompletionItemKind, MarkupKind } from "vscode-languageserver/node";
import type { ScopeInfo, BlockType } from "../document-analyzer";

/**
 * Create the loop variable completion item
 */
export function createLoopVariableCompletion(): CompletionItem {
  return {
    label: "loop",
    kind: CompletionItemKind.Variable,
    detail: "Loop variable",
    documentation: {
      kind: MarkupKind.Markdown,
      value: "Access loop information like `loop.index`, `loop.first`, `loop.last`, etc.",
    },
  };
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
export function filterKeywordsByContext(
  keywords: CompletionItem[],
  scope: ScopeInfo
): CompletionItem[] {
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
 * Prioritize parent() completion if inside a block
 */
export function prioritizeParentIfInBlock(
  completions: CompletionItem[],
  insideBlock: boolean
): CompletionItem[] {
  if (!insideBlock) {
    return completions;
  }

  const parentIndex = completions.findIndex((c) => c.label === "parent");
  if (parentIndex > 0) {
    const parentCompletion = completions[parentIndex];
    if (parentCompletion) {
      // Remove from current position
      const result = completions.filter((_, i) => i !== parentIndex);
      // Add at beginning with priority
      result.unshift({
        label: parentCompletion.label,
        kind: parentCompletion.kind,
        detail: parentCompletion.detail,
        documentation: parentCompletion.documentation,
        insertText: parentCompletion.insertText,
        insertTextFormat: parentCompletion.insertTextFormat,
        sortText: "0000parent", // Sort first
        preselect: true,
      });
      return result;
    }
  }

  return completions;
}
