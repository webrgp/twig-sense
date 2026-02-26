import { Diagnostic, ServerCapabilities } from "vscode-languageserver/node";
import type { Tree } from "web-tree-sitter";
import { validateInlineComments } from "../validators/inline-comments";
import { validateBlockTags } from "../validators/block-tags";
import type { FeatureProvider, ProviderContext } from "./types";

/**
 * Provider for Twig diagnostics (validation).
 */
export class DiagnosticsProvider implements FeatureProvider {
  readonly id = "diagnostics";
  private context: ProviderContext | null = null;

  getCapabilities(): Partial<ServerCapabilities> {
    // Diagnostics don't add server capabilities directly
    // They're pushed via sendDiagnostics
    return {};
  }

  register(context: ProviderContext): void {
    this.context = context;
    const { documents, connection } = context;

    // Listen for parse events to validate documents
    documents.onDidParse((uri, tree) => {
      this.validate(uri, tree);
    });

    // Clear diagnostics when document closes
    connection.onDidCloseTextDocument((params) => {
      connection.sendDiagnostics({ uri: params.textDocument.uri, diagnostics: [] });
    });
  }

  /**
   * Validate a document and publish diagnostics.
   */
  private async validate(uri: string, tree: Tree): Promise<void> {
    if (!this.context) return;

    const { connection, documents } = this.context;
    const config = await documents.getConfig();

    if (!config.diagnostics.enabled) {
      connection.sendDiagnostics({ uri, diagnostics: [] });
      return;
    }

    const diagnostics: Diagnostic[] = [];

    // Validate inline comments
    if (config.diagnostics.inlineComments) {
      diagnostics.push(...validateInlineComments(tree));
    }

    // Validate block tags
    if (config.diagnostics.blockTags) {
      diagnostics.push(...validateBlockTags(tree));
    }

    connection.sendDiagnostics({ uri, diagnostics });
  }
}
