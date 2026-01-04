import { describe, it, expect } from "vitest";
import { DiagnosticsProvider } from "../../providers/diagnostics-provider";

describe("DiagnosticsProvider", () => {
  describe("getCapabilities", () => {
    it("returns empty capabilities (diagnostics are push-based)", () => {
      const provider = new DiagnosticsProvider();
      const capabilities = provider.getCapabilities();

      // Diagnostics provider doesn't contribute to ServerCapabilities
      // because diagnostics are pushed via sendDiagnostics
      expect(Object.keys(capabilities)).toHaveLength(0);
    });
  });

  describe("provider identity", () => {
    it("has correct id", () => {
      const provider = new DiagnosticsProvider();
      expect(provider.id).toBe("diagnostics");
    });
  });
});
