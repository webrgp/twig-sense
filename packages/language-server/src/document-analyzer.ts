import type { Tree, SyntaxNode } from "web-tree-sitter";

/**
 * Information about a variable defined in the document
 */
export interface VariableInfo {
  name: string;
  /** Line number where the variable is defined (0-indexed) */
  line: number;
  /** Character position where the variable name starts */
  character: number;
}

/**
 * Information about a macro defined in the document
 */
export interface MacroInfo {
  name: string;
  parameters: string[];
  /** Line number where the macro is defined (0-indexed) */
  line: number;
  /** Character position where the macro name starts */
  character: number;
}

/**
 * Information about a block defined in the document
 */
export interface BlockInfo {
  name: string;
  /** Line number where the block is defined (0-indexed) */
  line: number;
  /** Character position where the block name starts */
  character: number;
  /** End line of the block (for scope detection) */
  endLine: number;
}

/**
 * Information about a for loop defined in the document
 */
export interface ForLoopInfo {
  /** The loop variable (e.g., "item" in "for item in items") */
  variable: string;
  /** The key variable if present (e.g., "key" in "for key, value in items") */
  keyVariable?: string;
  /** Start line of the for block (0-indexed) */
  startLine: number;
  /** End line of the for block */
  endLine: number;
  /** Character position where the for statement starts */
  startCharacter: number;
}

/**
 * Block type for scope tracking
 */
export type BlockType =
  | "if"
  | "for"
  | "block"
  | "macro"
  | "apply"
  | "autoescape"
  | "embed"
  | "sandbox"
  | "verbatim"
  | "cache"
  | "set"
  | "with";

/**
 * Location information for a tag keyword in the document
 */
export interface TagLocation {
  /** The keyword text (e.g., "if", "endif", "else") */
  keyword: string;
  /** Start line (0-indexed) */
  line: number;
  /** Start character (0-indexed) */
  character: number;
  /** End line (0-indexed) */
  endLine: number;
  /** End character (0-indexed) */
  endCharacter: number;
}

/**
 * A cross-nesting anomaly: a closer matched an opener by skipping over
 * intermediate unclosed blocks on the stack.
 */
export interface NestingError {
  /** The outer block that was matched by the closer */
  outer: TagLocation;
  /** The inner block(s) that were "crossed over" (skipped) */
  inner: TagLocation;
  /** The closing tag that caused the cross */
  closer: TagLocation;
}

/**
 * A mid-block keyword (else/elseif) that appears in an invalid context.
 */
export interface MisplacedKeyword {
  /** Location of the misplaced keyword */
  location: TagLocation;
  /** The block types where this keyword is valid */
  validParents: string[];
}

/**
 * Complete result of tag structure analysis, containing both scope data
 * and diagnostic data for block tag validation.
 */
export interface TagAnalysisResult {
  /** Successfully paired blocks (same as previous return type) */
  scopedBlocks: ScopedBlockInfo[];
  /** Opening tags left on the stack with no matching closer */
  unclosed: TagLocation[];
  /** Closing tags with no matching opener (limited to known BLOCK_PAIRS) */
  orphanClosers: TagLocation[];
  /** Cross-nesting anomalies where a closer skipped over intermediate blocks */
  nestingErrors: NestingError[];
  /** Mid-block keywords (else/elseif) in invalid contexts */
  misplacedKeywords: MisplacedKeyword[];
}

/**
 * Information about a scoped block in the document
 */
export interface ScopedBlockInfo {
  type: BlockType;
  startLine: number;
  endLine: number;
  startCharacter: number;
}

/**
 * Scope information for context-aware completions
 */
export interface ScopeInfo {
  /** Stack of currently open blocks (innermost last) */
  blockStack: Array<{
    type: BlockType;
    startLine: number;
    endLine?: number;
  }>;
  /** Whether we're inside a for loop (for loop variable access) */
  insideForLoop: boolean;
  /** Whether we're inside a block definition (for parent() priority) */
  insideBlock: boolean;
  /** Whether we're inside an if block */
  insideIf: boolean;
  /** The current for loop info if inside one */
  currentForLoop?: ForLoopInfo;
}

/**
 * Complete analysis of a document
 */
export interface DocumentAnalysis {
  variables: VariableInfo[];
  macros: MacroInfo[];
  blocks: BlockInfo[];
  forLoops: ForLoopInfo[];
}

/**
 * Get the text content of a node
 */
function getNodeText(node: SyntaxNode): string {
  return node.text;
}

/**
 * Find all statement_block nodes in the tree
 */
