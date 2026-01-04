import { describe, it, expect } from "vitest";
import { DEFAULT_CONFIG, mergeWithDefaults, TwigSenseConfig } from "../types/config";

describe("TwigSenseConfig", () => {
  describe("DEFAULT_CONFIG", () => {
    it("has all expected default values", () => {
      expect(DEFAULT_CONFIG.semanticTokens.enabled).toBe(true);
      expect(DEFAULT_CONFIG.diagnostics.enabled).toBe(true);
      expect(DEFAULT_CONFIG.diagnostics.inlineComments).toBe(true);
      expect(DEFAULT_CONFIG.completion.templateRoot).toBe("templates");
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
      expect(config.completion.templateRoot).toBe("templates");
    });

    it("merges partial diagnostics config", () => {
      const config = mergeWithDefaults({
        diagnostics: { enabled: true, inlineComments: false },
      });
      expect(config.diagnostics.enabled).toBe(true);
      expect(config.diagnostics.inlineComments).toBe(false);
    });

    it("applies defaults for missing nested properties", () => {
      const config = mergeWithDefaults({
        diagnostics: { enabled: false },
      } as Partial<TwigSenseConfig>);
      expect(config.diagnostics.enabled).toBe(false);
      expect(config.diagnostics.inlineComments).toBe(true); // default
    });

    it("merges partial completion config", () => {
      const config = mergeWithDefaults({
        completion: { templateRoot: "views" },
      });
      expect(config.completion.templateRoot).toBe("views");
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
        diagnostics: { enabled: false, inlineComments: false },
        completion: { templateRoot: "custom" },
        html: { semanticHighlighting: false },
      });
      expect(config.semanticTokens.enabled).toBe(false);
      expect(config.diagnostics.enabled).toBe(false);
      expect(config.diagnostics.inlineComments).toBe(false);
      expect(config.completion.templateRoot).toBe("custom");
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
