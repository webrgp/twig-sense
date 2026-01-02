import * as path from "path";
import Parser, { Tree, Point } from "web-tree-sitter";
import { TextDocumentContentChangeEvent } from "vscode-languageserver";

let parser: Parser | null = null;
let initPromise: Promise<void> | null = null;

export async function initializeParser(): Promise<void> {
  if (parser) {
    return;
  }
  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    try {
      const wasmPath = path.join(__dirname, "tree-sitter.wasm");
      await Parser.init({
        locateFile: () => wasmPath,
      });

      parser = new Parser();

      const langWasmPath = path.join(__dirname, "tree-sitter-twig.wasm");
      const TwigLang = await Parser.Language.load(langWasmPath);
      parser.setLanguage(TwigLang);
    } catch (error) {
      console.error("Failed to initialize tree-sitter parser:", error);
      parser = null;
      throw error;
    }
  })();

  return initPromise;
}

export function isParserReady(): boolean {
  return parser !== null;
}

export function parseDocument(text: string): Tree | null {
  if (!parser) {
    return null;
  }
  return parser.parse(text);
}

export function parseDocumentIncremental(
  text: string,
  oldTree: Tree,
  changes: TextDocumentContentChangeEvent[]
): Tree | null {
  if (!parser) {
    return null;
  }

  // Apply edits to the old tree
  for (const change of changes) {
    if ("range" in change) {
      const startIndex = positionToIndex(text, change.range.start);
      const oldEndIndex = startIndex + change.rangeLength!;
      const newEndIndex = startIndex + change.text.length;

      const startPosition: Point = {
        row: change.range.start.line,
        column: change.range.start.character,
      };

      const oldEndPosition = indexToPosition(text, oldEndIndex);
      const newEndPosition = indexToPosition(text, newEndIndex);

      oldTree.edit({
        startIndex,
        oldEndIndex,
        newEndIndex,
        startPosition,
        oldEndPosition,
        newEndPosition,
      });
    }
  }

  return parser.parse(text, oldTree);
}

function positionToIndex(
  text: string,
  position: { line: number; character: number }
): number {
  const lines = text.split("\n");
  let index = 0;
  for (let i = 0; i < position.line && i < lines.length; i++) {
    const line = lines[i];
    if (line !== undefined) {
      index += line.length + 1; // +1 for newline
    }
  }
  index += position.character;
  return index;
}

function indexToPosition(text: string, index: number): Point {
  let row = 0;
  let column = 0;
  for (let i = 0; i < index && i < text.length; i++) {
    if (text[i] === "\n") {
      row++;
      column = 0;
    } else {
      column++;
    }
  }
  return { row, column };
}