function* walkStatementBlocks(tree: Tree): Generator<SyntaxNode> {
  const cursor = tree.walk();

  let reachedRoot = false;
  while (!reachedRoot) {
    if (cursor.nodeType === "statement_block") {
      yield cursor.currentNode;
    }

    if (cursor.gotoFirstChild()) {
      continue;
    }

    if (cursor.gotoNextSibling()) {
      continue;
    }

    let retracing = true;
    while (retracing) {
      if (!cursor.gotoParent()) {
        retracing = false;
        reachedRoot = true;
      } else if (cursor.gotoNextSibling()) {
        retracing = false;
      }
    }
  }
}

/**
 * Extract variables defined with {% set %} in the document
 */
export function extractSetVariables(tree: Tree): VariableInfo[] {
  const variables: VariableInfo[] = [];

  for (const block of walkStatementBlocks(tree)) {
    const children = block.namedChildren;

    // Look for pattern: keyword(set) identifier operator(=) ...
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child && child.type === "keyword" && getNodeText(child) === "set") {
        // Next named child should be the variable name (identifier)
        const nextChild = children[i + 1];
        if (nextChild && nextChild.type === "identifier") {
          variables.push({
            name: getNodeText(nextChild),
            line: nextChild.startPosition.row,
            character: nextChild.startPosition.column,
          });
        }
      }
    }
  }

  return variables;
}

/**
 * Extract for loop information from the document
 */
export function extractForLoops(tree: Tree): ForLoopInfo[] {
  const forLoops: ForLoopInfo[] = [];
  const forStack: Array<{
    variable: string;
    keyVariable?: string;
    startLine: number;
    startCharacter: number;
  }> = [];

  for (const block of walkStatementBlocks(tree)) {
    const children = block.namedChildren;

    // Look for pattern: keyword(for) identifier [operator(,) identifier] keyword(in) ...
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (!child) continue;

      if (child.type === "keyword") {
        const text = getNodeText(child);

        if (text === "for") {
          // Parse for loop: {% for [key,] item in items %}
          let variable = "";
          let keyVariable: string | undefined;

          // Next child should be identifier (first variable)
          const firstVar = children[i + 1];
          if (firstVar && firstVar.type === "identifier") {
            const varName = getNodeText(firstVar);

            // Check if there's a comma (meaning key, value pattern)
            const nextNode = children[i + 2];
            if (nextNode && nextNode.type === "operator" && getNodeText(nextNode) === ",") {
              // key, value pattern
              keyVariable = varName;
              const valueVar = children[i + 3];
              if (valueVar && valueVar.type === "identifier") {
                variable = getNodeText(valueVar);
              }
            } else {
              // Just value pattern
              variable = varName;
            }
          }

          if (variable) {
            forStack.push({
              variable,
              keyVariable,
              startLine: block.startPosition.row,
              startCharacter: block.startPosition.column,
            });
          }
        } else if (text === "endfor") {
          // Pop from stack and create ForLoopInfo
          const forInfo = forStack.pop();
          if (forInfo) {
            forLoops.push({
              variable: forInfo.variable,
              keyVariable: forInfo.keyVariable,
              startLine: forInfo.startLine,
              endLine: block.endPosition.row,
              startCharacter: forInfo.startCharacter,
            });
          }
        }
      }
    }
  }

  return forLoops;
}

/**
 * Extract macro definitions from the document
 */
export function extractMacros(tree: Tree): MacroInfo[] {
  const macros: MacroInfo[] = [];

  for (const block of walkStatementBlocks(tree)) {
    const children = block.namedChildren;

    // Look for pattern: keyword(macro) identifier parenthesized(...)
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child && child.type === "keyword" && getNodeText(child) === "macro") {
        // Next named child should be the macro name (identifier)
        const nameNode = children[i + 1];
        if (nameNode && nameNode.type === "identifier") {
          const name = getNodeText(nameNode);
          const parameters: string[] = [];

          // Look for parenthesized content for parameters
          const paramsNode = children[i + 2];
          if (paramsNode && paramsNode.type === "parenthesized") {
            // Extract parameter names from parenthesized node
            for (const paramChild of paramsNode.namedChildren) {
              if (paramChild.type === "identifier") {
                parameters.push(getNodeText(paramChild));
              }
            }
          }

          macros.push({
            name,
            parameters,
            line: nameNode.startPosition.row,
            character: nameNode.startPosition.column,
          });
        }
      }
    }
  }

  return macros;
}

/**
 * Extract block definitions from the document
 */
