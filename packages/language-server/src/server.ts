import { TextDocument } from "vscode-languageserver-textdocument";
import {
  CompletionParams,
  Connection,
  Diagnostic,
  InitializeParams,
  InitializeResult,
  SemanticTokensLegend,
  SemanticTokensRegistrationType,
  TextDocumentSyncKind,
} from "vscode-languageserver/node";
import { getCompletions } from "./completions";
import { initializeParser, isParserReady, parseDocument, parseDocumentIncremental } from "./parser";
import { generateSemanticTokens } from "./semantic-tokens";
import { treeCache } from "./tree-cache";
import { mergeWithDefaults, TwigSenseConfig } from "./types";
import { validateInlineComments } from "./validators/inline-comments";

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

const documents: Map<string, TextDocument> = new Map();

export function startServer(connection: Connection): void {
  // Helper function to get typed configuration
  async function getConfig(): Promise<TwigSenseConfig> {
    const rawConfig = await connection.workspace.getConfiguration("twig-sense");
    return mergeWithDefaults(rawConfig);
  }

  // Helper function to validate document and publish diagnostics
  async function validateDocument(uri: string): Promise<void> {
    const config = await getConfig();
    if (!config.diagnostics.enabled) {
      connection.sendDiagnostics({ uri, diagnostics: [] });
      return;
    }

    const tree = treeCache.get(uri);
    if (!tree) {
      connection.sendDiagnostics({ uri, diagnostics: [] });
      return;
    }

    const diagnostics: Diagnostic[] = [];

    // Validate inline comments
    if (config.diagnostics.inlineComments) {
      diagnostics.push(...validateInlineComments(tree));
    }

    connection.sendDiagnostics({ uri, diagnostics });
  }

  connection.onInitialize((_params: InitializeParams): InitializeResult => {
    connection.console.log("Twig Sense Language Server initializing...");

    return {
      capabilities: {
        textDocumentSync: TextDocumentSyncKind.Incremental,
        completionProvider: {
          resolveProvider: false,
          triggerCharacters: ["{", "|", "."],
        },
        semanticTokensProvider: {
          legend,
          full: true,
          range: false,
        },
      },
    };
  });

  connection.onInitialized(() => {
    connection.console.log("Twig Sense Language Server initialized");

    connection.client.register(SemanticTokensRegistrationType.type, {
      documentSelector: [{ language: "twig" }],
      legend,
      full: true,
      range: false,
    });
  });

  connection.onDidOpenTextDocument(async (params) => {
    const document = TextDocument.create(
      params.textDocument.uri,
      params.textDocument.languageId,
      params.textDocument.version,
      params.textDocument.text
    );
    documents.set(params.textDocument.uri, document);
    connection.console.log(`Opened: ${params.textDocument.uri}`);

    // Initialize parser lazily on first document open
    if (!isParserReady()) {
      try {
        await initializeParser();
        connection.console.log("Tree-sitter parser initialized");
      } catch (error) {
        connection.console.error(`Failed to initialize parser: ${error}`);
        return;
      }
    }

    // Parse document and cache tree
    const tree = parseDocument(params.textDocument.text);
    if (tree) {
      treeCache.set(params.textDocument.uri, tree);
      // Validate after parsing
      await validateDocument(params.textDocument.uri);
    }
  });

  connection.onDidChangeTextDocument(async (params) => {
    const document = documents.get(params.textDocument.uri);
    if (document) {
      const updated = TextDocument.update(
        document,
        params.contentChanges,
        params.textDocument.version
      );
      documents.set(params.textDocument.uri, updated);

      // Use incremental parsing if we have a cached tree
      const oldTree = treeCache.get(params.textDocument.uri);
      if (oldTree && isParserReady()) {
        const newTree = parseDocumentIncremental(updated.getText(), oldTree, params.contentChanges);
        if (newTree) {
          treeCache.set(params.textDocument.uri, newTree);
        }
      } else if (isParserReady()) {
        // Full parse if no cached tree
        const tree = parseDocument(updated.getText());
        if (tree) {
          treeCache.set(params.textDocument.uri, tree);
        }
      }

      // Validate after parsing
      await validateDocument(params.textDocument.uri);
    }
  });

  connection.onDidCloseTextDocument((params) => {
    documents.delete(params.textDocument.uri);
    treeCache.delete(params.textDocument.uri);
    // Clear diagnostics for closed document
    connection.sendDiagnostics({ uri: params.textDocument.uri, diagnostics: [] });
    connection.console.log(`Closed: ${params.textDocument.uri}`);
  });

  connection.languages.semanticTokens.on(async (params) => {
    const document = documents.get(params.textDocument.uri);
    if (!document) {
      return { data: [] };
    }

    // Check if semantic tokens are enabled via configuration
    const config = await getConfig();
    if (!config.semanticTokens.enabled) {
      return { data: [] };
    }

    // Get cached tree
    const tree = treeCache.get(params.textDocument.uri);
    if (!tree) {
      return { data: [] };
    }

    // Generate semantic tokens from the tree
    const data = generateSemanticTokens(tree);
    return { data };
  });

  connection.onCompletion((params: CompletionParams) => {
    const document = documents.get(params.textDocument.uri);
    if (!document) {
      return [];
    }

    // Get cached tree for document-aware completions
    const tree = treeCache.get(params.textDocument.uri);
    return getCompletions(document, params, tree);
  });

  connection.listen();
}
