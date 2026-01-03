import { Diagnostic, DiagnosticSeverity, Range } from "vscode-languageserver/node";
import { SyntaxNode, Tree } from "web-tree-sitter";

/**
 * Validates inline comment usage in Twig templates.
 * Detects when closing delimiters (}} or %}) appear on the same line as an inline comment,
 * which causes the delimiter to be consumed by the comment.
 */
export function validateInlineComments(tree: Tree): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  collectInlineCommentDiagnostics(tree.rootNode, diagnostics);
  return diagnostics;
}

function collectInlineCommentDiagnostics(node: SyntaxNode, diagnostics: Diagnostic[]): void {
  // Check if this is an output_statement or statement_block containing inline comments
  if (node.type === "output_statement" || node.type === "statement_block") {
    validateConstruct(node, diagnostics);
  }

  // Recurse into children
  for (const child of node.children) {
    collectInlineCommentDiagnostics(child, diagnostics);
  }
}

function validateConstruct(construct: SyntaxNode, diagnostics: Diagnostic[]): void {
  // Find all inline_comment nodes within this construct
  const inlineComments = findInlineComments(construct);
  if (inlineComments.length === 0) {
    return;
  }

  // Get the closing delimiter token (last child)
  const lastChild = construct.lastChild;
  if (!lastChild) {
    return;
  }

  // Check if last child is a closing delimiter
  const closingDelimiters = ["}}", "-}}", "%}", "-%}"];
  if (!closingDelimiters.includes(lastChild.type)) {
    return;
  }

  const delimiterLine = lastChild.startPosition.row;

  // Check each inline comment to see if it's on the same line as the closing delimiter
  for (const comment of inlineComments) {
    const commentLine = comment.startPosition.row;

    if (commentLine === delimiterLine) {
      // Invalid: inline comment on same line as closing delimiter
      const range: Range = {
        start: {
          line: comment.startPosition.row,
          character: comment.startPosition.column,
        },
        end: {
          line: comment.endPosition.row,
          character: comment.endPosition.column,
        },
      };

      diagnostics.push({
        severity: DiagnosticSeverity.Warning,
        range,
        message: "Inline comment extends to end of line. Move closing delimiter to next line.",
        source: "twig-sense",
      });
    }
  }
}

function findInlineComments(node: SyntaxNode): SyntaxNode[] {
  const comments: SyntaxNode[] = [];

  function traverse(n: SyntaxNode): void {
    if (n.type === "inline_comment") {
      comments.push(n);
    }
    for (const child of n.children) {
      traverse(child);
    }
  }

  traverse(node);
  return comments;
}
