import { describe, it, expect } from "vitest";
import { CompletionProvider } from "../../providers/completion-provider";

describe("CompletionProvider", () => {
  describe("getCapabilities", () => {
    it("returns completion provider capabilities", () => {
      const provider = new CompletionProvider();
      const capabilities = provider.getCapabilities();

      expect(capabilities.completionProvider).toBeDefined();
      expect(capabilities.completionProvider!.resolveProvider).toBe(false);
    });

    it("specifies trigger characters for completion", () => {
      const provider = new CompletionProvider();
      const capabilities = provider.getCapabilities();

      expect(capabilities.completionProvider!.triggerCharacters).toContain("{");
      expect(capabilities.completionProvider!.triggerCharacters).toContain("|");
      expect(capabilities.completionProvider!.triggerCharacters).toContain(".");
    });
  });

  describe("provider identity", () => {
    it("has correct id", () => {
      const provider = new CompletionProvider();
      expect(provider.id).toBe("completion");
    });
  });
});
