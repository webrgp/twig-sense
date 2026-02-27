import {
  Connection,
  InitializeParams,
  InitializeResult,
  TextDocumentSyncKind,
  WorkspaceFolder,
} from "vscode-languageserver/node";
import { DocumentManager } from "./document-manager";
import { CompletionProvider } from "./providers/completion-provider";
import { DefinitionProvider } from "./providers/definition-provider";
import { DiagnosticsProvider } from "./providers/diagnostics-provider";
import { ProviderRegistry } from "./providers/registry";
import { SemanticTokensProvider } from "./providers/semantic-tokens-provider";

export function startServer(connection: Connection): void {
  const registry = new ProviderRegistry();
  const documents = new DocumentManager(connection);
  let workspaceFolders: WorkspaceFolder[] = [];

  // Register all providers
  registry.register(new CompletionProvider());
  registry.register(new SemanticTokensProvider());
  registry.register(new DiagnosticsProvider());
  registry.register(new DefinitionProvider());

  connection.onInitialize((params: InitializeParams): InitializeResult => {
    connection.console.log("Twig Sense Language Server initializing...");

    // Capture workspace folders with rootUri fallback
    if (params.workspaceFolders && params.workspaceFolders.length > 0) {
      workspaceFolders = params.workspaceFolders;
    } else if (params.rootUri) {
      workspaceFolders = [{ uri: params.rootUri, name: "root" }];
    }

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
    registry.initializeAll({ connection, documents, workspaceFolders });
  });

  connection.onShutdown(() => {
    registry.dispose();
    documents.dispose();
  });

  connection.listen();
}
