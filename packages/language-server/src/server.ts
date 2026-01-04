import {
  Connection,
  InitializeParams,
  InitializeResult,
  TextDocumentSyncKind,
} from "vscode-languageserver/node";
import { DocumentManager } from "./document-manager";
import { CompletionProvider } from "./providers/completion-provider";
import { DiagnosticsProvider } from "./providers/diagnostics-provider";
import { ProviderRegistry } from "./providers/registry";
import { SemanticTokensProvider } from "./providers/semantic-tokens-provider";

export function startServer(connection: Connection): void {
  const registry = new ProviderRegistry();
  const documents = new DocumentManager(connection);

  // Register all providers
  registry.register(new CompletionProvider());
  registry.register(new SemanticTokensProvider());
  registry.register(new DiagnosticsProvider());

  connection.onInitialize((_params: InitializeParams): InitializeResult => {
    connection.console.log("Twig Sense Language Server initializing...");

    return {
      capabilities: {
        textDocumentSync: TextDocumentSyncKind.Incremental,
        ...registry.getCapabilities(),
      },
    };
  });

  connection.onInitialized(() => {
    connection.console.log("Twig Sense Language Server initialized");

    // Register document handlers
    documents.register();

    // Initialize all providers with context
    registry.initializeAll({ connection, documents });
  });

  connection.onShutdown(() => {
    registry.dispose();
    documents.dispose();
  });

  connection.listen();
}
