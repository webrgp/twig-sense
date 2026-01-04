import * as path from "path";
import Parser, { Tree } from "web-tree-sitter";

let parser: Parser | null = null;
let initPromise: Promise<void> | null = null;

/**
 * Initialize the test parser singleton.
 * Safe to call multiple times - will only initialize once.
 */
export async function initTestParser(): Promise<void> {
  if (parser) return;

  if (initPromise) {
    await initPromise;
    return;
  }

  initPromise = (async () => {
    const wasmPath = path.join(__dirname, "../../../dist/tree-sitter.wasm");
    await Parser.init({
      locateFile: () => wasmPath,
    });

    parser = new Parser();
    const langWasmPath = path.join(__dirname, "../../../dist/tree-sitter-twig.wasm");
    const TwigLang = await Parser.Language.load(langWasmPath);
    parser.setLanguage(TwigLang);
  })();

  await initPromise;
}

/**
 * Get the initialized test parser.
 * Throws if parser hasn't been initialized via initTestParser().
 */
export function getTestParser(): Parser {
  if (!parser) {
    throw new Error(
      "Test parser not initialized. Call initTestParser() in beforeAll hook or use the global setup file."
    );
  }
  return parser;
}

/**
 * Parse a document using the test parser.
 * Throws if parser hasn't been initialized.
 */
export function parseTestDocument(text: string): Tree {
  const tree = getTestParser().parse(text);
  if (!tree) {
    throw new Error("Failed to parse document");
  }
  return tree;
}

/**
 * Parse a document, returning null if parsing fails.
 * Throws if parser hasn't been initialized.
 */
export function parseTestDocumentOrNull(text: string): Tree | null {
  return getTestParser().parse(text);
}