export function extractBlocks(tree: Tree): BlockInfo[] {
  const blocks: BlockInfo[] = [];
  const blockStack: Array<{ name: string; line: number; character: number }> = [];

  for (const block of walkStatementBlocks(tree)) {
    const children = block.namedChildren;

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (!child) continue;

      if (child.type === "keyword") {
        const text = getNodeText(child);

        if (text === "block") {
          // Next named child should be the block name (identifier)
          const nameNode = children[i + 1];
          if (nameNode && nameNode.type === "identifier") {
            blockStack.push({
              name: getNodeText(nameNode),
              line: nameNode.startPosition.row,
              character: nameNode.startPosition.column,
            });
          }
        } else if (text === "endblock") {
          // Pop from stack and create BlockInfo
          const blockInfo = blockStack.pop();
          if (blockInfo) {
            blocks.push({
              name: blockInfo.name,
              line: blockInfo.line,
              character: blockInfo.character,
              endLine: block.endPosition.row,
            });
          }
        }
      }
    }
  }

  return blocks;
}

/**
 * Mapping of opening keywords to their closing keywords
 */
const BLOCK_PAIRS: Record<string, string> = {
  if: "endif",
  for: "endfor",
  block: "endblock",
  macro: "endmacro",
  apply: "endapply",
  autoescape: "endautoescape",
  embed: "endembed",
  sandbox: "endsandbox",
  verbatim: "endverbatim",
  cache: "endcache",
  set: "endset",
  with: "endwith",
};

/**
 * Rules for mid-block keywords: maps keyword to the valid parent block types
 * that can contain it (checked against innermost/stack-top block only).
 */
const MID_BLOCK_RULES: Record<string, string[]> = {
  else: ["if", "for"],
  elseif: ["if"],
};

/**
 * Check if a `set` statement_block is an inline assignment (has `=` operator).
 * Inline: `{% set x = 1 %}` — should NOT be pushed to pairing stack.
 * Block-form: `{% set content %}...{% endset %}` — should be pushed.
 */
function isInlineSet(statementBlock: SyntaxNode): boolean {
  for (const child of statementBlock.namedChildren) {
    if (child.type === "operator" && getNodeText(child) === "=") {
      return true;
    }
  }
  return false;
}

/**
 * Create a TagLocation from a keyword node and its parent statement_block.
 * Uses the statement_block's position for line/character (the full tag position).
 */
function makeTagLocation(keywordNode: SyntaxNode, statementBlock: SyntaxNode): TagLocation {
  return {
    keyword: getNodeText(keywordNode),
    line: statementBlock.startPosition.row,
    character: statementBlock.startPosition.column,
    endLine: statementBlock.endPosition.row,
    endCharacter: statementBlock.endPosition.column,
  };
}

/**
 * Extract all scoped blocks (if, for, block, macro, etc.) from the document.
 * Returns a TagAnalysisResult containing both paired blocks and diagnostic data
 * (unclosed tags, orphan closers, nesting errors, misplaced keywords).
 */
