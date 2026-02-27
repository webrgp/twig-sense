import { describe, it, expect } from "vitest";
import { DEFAULT_CONFIG, mergeWithDefaults, TwigSenseConfig } from "../types/config";

describe("TwigSenseConfig", () => {
  describe("DEFAULT_CONFIG", () => {
    it("has all expected default values", () => {
      expect(DEFAULT_CONFIG.semanticTokens.enabled).toBe(true);
      expect(DEFAULT_CONFIG.diagnostics.enabled).toBe(true);
      expect(DEFAULT_CONFIG.diagnostics.inlineComments).toBe(true);
      expect(DEFAULT_CONFIG.diagnostics.blockTags).toBe(true);
      expect(DEFAULT_CONFIG.templates.root).toBe("templates");
      expect(DEFAULT_CONFIG.templates.fileExtension).toBe(".twig");
      expect(DEFAULT_CONFIG.html.semanticHighlighting).toBe(true);
    });
  });

  describe("mergeWithDefaults", () => {
    it("returns default config when input is undefined", () => {
      const config = mergeWithDefaults(undefined);
      expect(config).toEqual(DEFAULT_CONFIG);
    });

    it("returns default config when input is empty object", () => {
      const config = mergeWithDefaults({});
      expect(config).toEqual(DEFAULT_CONFIG);
    });

    it("merges partial semanticTokens config", () => {
      const config = mergeWithDefaults({
        semanticTokens: { enabled: false },
      });
      expect(config.semanticTokens.enabled).toBe(false);
      // Other sections should use defaults
      expect(config.diagnostics.enabled).toBe(true);
      expect(config.templates.root).toBe("templates");
    });

    it("merges partial diagnostics config", () => {
      const config = mergeWithDefaults({
        diagnostics: { enabled: true, inlineComments: false, blockTags: false },
      });
      expect(config.diagnostics.enabled).toBe(true);
      expect(config.diagnostics.inlineComments).toBe(false);
      expect(config.diagnostics.blockTags).toBe(false);
    });

    it("applies defaults for missing nested properties", () => {
      const config = mergeWithDefaults({
        diagnostics: { enabled: false },
      } as Partial<TwigSenseConfig>);
      expect(config.diagnostics.enabled).toBe(false);
      expect(config.diagnostics.inlineComments).toBe(true); // default
      expect(config.diagnostics.blockTags).toBe(true); // default
    });

    it("merges partial templates config with root only", () => {
      const config = mergeWithDefaults({
        templates: { root: "views" },
      } as Partial<TwigSenseConfig>);
      expect(config.templates.root).toBe("views");
      expect(config.templates.fileExtension).toBe(".twig"); // default
    });

    it("merges partial templates config with fileExtension only", () => {
      const config = mergeWithDefaults({
        templates: { fileExtension: ".html.twig" },
      } as Partial<TwigSenseConfig>);
      expect(config.templates.root).toBe("templates"); // default
      expect(config.templates.fileExtension).toBe(".html.twig");
    });

    it("merges full templates config", () => {
      const config = mergeWithDefaults({
        templates: { root: "views", fileExtension: ".html.twig" },
      });
      expect(config.templates.root).toBe("views");
      expect(config.templates.fileExtension).toBe(".html.twig");
    });

    it("merges partial html config", () => {
      const config = mergeWithDefaults({
        html: { semanticHighlighting: false },
      });
      expect(config.html.semanticHighlighting).toBe(false);
    });

    it("merges multiple partial sections", () => {
      const config = mergeWithDefaults({
        semanticTokens: { enabled: false },
        diagnostics: { enabled: false, inlineComments: false, blockTags: false },
        templates: { root: "custom", fileExtension: ".html.twig" },
        html: { semanticHighlighting: false },
      });
      expect(config.semanticTokens.enabled).toBe(false);
      expect(config.diagnostics.enabled).toBe(false);
      expect(config.diagnostics.inlineComments).toBe(false);
      expect(config.diagnostics.blockTags).toBe(false);
      expect(config.templates.root).toBe("custom");
      expect(config.templates.fileExtension).toBe(".html.twig");
      expect(config.html.semanticHighlighting).toBe(false);
    });

    it("does not modify DEFAULT_CONFIG", () => {
      const originalEnabled = DEFAULT_CONFIG.semanticTokens.enabled;
      mergeWithDefaults({ semanticTokens: { enabled: false } });
      expect(DEFAULT_CONFIG.semanticTokens.enabled).toBe(originalEnabled);
    });

    it("returns a new object instance", () => {
      const config = mergeWithDefaults(undefined);
      expect(config).not.toBe(DEFAULT_CONFIG);
      expect(config.semanticTokens).not.toBe(DEFAULT_CONFIG.semanticTokens);
    });
  });
});
