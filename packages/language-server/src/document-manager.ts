import { TextDocument } from "vscode-languageserver-textdocument";
import {
  Connection,
  DidChangeTextDocumentParams,
  DidCloseTextDocumentParams,
  DidOpenTextDocumentParams,
} from "vscode-languageserver/node";
import type { Tree } from "web-tree-sitter";
import { initializeParser, isParserReady, parseDocument, parseDocumentIncremental } from "./parser";
import { treeCache } from "./tree-cache";
import { mergeWithDefaults, TwigSenseConfig } from "./types";

export type ParseEventHandler = (uri: string, tree: Tree) => void;

/**
 * Manages document lifecycle and parsing.
 * Handles document open/change/close events and maintains parsed tree cache.
 */
export class DocumentManager {
  private documents: Map<string, TextDocument> = new Map();
  private parseHandlers: ParseEventHandler[] = [];
  private connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  /**
   * Get the configuration from the workspace.
   */
  async getConfig(): Promise<TwigSenseConfig> {
    const rawConfig = await this.connection.workspace.getConfiguration("twig-sense");
    return mergeWithDefaults(rawConfig);
  }

  /**
   * Register a handler to be called after a document is parsed.
   */
  onDidParse(handler: ParseEventHandler): void {
    this.parseHandlers.push(handler);
  }

  /**
   * Emit a parse event to all registered handlers.
   */
  private emitParse(uri: string, tree: Tree): void {
    for (const handler of this.parseHandlers) {
      handler(uri, tree);
    }
  }

  /**
   * Get a document by URI.
   */
  getDocument(uri: string): TextDocument | undefined {
    return this.documents.get(uri);
  }

  /**
   * Get the parsed tree for a document.
   */
  getTree(uri: string): Tree | undefined {
    return treeCache.get(uri);
  }

  /**
   * Register document lifecycle handlers with the connection.
   */
  register(): void {
    this.connection.onDidOpenTextDocument((params) => this.handleOpen(params));
    this.connection.onDidChangeTextDocument((params) => this.handleChange(params));
    this.connection.onDidCloseTextDocument((params) => this.handleClose(params));
  }

  private async handleOpen(params: DidOpenTextDocumentParams): Promise<void> {
    const document = TextDocument.create(
      params.textDocument.uri,
      params.textDocument.languageId,
      params.textDocument.version,
      params.textDocument.text
    );
    this.documents.set(params.textDocument.uri, document);
    this.connection.console.log(`Opened: ${params.textDocument.uri}`);

    // Initialize parser lazily on first document open
    if (!isParserReady()) {
      try {
        await initializeParser();
        this.connection.console.log("Tree-sitter parser initialized");
      } catch (error) {
        this.connection.console.error(`Failed to initialize parser: ${error}`);
        return;
      }
    }

    // Parse document and cache tree
    const tree = parseDocument(params.textDocument.text);
    if (tree) {
      treeCache.set(params.textDocument.uri, tree);
      this.emitParse(params.textDocument.uri, tree);
    }
  }

  private async handleChange(params: DidChangeTextDocumentParams): Promise<void> {
    const document = this.documents.get(params.textDocument.uri);
    if (!document) {
      return;
    }

    const updated = TextDocument.update(
      document,
      params.contentChanges,
      params.textDocument.version
    );
    this.documents.set(params.textDocument.uri, updated);

    // Use incremental parsing if we have a cached tree
    const oldTree = treeCache.get(params.textDocument.uri);
    let newTree: Tree | null = null;

    if (oldTree && isParserReady()) {
      newTree = parseDocumentIncremental(updated.getText(), oldTree, params.contentChanges);
    } else if (isParserReady()) {
      // Full parse if no cached tree
      newTree = parseDocument(updated.getText());
    }

    if (newTree) {
      treeCache.set(params.textDocument.uri, newTree);
      this.emitParse(params.textDocument.uri, newTree);
    }
  }

  private handleClose(params: DidCloseTextDocumentParams): void {
    this.documents.delete(params.textDocument.uri);
    treeCache.delete(params.textDocument.uri);
    this.connection.console.log(`Closed: ${params.textDocument.uri}`);
  }

  /**
   * Clean up resources.
   */
  dispose(): void {
    this.documents.clear();
    this.parseHandlers = [];
  }
}