export function extractScopedBlocks(tree: Tree): TagAnalysisResult {
  const scopedBlocks: ScopedBlockInfo[] = [];
  const unclosed: TagLocation[] = [];
  const orphanClosers: TagLocation[] = [];
  const nestingErrors: NestingError[] = [];
  const misplacedKeywords: MisplacedKeyword[] = [];

  const stack: Array<{
    type: BlockType;
    startLine: number;
    startCharacter: number;
    tagLocation: TagLocation;
  }> = [];

  // Track the last line of the document for unclosed blocks
  let maxEndLine = 0;

  for (const block of walkStatementBlocks(tree)) {
    const children = block.namedChildren;

    // Update max end line
    if (block.endPosition.row > maxEndLine) {
      maxEndLine = block.endPosition.row;
    }

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (!child) continue;

      if (child.type === "keyword") {
        const text = getNodeText(child);

        // Check for mid-block keywords (else, elseif)
        if (text in MID_BLOCK_RULES) {
          const validParents = MID_BLOCK_RULES[text]!;
          const stackTop = stack[stack.length - 1];

          if (!stackTop || !validParents.includes(stackTop.type)) {
            misplacedKeywords.push({
              location: makeTagLocation(child, block),
              validParents,
            });
          }
          // Valid mid-block keywords don't modify the stack
          continue;
        }

        // Check if this is an opening keyword
        if (text in BLOCK_PAIRS) {
          // Inline set heuristic: skip stack push for inline assignments
          if (text === "set" && isInlineSet(block)) {
            continue;
          }

          stack.push({
            type: text as BlockType,
            startLine: block.startPosition.row,
            startCharacter: block.startPosition.column,
            tagLocation: makeTagLocation(child, block),
          });
        }
        // Check if this is a closing keyword
        else if (text.startsWith("end")) {
          const openingType = text.substring(3);

          // Only track closers whose base keyword is a known block type
          if (!(openingType in BLOCK_PAIRS)) {
            // Unknown end* keyword — silently ignore
            continue;
          }

          const closerLocation = makeTagLocation(child, block);

          // Find the matching opening block (search from end of stack)
          let matchIndex = -1;
          for (let j = stack.length - 1; j >= 0; j--) {
            const stackItem = stack[j];
            if (stackItem && stackItem.type === openingType) {
              matchIndex = j;
              break;
            }
          }

          if (matchIndex === -1) {
            // No matching opener found — orphan closer
            orphanClosers.push(closerLocation);
          } else {
            // Check for cross-nesting: items between matchIndex and stack top
            // were "crossed over" by this closer
            for (let k = stack.length - 1; k > matchIndex; k--) {
              const crossedItem = stack[k]!;
              nestingErrors.push({
                outer: stack[matchIndex]!.tagLocation,
                inner: crossedItem.tagLocation,
                closer: closerLocation,
              });
            }

            // Remove matched item and any crossed items
            const matchedItem = stack[matchIndex]!;
            stack.splice(matchIndex);

            scopedBlocks.push({
              type: matchedItem.type,
              startLine: matchedItem.startLine,
              endLine: block.endPosition.row,
              startCharacter: matchedItem.startCharacter,
            });
          }
        }
      }
    }
  }

  // Any remaining items on the stack are unclosed blocks
  for (const openBlock of stack) {
    unclosed.push(openBlock.tagLocation);

    // Still add to scopedBlocks for backward compatibility (scope detection)
    scopedBlocks.push({
      type: openBlock.type,
      startLine: openBlock.startLine,
      endLine: maxEndLine + 1000,
      startCharacter: openBlock.startCharacter,
    });
  }

  return {
    scopedBlocks,
    unclosed,
    orphanClosers,
    nestingErrors,
    misplacedKeywords,
  };
}

/**
 * Analyze the document and extract all relevant information
 */
export function analyzeDocument(tree: Tree): DocumentAnalysis {
  return {
    variables: extractSetVariables(tree),
    macros: extractMacros(tree),
    blocks: extractBlocks(tree),
    forLoops: extractForLoops(tree),
  };
}

/**
 * Get scope information at a specific position in the document
 */
export function getScopeAtPosition(tree: Tree, line: number, _character: number): ScopeInfo {
  const { scopedBlocks } = extractScopedBlocks(tree);
  const analysis = analyzeDocument(tree);

  const blockStack: ScopeInfo["blockStack"] = [];
  let insideForLoop = false;
  let insideBlock = false;
  let insideIf = false;
  let currentForLoop: ForLoopInfo | undefined;

  // Check which scoped blocks contain the current position
  for (const block of scopedBlocks) {
    if (line >= block.startLine && line <= block.endLine) {
      blockStack.push({
        type: block.type,
        startLine: block.startLine,
        endLine: block.endLine,
      });

      // Set convenience flags
      if (block.type === "for") {
        insideForLoop = true;
      } else if (block.type === "block") {
        insideBlock = true;
      } else if (block.type === "if") {
        insideIf = true;
      }
    }
  }

  // Find the current for loop info if inside one
  if (insideForLoop) {
    for (const forLoop of analysis.forLoops) {
      if (line >= forLoop.startLine && line <= forLoop.endLine) {
        currentForLoop = forLoop;
        break;
      }
    }
  }

  // Sort block stack by start line (innermost last)
  blockStack.sort((a, b) => a.startLine - b.startLine);

  return {
    blockStack,
    insideForLoop,
    insideBlock,
    insideIf,
    currentForLoop,
  };
}

/**
 * Get variables available at a specific position
 */
export function getAvailableVariables(tree: Tree, line: number, character: number): VariableInfo[] {
  const analysis = analyzeDocument(tree);
  const scope = getScopeAtPosition(tree, line, character);

  const available: VariableInfo[] = [];

  // Add all set variables defined before the current position
  for (const variable of analysis.variables) {
    if (variable.line < line || (variable.line === line && variable.character < character)) {
      available.push(variable);
    }
  }

  // Add for loop variables if inside a for loop
  if (scope.insideForLoop && scope.currentForLoop) {
    available.push({
      name: scope.currentForLoop.variable,
      line: scope.currentForLoop.startLine,
      character: scope.currentForLoop.startCharacter,
    });

    if (scope.currentForLoop.keyVariable) {
      available.push({
        name: scope.currentForLoop.keyVariable,
        line: scope.currentForLoop.startLine,
        character: scope.currentForLoop.startCharacter,
      });
    }
  }

  return available;
}
