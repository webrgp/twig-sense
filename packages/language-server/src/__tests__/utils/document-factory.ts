import { TextDocument } from "vscode-languageserver-textdocument";

let documentCounter = 0;

/**
 * Create a TextDocument for testing.
 * Auto-generates unique URIs for each document.
 */
export function createTestDocument(content: string, languageId: string = "twig"): TextDocument {
  documentCounter++;
  const uri = `file:///test-${documentCounter}.twig`;
  return TextDocument.create(uri, languageId, 1, content);
}

/**
 * Create a TextDocument with a specific URI.
 */
export function createTestDocumentWithUri(
  content: string,
  uri: string,
  languageId: string = "twig"
): TextDocument {
  return TextDocument.create(uri, languageId, 1, content);
}

/**
 * Reset the document counter.
 * Useful for tests that need predictable URIs.
 */
export function resetDocumentCounter(): void {
  documentCounter = 0;
}
