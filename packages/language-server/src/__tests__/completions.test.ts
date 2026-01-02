import { describe, it, expect } from "vitest";
import { TextDocument } from "vscode-languageserver-textdocument";
import { CompletionItemKind } from "vscode-languageserver/node";
import { detectContext, getCompletions } from "../completions";

function createDocument(content: string): TextDocument {
  return TextDocument.create("file:///test.twig", "twig", 1, content);
}

describe("detectContext", () => {
  describe("output context", () => {
    it('returns "output" when cursor is inside {{ }}', () => {
      const content = "{{ variable }}";
      const doc = createDocument(content);
      // Position after "{{ "
      const position = { line: 0, character: 3 };
      expect(detectContext(doc, position)).toBe("output");
    });

    it('returns "output" when cursor is after {{ with no closing', () => {
      const content = "{{ var";
      const doc = createDocument(content);
      const position = { line: 0, character: 6 };
      expect(detectContext(doc, position)).toBe("output");
    });

    it('returns "output" with multiline content', () => {
      const content = "{{ \n  variable\n}}";
      const doc = createDocument(content);
      // Position on line 1, middle of "variable"
      const position = { line: 1, character: 4 };
      expect(detectContext(doc, position)).toBe("output");
    });
  });

  describe("block context", () => {
    it('returns "block" when cursor is inside {% %}', () => {
      const content = "{% if condition %}";
      const doc = createDocument(content);
      // Position after "{% "
      const position = { line: 0, character: 3 };
      expect(detectContext(doc, position)).toBe("block");
    });

    it('returns "block" when cursor is after {% with no closing', () => {
      const content = "{% for item";
      const doc = createDocument(content);
      const position = { line: 0, character: 11 };
      expect(detectContext(doc, position)).toBe("block");
    });

    it('returns "block" for various tag keywords', () => {
      const content = "{% extends 'base.twig' %}";
      const doc = createDocument(content);
      const position = { line: 0, character: 12 };
      expect(detectContext(doc, position)).toBe("block");
    });
  });

  describe("filter context", () => {
    it('returns "filter" when cursor is after pipe in output', () => {
      const content = "{{ name|upper }}";
      const doc = createDocument(content);
      // Position after "|"
      const position = { line: 0, character: 8 };
      expect(detectContext(doc, position)).toBe("filter");
    });

    it('returns "filter" when cursor is after pipe with partial filter name', () => {
      const content = "{{ value|da }}";
      const doc = createDocument(content);
      // Position after "da" (partial filter name)
      const position = { line: 0, character: 11 };
      expect(detectContext(doc, position)).toBe("filter");
    });

    it('returns "filter" when pipe is in block context', () => {
      const content = "{% set x = value|upper %}";
      const doc = createDocument(content);
      // Position after "|"
      const position = { line: 0, character: 17 };
      expect(detectContext(doc, position)).toBe("filter");
    });

    it('does not return "filter" if pipe is outside Twig delimiters', () => {
      const content = "text | more text";
      const doc = createDocument(content);
      const position = { line: 0, character: 6 };
      expect(detectContext(doc, position)).toBe("none");
    });
  });

  describe("none context", () => {
    it('returns "none" when cursor is in plain HTML', () => {
      const content = "<div>content</div>";
      const doc = createDocument(content);
      const position = { line: 0, character: 5 };
      expect(detectContext(doc, position)).toBe("none");
    });

    it('returns "none" after closed output tag', () => {
      const content = "{{ variable }} more text";
      const doc = createDocument(content);
      // Position after the closing }}
      const position = { line: 0, character: 18 };
      expect(detectContext(doc, position)).toBe("none");
    });

    it('returns "none" after closed block tag', () => {
      const content = "{% endif %} text";
      const doc = createDocument(content);
      const position = { line: 0, character: 14 };
      expect(detectContext(doc, position)).toBe("none");
    });

    it('returns "none" inside Twig comments', () => {
      // Note: Comments are not output or block context
      const content = "{# comment #}";
      const doc = createDocument(content);
      const position = { line: 0, character: 5 };
      expect(detectContext(doc, position)).toBe("none");
    });
  });

  describe("nested scenarios", () => {
    it("handles multiple Twig blocks correctly", () => {
      const content = "{{ first }} text {% if true %}";
      const doc = createDocument(content);
      // Position inside the {% if %}
      const position = { line: 0, character: 25 };
      expect(detectContext(doc, position)).toBe("block");
    });

    it("handles filter after previous closed expression", () => {
      const content = "{{ done }} {{ value|";
      const doc = createDocument(content);
      const position = { line: 0, character: 20 };
      expect(detectContext(doc, position)).toBe("filter");
    });
  });
});

