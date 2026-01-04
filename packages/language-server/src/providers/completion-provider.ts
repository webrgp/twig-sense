import { CompletionParams, ServerCapabilities } from "vscode-languageserver/node";
import { getCompletions } from "../completions";
import type { FeatureProvider, ProviderContext } from "./types";

/**
 * Provider for Twig completion functionality.
 */
export class CompletionProvider implements FeatureProvider {
  readonly id = "completion";

  getCapabilities(): Partial<ServerCapabilities> {
    return {
      completionProvider: {
        resolveProvider: false,
        triggerCharacters: ["{", "|", "."],
      },
    };
  }

  register(context: ProviderContext): void {
    const { connection, documents } = context;

    connection.onCompletion((params: CompletionParams) => {
      const document = documents.getDocument(params.textDocument.uri);
      if (!document) {
        return [];
      }

      const tree = documents.getTree(params.textDocument.uri);
      return getCompletions(document, params, tree);
    });
  }
}
