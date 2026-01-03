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
  | "set";

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
};

/**
 * Extract all scoped blocks (if, for, block, macro, etc.) from the document
 * Includes both closed blocks (with end tag) and unclosed blocks (still open at end of document)
 */
export function extractScopedBlocks(tree: Tree): ScopedBlockInfo[] {
  const blocks: ScopedBlockInfo[] = [];
  const stack: Array<{ type: BlockType; startLine: number; startCharacter: number }> = [];

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

        // Check if this is an opening keyword
        if (text in BLOCK_PAIRS) {
          stack.push({
            type: text as BlockType,
            startLine: block.startPosition.row,
            startCharacter: block.startPosition.column,
          });
        }
        // Check if this is a closing keyword
        else if (text.startsWith("end")) {
          const openingType = text.substring(3) as BlockType;
          // Find the matching opening block (search from end of stack)
          for (let j = stack.length - 1; j >= 0; j--) {
            const stackItem = stack[j];
            if (stackItem && stackItem.type === openingType) {
              stack.splice(j, 1);
              blocks.push({
                type: stackItem.type,
                startLine: stackItem.startLine,
                endLine: block.endPosition.row,
                startCharacter: stackItem.startCharacter,
              });
              break;
            }
          }
        }
      }
    }
  }

  // Add any unclosed blocks from the stack (they extend to the end of the document)
  for (const openBlock of stack) {
    blocks.push({
      type: openBlock.type,
      startLine: openBlock.startLine,
      endLine: maxEndLine + 1000, // Use a large number to represent "extends to end of document"
      startCharacter: openBlock.startCharacter,
    });
  }

  return blocks;
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
  const scopedBlocks = extractScopedBlocks(tree);
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
