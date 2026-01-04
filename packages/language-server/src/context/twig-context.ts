import { TextDocument } from "vscode-languageserver-textdocument";

/**
 * Context types for Twig completions
 */
export type TwigContextType = "output" | "block" | "filter" | "none";

/**
 * Extended context information with all context flags
 */
export interface ContextInfo {
  /** The primary context type */
  type: TwigContextType;
  /** Whether cursor is after 'is' keyword (for test completions) */
  isAfterIsKeyword: boolean;
  /** Whether cursor is after 'loop.' (for loop variable completions) */
  isAfterLoopDot: boolean;
  /** Whether cursor is inside block() function (for block name completions) */
  isInBlockFunction: boolean;
  /** Whether cursor is after '{% block ' keyword (for block name completions) */
  isAfterBlockKeyword: boolean;
}

/**
 * Detect the Twig context type at a given position
 */
export function detectContextType(
  document: TextDocument,
  position: { line: number; character: number }
): TwigContextType {
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
export function isAfterIsKeyword(document: TextDocument, offset: number): boolean {
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
export function isAfterLoopDot(document: TextDocument, offset: number): boolean {
  const text = document.getText();
  const textBefore = text.substring(0, offset);

  // Check if we're after "loop."
  return /\bloop\.\s*[a-zA-Z_]*$/.test(textBefore);
}

/**
 * Check if cursor is after "block('" for block name completions
 */
export function isInBlockFunction(document: TextDocument, offset: number): boolean {
  const text = document.getText();
  const textBefore = text.substring(0, offset);

  // Check if we're inside block('...')
  return /\bblock\s*\(\s*['"][^'"]*$/.test(textBefore);
}

/**
 * Check if cursor is after "{% block " for block name completions
 */
export function isAfterBlockKeyword(document: TextDocument, offset: number): boolean {
  const text = document.getText();
  const textBefore = text.substring(0, offset);

  // Find the last {% and check if it's followed by "block "
  const lastBlockOpen = textBefore.lastIndexOf("{%");
  if (lastBlockOpen === -1) return false;

  const afterDelimiter = textBefore.substring(lastBlockOpen);
  return /\{%-?\s*block\s+[a-zA-Z_]*$/.test(afterDelimiter);
}

/**
 * Detect complete context information at a given position
 */
export function detectContext(
  document: TextDocument,
  position: { line: number; character: number }
): ContextInfo {
  const offset = document.offsetAt(position);

  return {
    type: detectContextType(document, position),
    isAfterIsKeyword: isAfterIsKeyword(document, offset),
    isAfterLoopDot: isAfterLoopDot(document, offset),
    isInBlockFunction: isInBlockFunction(document, offset),
    isAfterBlockKeyword: isAfterBlockKeyword(document, offset),
  };
}
