import { describe, it, expect } from "vitest";
import { extractScopedBlocks } from "../document-analyzer";
import { parseTestDocument } from "./utils";

describe("Block Tag Analysis", () => {
  // === 4.1: Unclosed tags ===
  describe("unclosed tag detection", () => {
    it("detects unclosed if", () => {
      const tree = parseTestDocument("{% if condition %}some content");
      const result = extractScopedBlocks(tree);

      expect(result.unclosed).toHaveLength(1);
      expect(result.unclosed[0]!.keyword).toBe("if");
    });

    it("detects unclosed for", () => {
      const tree = parseTestDocument("{% for item in items %}{{ item }}");
      const result = extractScopedBlocks(tree);

      expect(result.unclosed).toHaveLength(1);
      expect(result.unclosed[0]!.keyword).toBe("for");
    });

    it("detects unclosed block", () => {
      const tree = parseTestDocument("{% block content %}some content");
      const result = extractScopedBlocks(tree);

      expect(result.unclosed).toHaveLength(1);
      expect(result.unclosed[0]!.keyword).toBe("block");
    });

    it("detects unclosed macro", () => {
      const tree = parseTestDocument("{% macro greeting(name) %}Hello {{ name }}");
      const result = extractScopedBlocks(tree);

      expect(result.unclosed).toHaveLength(1);
      expect(result.unclosed[0]!.keyword).toBe("macro");
    });

    it("detects unclosed with", () => {
      const tree = parseTestDocument("{% with %}{{ foo }}");
      const result = extractScopedBlocks(tree);

      expect(result.unclosed).toHaveLength(1);
      expect(result.unclosed[0]!.keyword).toBe("with");
    });

    it("detects multiple unclosed tags", () => {
      const tree = parseTestDocument(`{% if condition %}
{% for item in items %}
{{ item }}`);
      const result = extractScopedBlocks(tree);

      expect(result.unclosed).toHaveLength(2);
      const keywords = result.unclosed.map((u) => u.keyword);
      expect(keywords).toContain("if");
      expect(keywords).toContain("for");
    });

    it("includes TagLocation data for unclosed tags", () => {
      const tree = parseTestDocument("{% if condition %}some content");
      const result = extractScopedBlocks(tree);

      expect(result.unclosed).toHaveLength(1);
      const tag = result.unclosed[0]!;
      expect(tag.keyword).toBe("if");
      expect(tag.line).toBe(0);
      expect(tag.character).toBe(0);
      expect(typeof tag.endLine).toBe("number");
      expect(typeof tag.endCharacter).toBe("number");
    });
  });

  // === 4.2: Orphan closers ===
  describe("orphan closer detection", () => {
    it("detects orphan endif without if", () => {
      const tree = parseTestDocument("{% endif %}");
      const result = extractScopedBlocks(tree);

      expect(result.orphanClosers).toHaveLength(1);
      expect(result.orphanClosers[0]!.keyword).toBe("endif");
    });

    it("detects orphan endfor without for", () => {
      const tree = parseTestDocument("{% endfor %}");
      const result = extractScopedBlocks(tree);

      expect(result.orphanClosers).toHaveLength(1);
      expect(result.orphanClosers[0]!.keyword).toBe("endfor");
    });

    it("detects extra closing tag after valid pair", () => {
      const tree = parseTestDocument(`{% if condition %}
  content
{% endif %}
{% endif %}`);
      const result = extractScopedBlocks(tree);

      expect(result.orphanClosers).toHaveLength(1);
      expect(result.orphanClosers[0]!.keyword).toBe("endif");
      expect(result.unclosed).toHaveLength(0);
    });
  });

  // === 4.3: Cross-nesting anomalies ===
  describe("cross-nesting anomaly detection", () => {
    it("detects forgot endif inside for", () => {
      const tree = parseTestDocument(`{% for item in items %}
  {% if item.active %}
    {{ item }}
{% endfor %}`);
      const result = extractScopedBlocks(tree);

      expect(result.nestingErrors).toHaveLength(1);
      expect(result.nestingErrors[0]!.outer.keyword).toBe("for");
      expect(result.nestingErrors[0]!.inner.keyword).toBe("if");
      expect(result.nestingErrors[0]!.closer.keyword).toBe("endfor");
    });

    it("detects crossed block with swapped closers", () => {
      const tree = parseTestDocument(`{% if condition %}
  {% for item in items %}
    {{ item }}
  {% endif %}
{% endfor %}`);
      const result = extractScopedBlocks(tree);

      // When endif matches if by splicing past for, a nesting error is recorded
      expect(result.nestingErrors).toHaveLength(1);
      expect(result.nestingErrors[0]!.outer.keyword).toBe("if");
      expect(result.nestingErrors[0]!.inner.keyword).toBe("for");
      expect(result.nestingErrors[0]!.closer.keyword).toBe("endif");
    });
  });

  // === 4.4: Mid-block keyword validation ===
  describe("mid-block keyword validation", () => {
    it("else inside if is valid (no misplaced entry)", () => {
      const tree = parseTestDocument(`{% if condition %}
  yes
{% else %}
  no
{% endif %}`);
      const result = extractScopedBlocks(tree);

      expect(result.misplacedKeywords).toHaveLength(0);
    });

    it("else inside for is valid (for-else construct)", () => {
      const tree = parseTestDocument(`{% for item in items %}
  {{ item }}
{% else %}
  No items
{% endfor %}`);
      const result = extractScopedBlocks(tree);

      expect(result.misplacedKeywords).toHaveLength(0);
    });

    it("else outside any block is misplaced", () => {
      const tree = parseTestDocument("{% else %}");
      const result = extractScopedBlocks(tree);

      expect(result.misplacedKeywords).toHaveLength(1);
      expect(result.misplacedKeywords[0]!.location.keyword).toBe("else");
      expect(result.misplacedKeywords[0]!.validParents).toEqual(["if", "for"]);
    });

    it("elseif inside if is valid", () => {
      const tree = parseTestDocument(`{% if a %}
  A
{% elseif b %}
  B
{% endif %}`);
      const result = extractScopedBlocks(tree);

      expect(result.misplacedKeywords).toHaveLength(0);
    });

    it("elseif inside for is misplaced", () => {
      const tree = parseTestDocument(`{% for item in items %}
  {% elseif condition %}
{% endfor %}`);
      const result = extractScopedBlocks(tree);

      expect(result.misplacedKeywords).toHaveLength(1);
      expect(result.misplacedKeywords[0]!.location.keyword).toBe("elseif");
      expect(result.misplacedKeywords[0]!.validParents).toEqual(["if"]);
    });

    it("elseif outside any block is misplaced", () => {
      const tree = parseTestDocument("{% elseif condition %}");
      const result = extractScopedBlocks(tree);

      expect(result.misplacedKeywords).toHaveLength(1);
      expect(result.misplacedKeywords[0]!.location.keyword).toBe("elseif");
      expect(result.misplacedKeywords[0]!.validParents).toEqual(["if"]);
    });

    it("else inside non-if/for block is misplaced", () => {
      const tree = parseTestDocument(`{% block content %}
  {% else %}
{% endblock %}`);
      const result = extractScopedBlocks(tree);

      expect(result.misplacedKeywords).toHaveLength(1);
      expect(result.misplacedKeywords[0]!.location.keyword).toBe("else");
      expect(result.misplacedKeywords[0]!.validParents).toEqual(["if", "for"]);
    });

    it("strict innermost block check: else inside block inside for is misplaced", () => {
      const tree = parseTestDocument(`{% for item in items %}
  {% block content %}
    {% else %}
  {% endblock %}
{% endfor %}`);
      const result = extractScopedBlocks(tree);

      expect(result.misplacedKeywords).toHaveLength(1);
      expect(result.misplacedKeywords[0]!.location.keyword).toBe("else");
    });
  });

  // === 4.5: Valid for-else with properly-closed nested if ===
  describe("for-else with nested if", () => {
    it("valid for-else with properly-closed nested if produces zero misplaced entries", () => {
      const tree = parseTestDocument(`{% for item in items %}
  {% if item.active %}
    {{ item }}
  {% endif %}
{% else %}
  No items found.
{% endfor %}`);
      const result = extractScopedBlocks(tree);

      expect(result.misplacedKeywords).toHaveLength(0);
      expect(result.unclosed).toHaveLength(0);
      expect(result.orphanClosers).toHaveLength(0);
      expect(result.nestingErrors).toHaveLength(0);
    });
  });

  // === 4.6: Inline set vs block-form set ===
  describe("inline set detection", () => {
    it("inline set is NOT tracked as unclosed", () => {
      const tree = parseTestDocument("{% set x = 1 %}");
      const result = extractScopedBlocks(tree);

      expect(result.unclosed).toHaveLength(0);
      expect(result.orphanClosers).toHaveLength(0);
    });

    it("block-form set without endset IS tracked as unclosed", () => {
      const tree = parseTestDocument("{% set content %}some content here");
      const result = extractScopedBlocks(tree);

      expect(result.unclosed).toHaveLength(1);
      expect(result.unclosed[0]!.keyword).toBe("set");
    });

    it("block-form set with endset is valid", () => {
      const tree = parseTestDocument(`{% set content %}
  some content here
{% endset %}`);
      const result = extractScopedBlocks(tree);

      expect(result.unclosed).toHaveLength(0);
      expect(result.orphanClosers).toHaveLength(0);
    });
  });

  // === 4.7: Integration gate test — multiple inline sets ===
  describe("integration gate: inline sets", () => {
    it("template with 5+ inline sets produces zero entries in unclosed/orphanClosers", () => {
      const tree = parseTestDocument(`{% set a = 1 %}
{% set b = 2 %}
{% set c = 3 %}
{% set d = 4 %}
{% set e = 5 %}
{% set f = "hello" %}
{{ a + b + c + d + e }} {{ f }}`);
      const result = extractScopedBlocks(tree);

      expect(result.unclosed).toHaveLength(0);
      expect(result.orphanClosers).toHaveLength(0);
    });
  });

  // === 4.8: Clean template with proper nesting ===
  describe("clean template", () => {
    it("properly nested template produces empty error arrays", () => {
      const tree = parseTestDocument(`{% block content %}
  {% if condition %}
    {% for item in items %}
      {{ item }}
    {% endfor %}
  {% endif %}
{% endblock %}`);
      const result = extractScopedBlocks(tree);

      expect(result.unclosed).toHaveLength(0);
      expect(result.orphanClosers).toHaveLength(0);
      expect(result.nestingErrors).toHaveLength(0);
      expect(result.misplacedKeywords).toHaveLength(0);
      expect(result.scopedBlocks.length).toBeGreaterThan(0);
    });
  });

  // === 4.9: Multiple errors in one document ===
  describe("multiple errors in one document", () => {
    it("detects multiple different error types in a single document", () => {
      const tree = parseTestDocument(`{% if condition %}
{% else %}
{% for item in items %}
  {{ item }}
{% endif %}
{% endfor %}
{% endfor %}`);
      const result = extractScopedBlocks(tree);

      // There should be a nesting error (endif crosses over for)
      expect(result.nestingErrors.length).toBeGreaterThan(0);
      // The extra endfor at the end is an orphan
      expect(result.orphanClosers.length).toBeGreaterThan(0);
    });
  });

  // === 4.10: with/endwith pairing ===
  describe("with/endwith pairing", () => {
    it("valid with/endwith pair produces no errors", () => {
      const tree = parseTestDocument(`{% with %}
  {{ foo }}
{% endwith %}`);
      const result = extractScopedBlocks(tree);

      expect(result.unclosed).toHaveLength(0);
      expect(result.orphanClosers).toHaveLength(0);
      expect(result.nestingErrors).toHaveLength(0);
      expect(result.misplacedKeywords).toHaveLength(0);
      expect(result.scopedBlocks.some((b) => b.type === "with")).toBe(true);
    });

    it("unclosed with block is tracked", () => {
      const tree = parseTestDocument("{% with %}{{ foo }}");
      const result = extractScopedBlocks(tree);

      expect(result.unclosed).toHaveLength(1);
      expect(result.unclosed[0]!.keyword).toBe("with");
    });
  });

  // === 4.11: Named endblock ===
  describe("named endblock", () => {
    it("{% endblock header %} produces no error entries", () => {
      const tree = parseTestDocument(`{% block header %}
  <header>Header</header>
{% endblock header %}`);
      const result = extractScopedBlocks(tree);

      expect(result.unclosed).toHaveLength(0);
      expect(result.orphanClosers).toHaveLength(0);
      expect(result.nestingErrors).toHaveLength(0);
      expect(result.misplacedKeywords).toHaveLength(0);
    });
  });

  // === 4.12: Unknown end* keywords ===
  describe("unknown end* keywords", () => {
    it("{% enddeprecated %} is silently ignored, NOT added to orphanClosers", () => {
      const tree = parseTestDocument("{% enddeprecated %}");
      const result = extractScopedBlocks(tree);

      expect(result.orphanClosers).toHaveLength(0);
      expect(result.unclosed).toHaveLength(0);
    });
  });

  // === 4.13: Existing extractScopedBlocks return type compatibility ===
  describe("backward compatibility", () => {
    it("scopedBlocks contains paired blocks with correct structure", () => {
      const tree = parseTestDocument(`{% if condition %}
  content
{% endif %}`);
      const result = extractScopedBlocks(tree);

      expect(result.scopedBlocks).toHaveLength(1);
      const block = result.scopedBlocks[0]!;
      expect(block.type).toBe("if");
      expect(typeof block.startLine).toBe("number");
      expect(typeof block.endLine).toBe("number");
      expect(typeof block.startCharacter).toBe("number");
    });

    it("unclosed blocks still appear in scopedBlocks with large endLine for scope detection", () => {
      const tree = parseTestDocument("{% if condition %}content");
      const result = extractScopedBlocks(tree);

      // Should be in both unclosed and scopedBlocks
      expect(result.unclosed).toHaveLength(1);
      expect(result.scopedBlocks).toHaveLength(1);
      // The scopedBlocks entry should have a very large endLine (maxEndLine + 1000)
      expect(result.scopedBlocks[0]!.endLine).toBeGreaterThan(900);
    });
  });
});
