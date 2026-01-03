import { describe, it, expect, beforeAll } from "vitest";
import * as path from "path";
import Parser, { Tree } from "web-tree-sitter";
import { TextDocument } from "vscode-languageserver-textdocument";
import { CompletionItemKind } from "vscode-languageserver/node";
import { detectContext, getCompletions } from "../completions";

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

function parse(content: string): Tree {
  const tree = parser.parse(content);
  if (!tree) throw new Error("Failed to parse document");
  return tree;
}

beforeAll(async () => {
  await initTestParser();
});

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
  function getCompletionLabels(
    content: string,
    position: { line: number; character: number }
  ): string[] {
    const doc = createDocument(content);
    const completions = getCompletions(doc, {
      textDocument: { uri: doc.uri },
      position,
    });
    return completions.map((c) => c.label);
  }

  function getCompletionLabelsWithTree(
    content: string,
    position: { line: number; character: number }
  ): string[] {
    const doc = createDocument(content);
    const tree = parse(content);
    const completions = getCompletions(
      doc,
      {
        textDocument: { uri: doc.uri },
        position,
      },
      tree
    );
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

      const hasKeywords = completions.some((c) => c.kind === CompletionItemKind.Keyword);
      const hasFunctions = completions.some((c) => c.kind === CompletionItemKind.Function);

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
      expect(ifCompletion!.insertText).toBe("if ${1:condition} %}\n\t$0\n{% endif");
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

  describe("multi-line LSP snippet completions", () => {
    it("if completion includes endif closing tag", () => {
      const content = "{% ";
      const doc = createDocument(content);
      const completions = getCompletions(doc, {
        textDocument: { uri: doc.uri },
        position: { line: 0, character: 3 },
      });

      const ifCompletion = completions.find((c) => c.label === "if");
      expect(ifCompletion).toBeDefined();
      expect(ifCompletion!.insertText).toContain("{% endif");
      expect(ifCompletion!.insertText).toContain("\n");
    });

    it("for completion includes endfor closing tag", () => {
      const content = "{% ";
      const doc = createDocument(content);
      const completions = getCompletions(doc, {
        textDocument: { uri: doc.uri },
        position: { line: 0, character: 3 },
      });

      const forCompletion = completions.find((c) => c.label === "for");
      expect(forCompletion).toBeDefined();
      expect(forCompletion!.insertText).toContain("{% endfor");
      expect(forCompletion!.insertText).toContain("\n");
    });

    it("block completion includes endblock closing tag", () => {
      const content = "{% ";
      const doc = createDocument(content);
      const completions = getCompletions(doc, {
        textDocument: { uri: doc.uri },
        position: { line: 0, character: 3 },
      });

      const blockCompletion = completions.find((c) => c.label === "block");
      expect(blockCompletion).toBeDefined();
      expect(blockCompletion!.insertText).toContain("{% endblock");
      expect(blockCompletion!.insertText).toContain("\n");
    });

    it("macro completion includes endmacro closing tag", () => {
      const content = "{% ";
      const doc = createDocument(content);
      const completions = getCompletions(doc, {
        textDocument: { uri: doc.uri },
        position: { line: 0, character: 3 },
      });

      const macroCompletion = completions.find((c) => c.label === "macro");
      expect(macroCompletion).toBeDefined();
      expect(macroCompletion!.insertText).toContain("{% endmacro");
      expect(macroCompletion!.insertText).toContain("\n");
    });
  });

  describe("context-aware end keyword completions", () => {
    it("shows endif only when inside if block", () => {
      // Inside if block
      const contentInside = "{% if true %}\n  {% ";
      const labelsInside = getCompletionLabelsWithTree(contentInside, {
        line: 1,
        character: 5,
      });
      expect(labelsInside).toContain("endif");

      // Outside if block
      const contentOutside = "{% if true %}{% endif %}\n{% ";
      const labelsOutside = getCompletionLabelsWithTree(contentOutside, {
        line: 1,
        character: 3,
      });
      expect(labelsOutside).not.toContain("endif");
    });

    it("shows endfor only when inside for block", () => {
      // Inside for block
      const contentInside = "{% for item in items %}\n  {% ";
      const labelsInside = getCompletionLabelsWithTree(contentInside, {
        line: 1,
        character: 5,
      });
      expect(labelsInside).toContain("endfor");

      // Outside for block
      const contentOutside = "{% for item in items %}{% endfor %}\n{% ";
      const labelsOutside = getCompletionLabelsWithTree(contentOutside, {
        line: 1,
        character: 3,
      });
      expect(labelsOutside).not.toContain("endfor");
    });

    it("shows endblock only when inside block definition", () => {
      // Inside block definition
      const contentInside = "{% block content %}\n  {% ";
      const labelsInside = getCompletionLabelsWithTree(contentInside, {
        line: 1,
        character: 5,
      });
      expect(labelsInside).toContain("endblock");

      // Outside block definition
      const contentOutside = "{% block content %}{% endblock %}\n{% ";
      const labelsOutside = getCompletionLabelsWithTree(contentOutside, {
        line: 1,
        character: 3,
      });
      expect(labelsOutside).not.toContain("endblock");
    });

    it("shows endmacro only when inside macro definition", () => {
      // Inside macro definition
      const contentInside = "{% macro button(text) %}\n  {% ";
      const labelsInside = getCompletionLabelsWithTree(contentInside, {
        line: 1,
        character: 5,
      });
      expect(labelsInside).toContain("endmacro");

      // Outside macro definition
      const contentOutside = "{% macro button(text) %}{% endmacro %}\n{% ";
      const labelsOutside = getCompletionLabelsWithTree(contentOutside, {
        line: 1,
        character: 3,
      });
      expect(labelsOutside).not.toContain("endmacro");
    });

    it("does not show end keywords at top level", () => {
      const content = "{% ";
      const labels = getCompletionLabelsWithTree(content, {
        line: 0,
        character: 3,
      });

      expect(labels).not.toContain("endif");
      expect(labels).not.toContain("endfor");
      expect(labels).not.toContain("endblock");
      expect(labels).not.toContain("endmacro");
      expect(labels).not.toContain("endapply");
      expect(labels).not.toContain("endautoescape");
      expect(labels).not.toContain("endembed");
      expect(labels).not.toContain("endsandbox");
      expect(labels).not.toContain("endverbatim");
      expect(labels).not.toContain("endcache");
      expect(labels).not.toContain("endset");
    });

    it("shows multiple end keywords when nested", () => {
      // Inside both if and for block
      const content = "{% if true %}\n  {% for item in items %}\n    {% ";
      const labels = getCompletionLabelsWithTree(content, {
        line: 2,
        character: 7,
      });

      expect(labels).toContain("endif");
      expect(labels).toContain("endfor");
      expect(labels).not.toContain("endblock");
    });
  });

  describe("context-aware else/elseif completions", () => {
    it("shows else and elseif inside if block", () => {
      const content = "{% if true %}\n  {% ";
      const labels = getCompletionLabelsWithTree(content, {
        line: 1,
        character: 5,
      });

      expect(labels).toContain("else");
      expect(labels).toContain("elseif");
    });

    it("shows else inside for block (loop else)", () => {
      const content = "{% for item in items %}\n  {% ";
      const labels = getCompletionLabelsWithTree(content, {
        line: 1,
        character: 5,
      });

      expect(labels).toContain("else");
    });

    it("does not show elseif inside for block", () => {
      const content = "{% for item in items %}\n  {% ";
      const labels = getCompletionLabelsWithTree(content, {
        line: 1,
        character: 5,
      });

      expect(labels).not.toContain("elseif");
    });

    it("does not show else or elseif at top level", () => {
      const content = "{% ";
      const labels = getCompletionLabelsWithTree(content, {
        line: 0,
        character: 3,
      });

      expect(labels).not.toContain("else");
      expect(labels).not.toContain("elseif");
    });

    it("does not show else or elseif inside block definition only", () => {
      const content = "{% block content %}\n  {% ";
      const labels = getCompletionLabelsWithTree(content, {
        line: 1,
        character: 5,
      });

      // Inside a block but not inside if or for
      expect(labels).not.toContain("else");
      expect(labels).not.toContain("elseif");
    });

    it("shows else and elseif when if is nested inside block", () => {
      const content = "{% block content %}\n  {% if true %}\n    {% ";
      const labels = getCompletionLabelsWithTree(content, {
        line: 2,
        character: 7,
      });

      expect(labels).toContain("else");
      expect(labels).toContain("elseif");
    });
  });
});
