import { describe, it, expect } from "vitest";
import { DiagnosticSeverity } from "vscode-languageserver/node";
import { validateBlockTags } from "../validators/block-tags";
import { parseTestDocument } from "./utils";

function parseAndValidate(template: string) {
  const tree = parseTestDocument(template);
  return validateBlockTags(tree);
}

describe("validateBlockTags", () => {
  // === 4.2: Unclosed tag diagnostic ===
  describe("unclosed tag diagnostics", () => {
    it("produces Warning-severity diagnostic with correct message format", () => {
      const diagnostics = parseAndValidate("{% if condition %}some content");
      expect(diagnostics.length).toBeGreaterThanOrEqual(1);

      const unclosedDiag = diagnostics.find((d) => d.message.includes("Unclosed"));
      expect(unclosedDiag).toBeDefined();
      expect(unclosedDiag!.severity).toBe(DiagnosticSeverity.Warning);
      expect(unclosedDiag!.message).toBe("Unclosed {% if %} — expected {% endif %}");
      expect(unclosedDiag!.source).toBe("twig-sense");
    });

    it("range covers the opening tag statement_block", () => {
      const diagnostics = parseAndValidate("{% if condition %}some content");
      const unclosedDiag = diagnostics.find((d) => d.message.includes("Unclosed"));
      expect(unclosedDiag).toBeDefined();
      expect(unclosedDiag!.range.start.line).toBe(0);
      expect(unclosedDiag!.range.start.character).toBe(0);
    });

    it("handles unclosed for loop", () => {
      const diagnostics = parseAndValidate("{% for item in items %}{{ item }}");
      const unclosedDiag = diagnostics.find((d) => d.message.includes("Unclosed"));
      expect(unclosedDiag).toBeDefined();
      expect(unclosedDiag!.message).toBe("Unclosed {% for %} — expected {% endfor %}");
    });
  });

  // === 4.3: Orphan closer diagnostic ===
  describe("orphan closer diagnostics", () => {
    it("produces Warning-severity diagnostic with correct message format", () => {
      const diagnostics = parseAndValidate("{% endif %}");
      expect(diagnostics.length).toBeGreaterThanOrEqual(1);

      const orphanDiag = diagnostics.find((d) => d.message.includes("Unexpected"));
      expect(orphanDiag).toBeDefined();
      expect(orphanDiag!.severity).toBe(DiagnosticSeverity.Warning);
      expect(orphanDiag!.message).toBe("Unexpected {% endif %} — no matching {% if %}");
      expect(orphanDiag!.source).toBe("twig-sense");
    });

    it("range covers the closing tag statement_block", () => {
      const diagnostics = parseAndValidate("{% endif %}");
      const orphanDiag = diagnostics.find((d) => d.message.includes("Unexpected"));
      expect(orphanDiag).toBeDefined();
      expect(orphanDiag!.range.start.line).toBe(0);
      expect(orphanDiag!.range.start.character).toBe(0);
    });

    it("handles orphan endfor", () => {
      const diagnostics = parseAndValidate("{% endfor %}");
      const orphanDiag = diagnostics.find((d) => d.message.includes("Unexpected"));
      expect(orphanDiag).toBeDefined();
      expect(orphanDiag!.message).toBe("Unexpected {% endfor %} — no matching {% for %}");
    });
  });

  // === 4.4: Nesting error diagnostic ===
  describe("nesting error diagnostics", () => {
    it("produces diagnostic with correct message including line numbers", () => {
      const template = `{% for item in items %}
{% if item.active %}
{{ item }}
{% endfor %}`;
      const diagnostics = parseAndValidate(template);

      const nestingDiag = diagnostics.find((d) => d.message.includes("was closed while"));
      expect(nestingDiag).toBeDefined();
      expect(nestingDiag!.severity).toBe(DiagnosticSeverity.Warning);
      expect(nestingDiag!.source).toBe("twig-sense");
      // Message should reference both tags with 1-indexed line numbers
      expect(nestingDiag!.message).toMatch(
        /{% for %} at line \d+ was closed while {% if %} at line \d+ was still open/
      );
    });

    it("range covers the closing tag that caused the cross", () => {
      // Use a simple two-line template so line positions are unambiguous
      const template = "{% for item in items %}\n{% if item.active %}\n{{ item }}\n{% endfor %}";
      const diagnostics = parseAndValidate(template);

      const nestingDiag = diagnostics.find((d) => d.message.includes("was closed while"));
      expect(nestingDiag).toBeDefined();
      // The closer (endfor) range should be on or after the if tag
      expect(nestingDiag!.range.start.line).toBeGreaterThan(0);
    });
  });

  // === 4.5: Misplaced keyword diagnostic ===
  describe("misplaced keyword diagnostics", () => {
    it("produces diagnostic with correct valid parents in message", () => {
      const diagnostics = parseAndValidate("{% else %}");

      const misplacedDiag = diagnostics.find((d) => d.message.includes("is only valid inside"));
      expect(misplacedDiag).toBeDefined();
      expect(misplacedDiag!.severity).toBe(DiagnosticSeverity.Warning);
      expect(misplacedDiag!.message).toBe("{% else %} is only valid inside {% if %}, {% for %}");
      expect(misplacedDiag!.source).toBe("twig-sense");
    });

    it("handles misplaced elseif", () => {
      const diagnostics = parseAndValidate("{% elseif condition %}");

      const misplacedDiag = diagnostics.find((d) => d.message.includes("is only valid inside"));
      expect(misplacedDiag).toBeDefined();
      expect(misplacedDiag!.message).toBe("{% elseif %} is only valid inside {% if %}");
    });

    it("range covers the misplaced keyword statement_block", () => {
      const diagnostics = parseAndValidate("{% else %}");
      const misplacedDiag = diagnostics.find((d) => d.message.includes("is only valid inside"));
      expect(misplacedDiag).toBeDefined();
      expect(misplacedDiag!.range.start.line).toBe(0);
      expect(misplacedDiag!.range.start.character).toBe(0);
    });
  });

  // === 4.9: Clean template produces zero diagnostics ===
  describe("clean template", () => {
    it("produces zero diagnostics for properly nested template", () => {
      const template = `{% block content %}
  {% if condition %}
    {% for item in items %}
      {{ item }}
    {% endfor %}
  {% endif %}
{% endblock %}`;
      const diagnostics = parseAndValidate(template);
      expect(diagnostics).toHaveLength(0);
    });

    it("produces zero diagnostics for if/else/endif", () => {
      const template = `{% if condition %}
  yes
{% else %}
  no
{% endif %}`;
      const diagnostics = parseAndValidate(template);
      expect(diagnostics).toHaveLength(0);
    });

    it("produces zero diagnostics for for/else/endfor", () => {
      const template = `{% for item in items %}
  {{ item }}
{% else %}
  No items
{% endfor %}`;
      const diagnostics = parseAndValidate(template);
      expect(diagnostics).toHaveLength(0);
    });
  });

  // === 4.10: Multiple errors in one document ===
  describe("multiple errors in one document", () => {
    it("produces multiple diagnostics for multiple errors", () => {
      const template = `{% if condition %}
{% else %}
{% for item in items %}
  {{ item }}
{% endif %}
{% endfor %}
{% endfor %}`;
      const diagnostics = parseAndValidate(template);

      // Should have at least: a nesting error and an orphan closer
      expect(diagnostics.length).toBeGreaterThanOrEqual(2);
    });

    it("produces separate diagnostics for unclosed and orphan in same document", () => {
      const template = `{% if condition %}content
{% endfor %}`;
      const diagnostics = parseAndValidate(template);

      // Should have both an unclosed {% if %} and an orphan {% endfor %}
      const unclosedDiag = diagnostics.find((d) => d.message.includes("Unclosed"));
      const orphanDiag = diagnostics.find((d) => d.message.includes("Unexpected"));
      expect(unclosedDiag).toBeDefined();
      expect(orphanDiag).toBeDefined();
    });
  });

  // === Diagnostic properties consistency ===
  describe("diagnostic properties", () => {
    it("all diagnostics have Warning severity", () => {
      const template = `{% if condition %}content
{% endfor %}
{% else %}`;
      const diagnostics = parseAndValidate(template);
      expect(diagnostics.length).toBeGreaterThan(0);
      for (const diag of diagnostics) {
        expect(diag.severity).toBe(DiagnosticSeverity.Warning);
      }
    });

    it("all diagnostics have source twig-sense", () => {
      const template = `{% if condition %}content
{% endfor %}
{% else %}`;
      const diagnostics = parseAndValidate(template);
      expect(diagnostics.length).toBeGreaterThan(0);
      for (const diag of diagnostics) {
        expect(diag.source).toBe("twig-sense");
      }
    });
  });
});
