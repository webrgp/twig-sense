import { describe, it, expect, beforeAll } from "vitest";
import * as path from "path";
import Parser from "web-tree-sitter";
import { generateSemanticTokens } from "../semantic-tokens";

// Token type indices (must match TOKEN_TYPES in semantic-tokens.ts)
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

let parser: Parser;

beforeAll(async () => {
  const wasmPath = path.join(__dirname, "../../dist/tree-sitter.wasm");
  await Parser.init({
    locateFile: () => wasmPath,
  });

  parser = new Parser();
  const langWasmPath = path.join(__dirname, "../../dist/tree-sitter-twig.wasm");
  const TwigLang = await Parser.Language.load(langWasmPath);
  parser.setLanguage(TwigLang);
});

function parseAndGetTokens(template: string): number[] {
  const tree = parser.parse(template);
  return generateSemanticTokens(tree);
}

// Decode delta-encoded tokens back to absolute positions for easier testing
interface DecodedToken {
  line: number;
  startChar: number;
  length: number;
  tokenType: number;
  tokenModifiers: number;
}

function decodeTokens(data: number[]): DecodedToken[] {
  const tokens: DecodedToken[] = [];
  let prevLine = 0;
  let prevChar = 0;

  for (let i = 0; i < data.length; i += 5) {
    const deltaLine = data[i];
    const deltaStartChar = data[i + 1];
    const length = data[i + 2];
    const tokenType = data[i + 3];
    const tokenModifiers = data[i + 4];

    const line = prevLine + deltaLine;
    const startChar = deltaLine === 0 ? prevChar + deltaStartChar : deltaStartChar;

    tokens.push({ line, startChar, length, tokenType, tokenModifiers });

    prevLine = line;
    prevChar = startChar;
  }

  return tokens;
}

function findToken(
  tokens: DecodedToken[],
  line: number,
  startChar: number
): DecodedToken | undefined {
  return tokens.find((t) => t.line === line && t.startChar === startChar);
}

