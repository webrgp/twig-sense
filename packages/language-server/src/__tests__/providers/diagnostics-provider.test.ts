import { describe, it, expect, vi } from "vitest";
import { DiagnosticsProvider } from "../../providers/diagnostics-provider";
import type { ProviderContext } from "../../providers/types";
import type { TwigSenseConfig } from "../../types/config";
import { DEFAULT_CONFIG } from "../../types/config";
import { parseTestDocument } from "../utils";

function createMockContext(configOverrides?: Partial<TwigSenseConfig>): {
  context: ProviderContext;
  sendDiagnostics: ReturnType<typeof vi.fn>;
  triggerParse: (uri: string, tree: import("web-tree-sitter").Tree) => void;
} {
  const sendDiagnostics = vi.fn();
  let parseHandler: ((uri: string, tree: import("web-tree-sitter").Tree) => void) | null = null;

  const config: TwigSenseConfig = {
    ...DEFAULT_CONFIG,
    diagnostics: {
      ...DEFAULT_CONFIG.diagnostics,
      ...configOverrides?.diagnostics,
    },
    ...(configOverrides?.semanticTokens && { semanticTokens: configOverrides.semanticTokens }),
    ...(configOverrides?.completion && { completion: configOverrides.completion }),
    ...(configOverrides?.html && { html: configOverrides.html }),
  };

  const context: ProviderContext = {
    connection: {
      sendDiagnostics,
      onDidCloseTextDocument: vi.fn(),
    } as unknown as ProviderContext["connection"],
    documents: {
      onDidParse: vi.fn((handler: (uri: string, tree: import("web-tree-sitter").Tree) => void) => {
        parseHandler = handler;
      }),
      getConfig: vi.fn(async () => config),
    } as unknown as ProviderContext["documents"],
  };

  return {
    context,
    sendDiagnostics,
    triggerParse: (uri: string, tree: import("web-tree-sitter").Tree) => {
      if (parseHandler) parseHandler(uri, tree);
    },
  };
}

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

  describe("config guards", () => {
    it("blockTags: false produces zero block tag diagnostics", async () => {
      const { context, sendDiagnostics, triggerParse } = createMockContext({
        diagnostics: { enabled: true, inlineComments: true, blockTags: false },
      });

      const provider = new DiagnosticsProvider();
      provider.register(context);

      // Template with an unclosed if - would normally produce block tag diagnostics
      const tree = parseTestDocument("{% if condition %}some content");
      triggerParse("file:///test.twig", tree);

      // Wait for async validate to complete
      await vi.waitFor(() => {
        expect(sendDiagnostics).toHaveBeenCalled();
      });

      const call = sendDiagnostics.mock.calls[0]![0];
      // Should have zero block tag diagnostics (no "Unclosed" messages)
      const blockTagDiags = call.diagnostics.filter(
        (d: { message: string }) =>
          d.message.includes("Unclosed") ||
          d.message.includes("Unexpected") ||
          d.message.includes("was closed while") ||
          d.message.includes("is only valid inside")
      );
      expect(blockTagDiags).toHaveLength(0);
    });

    it("enabled: false with blockTags: true and inlineComments: true produces zero diagnostics", async () => {
      const { context, sendDiagnostics, triggerParse } = createMockContext({
        diagnostics: { enabled: false, inlineComments: true, blockTags: true },
      });

      const provider = new DiagnosticsProvider();
      provider.register(context);

      // Template with both block tag issues and inline comment issues
      const tree = parseTestDocument("{% if condition %}{{ value # comment }}");
      triggerParse("file:///test.twig", tree);

      // Wait for async validate to complete
      await vi.waitFor(() => {
        expect(sendDiagnostics).toHaveBeenCalled();
      });

      const call = sendDiagnostics.mock.calls[0]![0];
      // Master switch off - zero diagnostics of any kind
      expect(call.diagnostics).toHaveLength(0);
    });
  });
});
