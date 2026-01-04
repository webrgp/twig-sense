import { describe, it, expect } from "vitest";
import { getTestParser, parseTestDocumentOrNull } from "./utils";

describe("parser utilities", () => {
  describe("parser initialization", () => {
    it("parser is ready after initialization", () => {
      const parser = getTestParser();
      expect(parser).toBeDefined();
      expect(parser.getLanguage()).toBeDefined();
    });
  });

  describe("parseDocument", () => {
    it("returns a valid tree for simple Twig template", () => {
      const tree = parseTestDocumentOrNull("{{ variable }}");
      expect(tree).not.toBeNull();
      expect(tree!.rootNode).toBeDefined();
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

      const tree = parseTestDocumentOrNull(template);
      expect(tree).not.toBeNull();
      expect(tree!.rootNode.childCount).toBeGreaterThan(0);
    });
  });

  describe("syntax error handling", () => {
    it("returns a partial tree for unclosed output delimiter", () => {
      const tree = parseTestDocumentOrNull("{{ variable");
      expect(tree).not.toBeNull();
      // Tree should still be returned even with errors
      expect(tree!.rootNode).toBeDefined();
    });

    it("returns a partial tree for unclosed block", () => {
      const tree = parseTestDocumentOrNull("{% if condition %}content");
      expect(tree).not.toBeNull();
      expect(tree!.rootNode).toBeDefined();
    });

    it("returns tree even with empty output", () => {
      const tree = parseTestDocumentOrNull("{{ }}"); // Empty output
      expect(tree).not.toBeNull();
      // The key is that we get a tree back
      expect(tree!.rootNode).toBeDefined();
    });

    it("returns tree for unbalanced expressions", () => {
      const tree = parseTestDocumentOrNull("{{ unbalanced (");
      expect(tree).not.toBeNull();
      expect(tree!.rootNode).toBeDefined();
    });
  });

  describe("incremental parsing", () => {
    it("parses incrementally with edit changes", () => {
      // First, parse the original document
      const originalText = "{{ hello }}";
      const oldTree = parseTestDocumentOrNull(originalText);
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
      const newTree = getTestParser().parse(newText, oldTree!);
      expect(newTree).not.toBeNull();
      expect(newTree!.rootNode).toBeDefined();
    });

    it("handles insertions", () => {
      const originalText = "{{ x }}";
      const oldTree = parseTestDocumentOrNull(originalText);
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
      const newTree = getTestParser().parse(newText, oldTree!);
      expect(newTree).not.toBeNull();
    });

    it("handles deletions", () => {
      const originalText = "{{ hello world }}";
      const oldTree = parseTestDocumentOrNull(originalText);
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
      const newTree = getTestParser().parse(newText, oldTree!);
      expect(newTree).not.toBeNull();
    });

    it("handles multiline documents", () => {
      const originalText = "{{ a }}\n{{ b }}";
      const oldTree = parseTestDocumentOrNull(originalText);
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
      const newTree = getTestParser().parse(newText, oldTree!);
      expect(newTree).not.toBeNull();
    });
  });
});
