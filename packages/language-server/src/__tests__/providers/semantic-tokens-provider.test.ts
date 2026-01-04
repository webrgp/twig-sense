import { describe, it, expect } from "vitest";
import { SemanticTokensProvider } from "../../providers/semantic-tokens-provider";

describe("SemanticTokensProvider", () => {
  describe("getCapabilities", () => {
    it("returns semantic tokens provider capabilities", () => {
      const provider = new SemanticTokensProvider();
      const capabilities = provider.getCapabilities();

      expect(capabilities.semanticTokensProvider).toBeDefined();
      expect(capabilities.semanticTokensProvider!.full).toBe(true);
      expect(capabilities.semanticTokensProvider!.range).toBe(false);
    });

    it("includes token types legend", () => {
      const provider = new SemanticTokensProvider();
      const capabilities = provider.getCapabilities();

      const legend = capabilities.semanticTokensProvider!.legend;
      expect(legend.tokenTypes).toContain("variable");
      expect(legend.tokenTypes).toContain("property");
      expect(legend.tokenTypes).toContain("function");
      expect(legend.tokenTypes).toContain("keyword");
      expect(legend.tokenTypes).toContain("operator");
      expect(legend.tokenTypes).toContain("string");
      expect(legend.tokenTypes).toContain("number");
      expect(legend.tokenTypes).toContain("comment");
    });

    it("includes token modifiers legend", () => {
      const provider = new SemanticTokensProvider();
      const capabilities = provider.getCapabilities();

      const legend = capabilities.semanticTokensProvider!.legend;
      expect(legend.tokenModifiers).toContain("declaration");
      expect(legend.tokenModifiers).toContain("definition");
      expect(legend.tokenModifiers).toContain("readonly");
    });
  });

  describe("provider identity", () => {
    it("has correct id", () => {
      const provider = new SemanticTokensProvider();
      expect(provider.id).toBe("semantic-tokens");
    });
  });
});
