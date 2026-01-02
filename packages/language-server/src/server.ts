import {
  Connection,
  InitializeParams,
  InitializeResult,
  TextDocumentSyncKind,
  SemanticTokensRegistrationType,
  SemanticTokensLegend,
} from "vscode-languageserver/node";
import { TextDocument } from "vscode-languageserver-textdocument";

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

  connection.onDidOpenTextDocument((params) => {
    const document = TextDocument.create(
      params.textDocument.uri,
      params.textDocument.languageId,
      params.textDocument.version,
      params.textDocument.text
    );
    documents.set(params.textDocument.uri, document);
    connection.console.log(`Opened: ${params.textDocument.uri}`);
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
    }
  });

  connection.onDidCloseTextDocument((params) => {
    documents.delete(params.textDocument.uri);
    connection.console.log(`Closed: ${params.textDocument.uri}`);
  });

  connection.languages.semanticTokens.on((params) => {
    const document = documents.get(params.textDocument.uri);
    if (!document) {
      return { data: [] };
    }

    // Placeholder: Return empty tokens for now
    // Tree-sitter integration will provide actual tokens
    return { data: [] };
  });

  connection.listen();
}
