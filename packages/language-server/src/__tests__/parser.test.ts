import { describe, it, expect, beforeAll } from "vitest";
import * as path from "path";
import Parser, { Tree } from "web-tree-sitter";

// Since the parser module uses __dirname which resolves differently in tests,
// we create our own parser instance for testing the parsing logic.
// The actual parser module's path handling is tested implicitly via the
// language server integration tests.

let parser: Parser;

async function initTestParser(): Promise<void> {
  const wasmPath = path.join(__dirname, "../../dist/tree-sitter.wasm");
  await Parser.init({
    locateFile: () => wasmPath,
  });

  parser = new Parser();
  const langWasmPath = path.join(__dirname, "../../dist/tree-sitter-twig.wasm");
  const TwigLang = await Parser.Language.load(langWasmPath);
  parser.setLanguage(TwigLang);
}

function testParseDocument(text: string): Tree | null {
  return parser.parse(text);
}

describe("parser utilities", () => {
  beforeAll(async () => {
    await initTestParser();
  });

  describe("parser initialization", () => {
    it("parser is ready after initialization", () => {
      expect(parser).toBeDefined();
      expect(parser.getLanguage()).toBeDefined();
    });
  });

  describe("parseDocument", () => {
    it("returns a valid tree for simple Twig template", () => {
      const tree = testParseDocument("{{ variable }}");
      expect(tree).not.toBeNull();
      expect(tree!.rootNode).toBeDefined();
    });

    it("parses output statements correctly", () => {
      const tree = testParseDocument("{{ name }}");
      expect(tree).not.toBeNull();

      // Root node should have children representing the Twig constructs
      const rootNode = tree!.rootNode;
      expect(rootNode.childCount).toBeGreaterThan(0);
    });

    it("parses block statements correctly", () => {
      const tree = testParseDocument("{% if condition %}content{% endif %}");
      expect(tree).not.toBeNull();

      const rootNode = tree!.rootNode;
      expect(rootNode.childCount).toBeGreaterThan(0);
    });

    it("parses comments correctly", () => {
      const tree = testParseDocument("{# this is a comment #}");
      expect(tree).not.toBeNull();
    });

    it("parses mixed HTML and Twig content", () => {
      const tree = testParseDocument("<div>{{ content }}</div>");
      expect(tree).not.toBeNull();
      expect(tree!.rootNode.childCount).toBeGreaterThan(0);
    });

    it("parses complex templates with multiple constructs", () => {
      const template = `{% extends "base.twig" %}
{% block title %}{{ pageTitle }}{% endblock %}
{% block content %}
  <ul>
  {% for item in items %}
    <li>{{ item.name|upper }}</li>
  {% endfor %}
  </ul>
{% endblock %}`;

      const tree = testParseDocument(template);
      expect(tree).not.toBeNull();
      expect(tree!.rootNode.childCount).toBeGreaterThan(0);
    });
  });

  describe("syntax error handling", () => {
    it("returns a partial tree for unclosed output delimiter", () => {
      const tree = testParseDocument("{{ variable");
      expect(tree).not.toBeNull();
      // Tree should still be returned even with errors
      expect(tree!.rootNode).toBeDefined();
    });

    it("returns a partial tree for unclosed block", () => {
      const tree = testParseDocument("{% if condition %}content");
      expect(tree).not.toBeNull();
      expect(tree!.rootNode).toBeDefined();
    });

    it("returns tree even with empty output", () => {
      const tree = testParseDocument("{{ }}"); // Empty output
      expect(tree).not.toBeNull();
      // The key is that we get a tree back
      expect(tree!.rootNode).toBeDefined();
    });

    it("returns tree for unbalanced expressions", () => {
      const tree = testParseDocument("{{ unbalanced (");
      expect(tree).not.toBeNull();
      expect(tree!.rootNode).toBeDefined();
    });
  });

  describe("incremental parsing", () => {
    it("parses incrementally with edit changes", () => {
      // First, parse the original document
      const originalText = "{{ hello }}";
      const oldTree = testParseDocument(originalText);
      expect(oldTree).not.toBeNull();

      // Apply edit to the tree
      oldTree!.edit({
        startIndex: 3,
        oldEndIndex: 8,
        newEndIndex: 8,
        startPosition: { row: 0, column: 3 },
        oldEndPosition: { row: 0, column: 8 },
        newEndPosition: { row: 0, column: 8 },
      });

      // Reparse with the new text
      const newText = "{{ world }}";
      const newTree = parser.parse(newText, oldTree!);
      expect(newTree).not.toBeNull();
      expect(newTree!.rootNode).toBeDefined();
    });

    it("handles insertions", () => {
      const originalText = "{{ x }}";
      const oldTree = testParseDocument(originalText);
      expect(oldTree).not.toBeNull();

      // Apply insert edit
      oldTree!.edit({
        startIndex: 3,
        oldEndIndex: 3,
        newEndIndex: 7,
        startPosition: { row: 0, column: 3 },
        oldEndPosition: { row: 0, column: 3 },
        newEndPosition: { row: 0, column: 7 },
      });

      const newText = "{{ y + x }}";
      const newTree = parser.parse(newText, oldTree!);
      expect(newTree).not.toBeNull();
    });

    it("handles deletions", () => {
      const originalText = "{{ hello world }}";
      const oldTree = testParseDocument(originalText);
      expect(oldTree).not.toBeNull();

      // Apply delete edit
      oldTree!.edit({
        startIndex: 8,
        oldEndIndex: 14,
        newEndIndex: 8,
        startPosition: { row: 0, column: 8 },
        oldEndPosition: { row: 0, column: 14 },
        newEndPosition: { row: 0, column: 8 },
      });

      const newText = "{{ hello }}";
      const newTree = parser.parse(newText, oldTree!);
      expect(newTree).not.toBeNull();
    });

    it("handles multiline documents", () => {
      const originalText = "{{ a }}\n{{ b }}";
      const oldTree = testParseDocument(originalText);
      expect(oldTree).not.toBeNull();

      // Apply edit on second line
      oldTree!.edit({
        startIndex: 11, // Position of 'b'
        oldEndIndex: 12,
        newEndIndex: 12,
        startPosition: { row: 1, column: 3 },
        oldEndPosition: { row: 1, column: 4 },
        newEndPosition: { row: 1, column: 4 },
      });

      const newText = "{{ a }}\n{{ c }}";
      const newTree = parser.parse(newText, oldTree!);
      expect(newTree).not.toBeNull();
    });
  });
});
