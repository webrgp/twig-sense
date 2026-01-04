import { Connection, ServerCapabilities } from "vscode-languageserver/node";
import type { DocumentManager } from "../document-manager";

/**
 * Context passed to providers during registration.
 * Contains shared dependencies that providers need to function.
 */
export interface ProviderContext {
  /** LSP connection for registering handlers and sending notifications */
  connection: Connection;
  /** Document manager for accessing documents and parsed trees */
  documents: DocumentManager;
}

/**
 * Interface that all LSP feature providers must implement.
 * Providers encapsulate a specific LSP feature (completions, diagnostics, etc.)
 * and register their handlers with the LSP connection.
 */
export interface FeatureProvider {
  /** Unique identifier for this provider */
  readonly id: string;

  /**
   * Returns the server capabilities this provider contributes.
   * Called during onInitialize to aggregate all provider capabilities.
   */
  getCapabilities(): Partial<ServerCapabilities>;

  /**
   * Register handlers with the LSP connection.
   * Called after server initialization with the shared context.
   */
  register(context: ProviderContext): void;

  /**
   * Clean up resources when the server shuts down.
   * Optional - implement if provider holds resources that need cleanup.
   */
  dispose?(): void;
}