describe("getCompletions", () => {
  function getCompletionLabels(content: string, position: { line: number; character: number }): string[] {
    const doc = createDocument(content);
    const completions = getCompletions(doc, {
      textDocument: { uri: doc.uri },
      position,
    });
    return completions.map((c) => c.label);
  }

  describe("block context completions", () => {
    it("returns keywords in block context", () => {
      const content = "{% ";
      const labels = getCompletionLabels(content, { line: 0, character: 3 });

      expect(labels).toContain("if");
      expect(labels).toContain("for");
      expect(labels).toContain("block");
      expect(labels).toContain("extends");
      expect(labels).toContain("include");
      expect(labels).toContain("set");
      expect(labels).toContain("macro");
    });

    it("returns functions in block context", () => {
      const content = "{% ";
      const labels = getCompletionLabels(content, { line: 0, character: 3 });

      expect(labels).toContain("dump");
      expect(labels).toContain("range");
      expect(labels).toContain("date");
    });

    it("includes both keywords and functions", () => {
      const content = "{% ";
      const doc = createDocument(content);
      const completions = getCompletions(doc, {
        textDocument: { uri: doc.uri },
        position: { line: 0, character: 3 },
      });

      const hasKeywords = completions.some(
        (c) => c.kind === CompletionItemKind.Keyword
      );
      const hasFunctions = completions.some(
        (c) => c.kind === CompletionItemKind.Function
      );

      expect(hasKeywords).toBe(true);
      expect(hasFunctions).toBe(true);
    });
  });

  describe("output context completions", () => {
    it("returns functions in output context", () => {
      const content = "{{ ";
      const labels = getCompletionLabels(content, { line: 0, character: 3 });

      expect(labels).toContain("dump");
      expect(labels).toContain("range");
      expect(labels).toContain("date");
      expect(labels).toContain("include");
    });

    it("does not include block-only keywords like endif", () => {
      const content = "{{ ";
      const labels = getCompletionLabels(content, { line: 0, character: 3 });

      expect(labels).not.toContain("endif");
      expect(labels).not.toContain("endfor");
      expect(labels).not.toContain("if");
      expect(labels).not.toContain("for");
    });
  });

  describe("filter context completions", () => {
    it("returns filters after pipe", () => {
      const content = "{{ value|";
      const labels = getCompletionLabels(content, { line: 0, character: 9 });

      expect(labels).toContain("upper");
      expect(labels).toContain("lower");
      expect(labels).toContain("date");
      expect(labels).toContain("join");
      expect(labels).toContain("trim");
      expect(labels).toContain("escape");
    });

    it("returns only filters, not keywords", () => {
      const content = "{{ value|";
      const labels = getCompletionLabels(content, { line: 0, character: 9 });

      expect(labels).not.toContain("if");
      expect(labels).not.toContain("for");
      expect(labels).not.toContain("dump");
    });
  });

  describe("test completions after is keyword", () => {
    it("returns tests after 'is' in output context", () => {
      const content = "{{ variable is ";
      const labels = getCompletionLabels(content, { line: 0, character: 15 });

      expect(labels).toContain("defined");
      expect(labels).toContain("empty");
      expect(labels).toContain("even");
      expect(labels).toContain("odd");
      expect(labels).toContain("null");
      expect(labels).toContain("iterable");
    });

    it("returns tests after 'is' in block context", () => {
      const content = "{% if variable is ";
      const labels = getCompletionLabels(content, { line: 0, character: 18 });

      expect(labels).toContain("defined");
      expect(labels).toContain("empty");
    });

    it("returns tests with partial typing", () => {
      const content = "{{ variable is de";
      const labels = getCompletionLabels(content, { line: 0, character: 17 });

      expect(labels).toContain("defined");
    });
  });

  describe("no completions outside Twig", () => {
    it("returns empty array in plain HTML", () => {
      const content = "<div>content</div>";
      const labels = getCompletionLabels(content, { line: 0, character: 5 });

      expect(labels).toHaveLength(0);
    });

    it("returns empty array after closed Twig expression", () => {
      const content = "{{ variable }} text";
      const labels = getCompletionLabels(content, { line: 0, character: 18 });

      expect(labels).toHaveLength(0);
    });
  });

  describe("completion item properties", () => {
    it("keywords have correct kind and details", () => {
      const content = "{% ";
      const doc = createDocument(content);
      const completions = getCompletions(doc, {
        textDocument: { uri: doc.uri },
        position: { line: 0, character: 3 },
      });

      const ifCompletion = completions.find((c) => c.label === "if");
      expect(ifCompletion).toBeDefined();
      expect(ifCompletion!.kind).toBe(CompletionItemKind.Keyword);
      expect(ifCompletion!.detail).toBe("Conditional statement");
      expect(ifCompletion!.insertText).toBe("if ${1:condition}");
    });

    it("filters have correct kind and details", () => {
      const content = "{{ value|";
      const doc = createDocument(content);
      const completions = getCompletions(doc, {
        textDocument: { uri: doc.uri },
        position: { line: 0, character: 9 },
      });

      const upperFilter = completions.find((c) => c.label === "upper");
      expect(upperFilter).toBeDefined();
      expect(upperFilter!.kind).toBe(CompletionItemKind.Function);
      expect(upperFilter!.detail).toBe("Uppercase");
    });

    it("functions have correct kind and snippet insertText", () => {
      const content = "{{ ";
      const doc = createDocument(content);
      const completions = getCompletions(doc, {
        textDocument: { uri: doc.uri },
        position: { line: 0, character: 3 },
      });

      const dumpFunction = completions.find((c) => c.label === "dump");
      expect(dumpFunction).toBeDefined();
      expect(dumpFunction!.kind).toBe(CompletionItemKind.Function);
      expect(dumpFunction!.insertText).toBe("dump(${1:variable})");
    });
  });
});
