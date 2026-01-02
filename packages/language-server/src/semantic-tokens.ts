import { Tree, SyntaxNode } from "web-tree-sitter";

// Token types must match the legend in server.ts
const TOKEN_TYPES = {
  variable: 0,
  property: 1,
  function: 2,
  keyword: 3,
  operator: 4,
  string: 5,
  number: 6,
  comment: 7,
};

interface Token {
  line: number;
  startChar: number;
  length: number;
  tokenType: number;
  tokenModifiers: number;
}

// Valid Twig construct types that contain tokenizable content
const TWIG_CONSTRUCTS = new Set([
  "output_statement",
  "statement_block",
  "comment",
]);

export function generateSemanticTokens(tree: Tree): number[] {
  const tokens: Token[] = [];
  collectTokens(tree.rootNode, tokens, false);

  // Sort tokens by position (line, then column)
  tokens.sort((a, b) => {
    if (a.line !== b.line) {
      return a.line - b.line;
    }
    return a.startChar - b.startChar;
  });

  // Convert to delta-encoded format
  return encodeTokens(tokens);
}

function collectTokens(
  node: SyntaxNode,
  tokens: Token[],
  insideTwigConstruct: boolean
): void {
  // Check if we're entering a Twig construct
  const isThisTwigConstruct = TWIG_CONSTRUCTS.has(node.type);
  const inTwig = insideTwigConstruct || isThisTwigConstruct;

  // Only emit tokens for nodes inside valid Twig constructs
  if (inTwig && !node.hasError) {
    const tokenType = getTokenType(node);
    if (tokenType !== null) {
      tokens.push({
        line: node.startPosition.row,
        startChar: node.startPosition.column,
        length: node.endPosition.column - node.startPosition.column,
        tokenType,
        tokenModifiers: 0,
      });
    }
  }

  // Recurse into children
  for (const child of node.children) {
    collectTokens(child, tokens, inTwig);
  }
}

function getTokenType(node: SyntaxNode): number | null {
  const nodeType = node.type;

  switch (nodeType) {
    case "keyword":
      return TOKEN_TYPES.keyword;

    case "operator":
      return TOKEN_TYPES.operator;

    case "string":
      return TOKEN_TYPES.string;

    case "number":
      return TOKEN_TYPES.number;

    case "comment_content":
      return TOKEN_TYPES.comment;

    case "identifier":
      return getIdentifierTokenType(node);

    default:
      return null;
  }
}

function getIdentifierTokenType(node: SyntaxNode): number {
  const parent = node.parent;
  if (!parent) {
    return TOKEN_TYPES.variable;
  }

  // Identifier inside property_access (e.g., .name in user.name) -> property
  if (parent.type === "property_access") {
    return TOKEN_TYPES.property;
  }

  // Identifier inside filter (e.g., upper in name|upper) -> function
  if (parent.type === "filter") {
    return TOKEN_TYPES.function;
  }

  // Default: variable
  return TOKEN_TYPES.variable;
}

function encodeTokens(tokens: Token[]): number[] {
  const data: number[] = [];
  let prevLine = 0;
  let prevChar = 0;

  for (const token of tokens) {
    // Delta line
    const deltaLine = token.line - prevLine;
    // Delta start character (reset to absolute if on new line)
    const deltaStartChar = deltaLine === 0 ? token.startChar - prevChar : token.startChar;

    data.push(
      deltaLine,
      deltaStartChar,
      token.length,
      token.tokenType,
      token.tokenModifiers
    );

    prevLine = token.line;
    prevChar = token.startChar;
  }

  return data;
}
