import {
  SemanticTokensLegend,
  SemanticTokensRegistrationType,
  ServerCapabilities,
} from "vscode-languageserver/node";
import { generateSemanticTokens } from "../semantic-tokens";
import type { FeatureProvider, ProviderContext } from "./types";

const tokenTypes = [
  "variable",
  "property",
  "function",
  "keyword",
  "operator",
  "string",
  "number",
  "comment",
];

const tokenModifiers = ["declaration", "definition", "readonly"];

const legend: SemanticTokensLegend = {
  tokenTypes,
  tokenModifiers,
};

/**
 * Provider for semantic token highlighting.
 */
export class SemanticTokensProvider implements FeatureProvider {
  readonly id = "semantic-tokens";

  getCapabilities(): Partial<ServerCapabilities> {
    return {
      semanticTokensProvider: {
        legend,
        full: true,
        range: false,
      },
    };
  }

  register(context: ProviderContext): void {
    const { connection, documents } = context;

    // Register semantic tokens after initialization
    connection.client.register(SemanticTokensRegistrationType.type, {
      documentSelector: [{ language: "twig" }],
      legend,
      full: true,
      range: false,
    });

    connection.languages.semanticTokens.on(async (params) => {
      const document = documents.getDocument(params.textDocument.uri);
      if (!document) {
        return { data: [] };
      }

      // Check if semantic tokens are enabled via configuration
      const config = await documents.getConfig();
      if (!config.semanticTokens.enabled) {
        return { data: [] };
      }

      const tree = documents.getTree(params.textDocument.uri);
      if (!tree) {
        return { data: [] };
      }

      const data = generateSemanticTokens(tree);
      return { data };
    });
  }
}
