import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { DefinitionParams, Location, ServerCapabilities } from "vscode-languageserver/node";
import type { SyntaxNode } from "web-tree-sitter";
import type { FeatureProvider, ProviderContext } from "./types";

/**
 * Strips surrounding quotes (single or double) from a string node's text.
 */
function stripQuotes(text: string): string {
  if (
    (text.startsWith('"') && text.endsWith('"')) ||
    (text.startsWith("'") && text.endsWith("'"))
  ) {
    return text.slice(1, -1);
  }
  return text;
}

/**
 * Checks if a syntax node is a string inside an `{% include %}` statement_block.
 * Returns the template path string if so, or null otherwise.
 */
function getIncludeTemplatePath(node: SyntaxNode): string | null {
  // Must be a string node
  if (node.type !== "string") {
    return null;
  }

  // Parent must be a statement_block
  const parent = node.parent;
  if (!parent || parent.type !== "statement_block") {
    return null;
  }

  // The statement_block must have a keyword child with text "include"
  const keyword = parent.children.find((child) => child.type === "keyword");
  if (!keyword || keyword.text !== "include") {
    return null;
  }

  return stripQuotes(node.text);
}

/**
 * Provider for Twig Go to Definition functionality.
 * Resolves template path strings in {% include %} tags to file locations on disk.
 */
export class DefinitionProvider implements FeatureProvider {
  readonly id = "definition";

  getCapabilities(): Partial<ServerCapabilities> {
    return { definitionProvider: true };
  }

  register(context: ProviderContext): void {
    const { connection, documents, workspaceFolders } = context;

    connection.onDefinition(async (params: DefinitionParams): Promise<Location | null> => {
      const document = documents.getDocument(params.textDocument.uri);
      const tree = documents.getTree(params.textDocument.uri);
      if (!document || !tree) {
        return null;
      }

      // Find the deepest node at cursor position
      const cursorPosition = {
        row: params.position.line,
        column: params.position.character,
      };
      const node = tree.rootNode.descendantForPosition(cursorPosition);
      if (!node) {
        return null;
      }

      // Check if this is a string inside an include statement_block
      const templatePath = getIncludeTemplatePath(node);
      if (!templatePath) {
        return null;
      }

      // Get config for template root and file extension
      const config = await documents.getConfig();
      const templateRoot = config.templates.root;
      const fileExtension = config.templates.fileExtension;

      // Try to resolve the path against each workspace folder
      for (const folder of workspaceFolders) {
        const folderPath = fileURLToPath(folder.uri);
        const basePath = path.join(folderPath, templateRoot, templatePath);

        // Try exact path first
        if (fs.existsSync(basePath)) {
          return Location.create(pathToFileURL(basePath).toString(), {
            start: { line: 0, character: 0 },
            end: { line: 0, character: 0 },
          });
        }

        // Try appending extension if not already present
        if (!templatePath.endsWith(fileExtension)) {
          const withExtension = basePath + fileExtension;
          if (fs.existsSync(withExtension)) {
            return Location.create(pathToFileURL(withExtension).toString(), {
              start: { line: 0, character: 0 },
              end: { line: 0, character: 0 },
            });
          }
        }
      }

      return null;
    });
  }
}