describe("generateSemanticTokens", () => {
  describe("variable tokens", () => {
    it("generates variable token for identifier in output", () => {
      const tokens = decodeTokens(parseAndGetTokens("{{ user }}"));
      const varToken = tokens.find((t) => t.tokenType === TOKEN_TYPES.variable);
      expect(varToken).toBeDefined();
      expect(varToken!.length).toBe(4); // "user" is 4 chars
    });

    it("generates variable token for first identifier in expression", () => {
      const tokens = decodeTokens(parseAndGetTokens("{{ myVariable }}"));
      const varToken = tokens.find((t) => t.tokenType === TOKEN_TYPES.variable);
      expect(varToken).toBeDefined();
    });
  });

  describe("property tokens", () => {
    it("generates property token for property access", () => {
      const tokens = decodeTokens(parseAndGetTokens("{{ user.name }}"));
      const propToken = tokens.find((t) => t.tokenType === TOKEN_TYPES.property);
      expect(propToken).toBeDefined();
      // "name" should be marked as property
      expect(propToken!.length).toBe(4);
    });

    it("generates both variable and property tokens for chained access", () => {
      const tokens = decodeTokens(parseAndGetTokens("{{ user.profile }}"));
      const varTokens = tokens.filter((t) => t.tokenType === TOKEN_TYPES.variable);
      const propTokens = tokens.filter((t) => t.tokenType === TOKEN_TYPES.property);

      // "user" should be variable, "profile" should be property
      expect(varTokens.length).toBeGreaterThanOrEqual(1);
      expect(propTokens.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("filter function tokens", () => {
    it("generates function token for filter name", () => {
      const tokens = decodeTokens(parseAndGetTokens("{{ name|upper }}"));
      const funcToken = tokens.find((t) => t.tokenType === TOKEN_TYPES.function);
      expect(funcToken).toBeDefined();
      // "upper" is the filter, should be 5 chars
      expect(funcToken!.length).toBe(5);
    });

    it("generates function tokens for chained filters", () => {
      const tokens = decodeTokens(parseAndGetTokens("{{ name|lower|trim }}"));
      const funcTokens = tokens.filter((t) => t.tokenType === TOKEN_TYPES.function);
      // Should have at least 2 function tokens: "lower" and "trim"
      expect(funcTokens.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("keyword tokens", () => {
    it("generates keyword token for if", () => {
      const tokens = decodeTokens(parseAndGetTokens("{% if condition %}{% endif %}"));
      const keywordTokens = tokens.filter((t) => t.tokenType === TOKEN_TYPES.keyword);
      expect(keywordTokens.length).toBeGreaterThanOrEqual(1);
    });

    it("generates keyword token for for loop", () => {
      const tokens = decodeTokens(parseAndGetTokens("{% for item in items %}{% endfor %}"));
      const keywordTokens = tokens.filter((t) => t.tokenType === TOKEN_TYPES.keyword);
      // Should have "for", "in", "endfor"
      expect(keywordTokens.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("operator tokens", () => {
    it("generates operator tokens for comparison", () => {
      const tokens = decodeTokens(parseAndGetTokens("{% if a == b %}{% endif %}"));
      const opTokens = tokens.filter((t) => t.tokenType === TOKEN_TYPES.operator);
      expect(opTokens.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("string tokens", () => {
    it("generates string token for string literals", () => {
      const tokens = decodeTokens(parseAndGetTokens("{{ 'hello' }}"));
      const stringToken = tokens.find((t) => t.tokenType === TOKEN_TYPES.string);
      expect(stringToken).toBeDefined();
    });

    it("generates string token for double-quoted strings", () => {
      const tokens = decodeTokens(parseAndGetTokens('{{ "world" }}'));
      const stringToken = tokens.find((t) => t.tokenType === TOKEN_TYPES.string);
      expect(stringToken).toBeDefined();
    });
  });

  describe("number tokens", () => {
    it("generates number token for integer literals", () => {
      const tokens = decodeTokens(parseAndGetTokens("{{ 42 }}"));
      const numToken = tokens.find((t) => t.tokenType === TOKEN_TYPES.number);
      expect(numToken).toBeDefined();
      expect(numToken!.length).toBe(2); // "42"
    });

    it("generates number token for float literals", () => {
      const tokens = decodeTokens(parseAndGetTokens("{{ 3.14 }}"));
      const numToken = tokens.find((t) => t.tokenType === TOKEN_TYPES.number);
      expect(numToken).toBeDefined();
    });
  });

  describe("comment tokens", () => {
    it("generates comment token for Twig comments", () => {
      const tokens = decodeTokens(parseAndGetTokens("{# this is a comment #}"));
      const commentToken = tokens.find((t) => t.tokenType === TOKEN_TYPES.comment);
      expect(commentToken).toBeDefined();
    });
  });

  describe("delta encoding", () => {
    it("produces correct delta-encoded output for single line", () => {
      const tokens = parseAndGetTokens("{{ x }}");
      // Each token is 5 values: deltaLine, deltaChar, length, type, modifiers
      expect(tokens.length % 5).toBe(0);
    });

    it("correctly encodes multiple tokens on same line", () => {
      const data = parseAndGetTokens("{{ a + b }}");
      // First token should have deltaLine = 0
      expect(data[0]).toBe(0);
      // Subsequent tokens on same line should also have deltaLine = 0
      if (data.length > 5) {
        expect(data[5]).toBe(0); // Second token's deltaLine
      }
    });

    it("correctly encodes tokens across multiple lines", () => {
      const data = parseAndGetTokens("{{ a }}\n{{ b }}");
      const decoded = decodeTokens(data);

      // Tokens from first line should be on line 0
      const line0Tokens = decoded.filter((t) => t.line === 0);
      expect(line0Tokens.length).toBeGreaterThan(0);

      // Tokens from second line should be on line 1
      const line1Tokens = decoded.filter((t) => t.line === 1);
      expect(line1Tokens.length).toBeGreaterThan(0);
    });
  });

  describe("tokens restricted to Twig constructs", () => {
    it("does not generate tokens for HTML content", () => {
      const tokens = decodeTokens(parseAndGetTokens("<div>plain text</div>"));
      // Should have no tokens for plain HTML
      expect(tokens.length).toBe(0);
    });

    it("only generates tokens inside Twig delimiters", () => {
      const data = parseAndGetTokens("<div>{{ var }}</div>");
      const tokens = decodeTokens(data);

      // Should only have token(s) for "var" inside {{ }}
      // HTML tags should not produce tokens
      expect(tokens.length).toBeGreaterThan(0);

      // All tokens should be within the {{ }} bounds
      // {{ starts at column 5, }} ends at column 14
      tokens.forEach((token) => {
        expect(token.startChar).toBeGreaterThanOrEqual(5);
        expect(token.startChar + token.length).toBeLessThanOrEqual(14);
      });
    });

    it("generates tokens for mixed content", () => {
      const template = `<h1>{{ title }}</h1>
<p>{{ content|raw }}</p>`;
      const tokens = decodeTokens(parseAndGetTokens(template));

      // Should have tokens from both lines (both {{ }} expressions)
      const line0Tokens = tokens.filter((t) => t.line === 0);
      const line1Tokens = tokens.filter((t) => t.line === 1);

      expect(line0Tokens.length).toBeGreaterThan(0);
      expect(line1Tokens.length).toBeGreaterThan(0);
    });
  });
});
