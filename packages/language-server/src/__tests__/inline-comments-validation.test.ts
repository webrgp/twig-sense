import * as path from "path";
import { beforeAll, describe, expect, it } from "vitest";
import { DiagnosticSeverity } from "vscode-languageserver/node";
import Parser from "web-tree-sitter";
import { validateInlineComments } from "../validators/inline-comments";

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

function parseAndValidate(template: string) {
  const tree = parser.parse(template);
  return validateInlineComments(tree);
}

describe("validateInlineComments", () => {
  describe("should generate warnings for invalid usage", () => {
    it("warns for single-line expression with inline comment and same-line closer", () => {
      const diagnostics = parseAndValidate("{{ value # comment }}");
      expect(diagnostics.length).toBe(1);
      expect(diagnostics[0]!.severity).toBe(DiagnosticSeverity.Warning);
      expect(diagnostics[0]!.message).toBe(
        "Inline comment extends to end of line. Move closing delimiter to next line."
      );
      expect(diagnostics[0]!.source).toBe("twig-sense");
    });

    it("warns for statement block with inline comment and same-line closer", () => {
      const diagnostics = parseAndValidate("{% set x = 1 # comment %}");
      expect(diagnostics.length).toBe(1);
      expect(diagnostics[0]!.severity).toBe(DiagnosticSeverity.Warning);
    });

    it("warns for inline comment immediately before closing delimiter", () => {
      const diagnostics = parseAndValidate("{{ value # short }}");
      expect(diagnostics.length).toBe(1);
    });

    it("warns for multi-line expression where last line has comment and closer", () => {
      const template = `{{
  value
  |filter # comment on last line }}`;
      const diagnostics = parseAndValidate(template);
      expect(diagnostics.length).toBe(1);
    });
  });

  describe("should not generate warnings for valid usage", () => {
    it("no warning when closing delimiter is on next line", () => {
      const template = `{{ value # comment
}}`;
      const diagnostics = parseAndValidate(template);
      expect(diagnostics.length).toBe(0);
    });

    it("no warning for multi-line expression with properly placed comments", () => {
      const template = `{{
  # first comment
  value
  # second comment
}}`;
      const diagnostics = parseAndValidate(template);
      expect(diagnostics.length).toBe(0);
    });

    it("no warning when string contains }} text", () => {
      const diagnostics = parseAndValidate('{{ "text}}" # comment\n}}');
      expect(diagnostics.length).toBe(0);
    });

    it("no warning when no inline comments present", () => {
      const diagnostics = parseAndValidate("{{ value }}");
      expect(diagnostics.length).toBe(0);
    });

    it("no warning for block comment syntax", () => {
      const diagnostics = parseAndValidate("{# this is a block comment #}");
      expect(diagnostics.length).toBe(0);
    });

    it("no warning when comment has }} in text but delimiter is on next line", () => {
      // Note: The grammar actually stops at }} so the text "}} in text" becomes raw content
      // This test verifies that a comment followed by newline and then delimiter is valid
      const template = `{{ value # comment text here
}}`;
      const diagnostics = parseAndValidate(template);
      expect(diagnostics.length).toBe(0);
    });

    it("no warning for whitespace between inline comment and next line delimiter", () => {
      const template = `{{ value # comment
   }}`;
      const diagnostics = parseAndValidate(template);
      expect(diagnostics.length).toBe(0);
    });

    it("no warning for intermediate inline comments in multi-line expression", () => {
      const template = `{{
  foo # comment 1
  |bar # comment 2
}}`;
      const diagnostics = parseAndValidate(template);
      expect(diagnostics.length).toBe(0);
    });
  });

  describe("diagnostic properties", () => {
    it("diagnostic range points to inline comment location", () => {
      const diagnostics = parseAndValidate("{{ value # comment }}");
      expect(diagnostics.length).toBe(1);
      expect(diagnostics[0]!.range.start.line).toBe(0);
      expect(diagnostics[0]!.range.start.character).toBe(9); // position of #
    });

    it("diagnostic severity is Warning", () => {
      const diagnostics = parseAndValidate("{{ x # test }}");
      expect(diagnostics[0]!.severity).toBe(DiagnosticSeverity.Warning);
    });

    it("diagnostic source is twig-sense", () => {
      const diagnostics = parseAndValidate("{{ x # test }}");
      expect(diagnostics[0]!.source).toBe("twig-sense");
    });

    it("diagnostic message is clear and actionable", () => {
      const diagnostics = parseAndValidate("{{ x # test }}");
      expect(diagnostics[0]!.message).toContain("Move closing delimiter to next line");
    });
  });

  describe("edge cases", () => {
    it("handles trimming delimiters with same-line comment", () => {
      const diagnostics = parseAndValidate("{{- value # comment -}}");
      expect(diagnostics.length).toBe(1);
    });

    it("handles statement block trimming delimiters", () => {
      const diagnostics = parseAndValidate("{%- set x = 1 # comment -%}");
      expect(diagnostics.length).toBe(1);
    });

    it("handles multiple expressions with mixed valid/invalid comments", () => {
      const template = `{{ valid # ok
}}{{ invalid # not ok }}`;
      const diagnostics = parseAndValidate(template);
      expect(diagnostics.length).toBe(1);
      // The invalid one should be on line 1
      expect(diagnostics[0]!.range.start.line).toBe(1);
    });
  });
});
