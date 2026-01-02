import {
  Connection,
  InitializeParams,
  InitializeResult,
  TextDocumentSyncKind,
  SemanticTokensRegistrationType,
  SemanticTokensLegend,
  CompletionParams,
} from "vscode-languageserver/node";
import { TextDocument } from "vscode-languageserver-textdocument";
import {
  initializeParser,
  isParserReady,
  parseDocument,
  parseDocumentIncremental,
} from "./parser";
import { treeCache } from "./tree-cache";
import { generateSemanticTokens } from "./semantic-tokens";
import { getCompletions } from "./completions";

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
    }
  });

  connection.onDidChangeTextDocument((params) => {
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
        const newTree = parseDocumentIncremental(
          updated.getText(),
          oldTree,
          params.contentChanges
        );
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
    }
  });

  connection.onDidCloseTextDocument((params) => {
    documents.delete(params.textDocument.uri);
    treeCache.delete(params.textDocument.uri);
    connection.console.log(`Closed: ${params.textDocument.uri}`);
  });

  connection.languages.semanticTokens.on(async (params) => {
    const document = documents.get(params.textDocument.uri);
    if (!document) {
      return { data: [] };
    }

    // Check if semantic tokens are enabled via configuration
    const config = await connection.workspace.getConfiguration("twig-sense");
    if (config.semanticTokens?.enabled === false) {
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

    return getCompletions(document, params);
  });

  connection.listen();
}
