import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { pathToFileURL } from "node:url";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { DefinitionProvider } from "../../providers/definition-provider";
import type { ProviderContext } from "../../providers/types";
import { DEFAULT_CONFIG, TwigSenseConfig } from "../../types/config";
import { parseTestDocument } from "../utils";

// Temporary directory for test fixtures
let tmpDir: string;

function createTmpDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), "twig-sense-test-"));
}

function cleanupTmpDir(dir: string): void {
  fs.rmSync(dir, { recursive: true, force: true });
}

/**
 * Creates a file within the tmp directory, ensuring parent dirs exist.
 */
function createFile(relativePath: string, content: string = ""): string {
  const fullPath = path.join(tmpDir, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
  return fullPath;
}

function createMockContext(options?: {
  configOverrides?: Partial<TwigSenseConfig>;
  workspaceFolderUris?: string[];
}): {
  context: ProviderContext;
  onDefinitionHandler: (
    params: import("vscode-languageserver/node").DefinitionParams
  ) => Promise<import("vscode-languageserver/node").Location | null>;
} {
  let definitionHandler:
    | ((
        params: import("vscode-languageserver/node").DefinitionParams
      ) => Promise<import("vscode-languageserver/node").Location | null>)
    | null = null;

  const config: TwigSenseConfig = {
    ...DEFAULT_CONFIG,
    templates: {
      ...DEFAULT_CONFIG.templates,
      ...options?.configOverrides?.templates,
    },
  };

  const workspaceFolders = (options?.workspaceFolderUris ?? []).map((uri, i) => ({
    uri,
    name: `folder-${i}`,
  }));

  const context: ProviderContext = {
    connection: {
      onDefinition: vi.fn(
        (
          handler: (
            params: import("vscode-languageserver/node").DefinitionParams
          ) => Promise<import("vscode-languageserver/node").Location | null>
        ) => {
          definitionHandler = handler;
        }
      ),
    } as unknown as ProviderContext["connection"],
    documents: {
      getDocument: vi.fn(),
      getTree: vi.fn(),
      getConfig: vi.fn(async () => config),
    } as unknown as ProviderContext["documents"],
    workspaceFolders,
  };

  return {
    context,
    onDefinitionHandler: (params) => {
      if (!definitionHandler) throw new Error("Definition handler not registered");
      return definitionHandler(params);
    },
  };
}

function makeDefinitionParams(
  uri: string,
  line: number,
  character: number
): import("vscode-languageserver/node").DefinitionParams {
  return {
    textDocument: { uri },
    position: { line, character },
  };
}

describe("DefinitionProvider", () => {
  beforeEach(() => {
    tmpDir = createTmpDir();
  });

  afterEach(() => {
    cleanupTmpDir(tmpDir);
  });

  describe("provider identity", () => {
    it("has correct id", () => {
      const provider = new DefinitionProvider();
      expect(provider.id).toBe("definition");
    });
  });

  describe("getCapabilities", () => {
    it("returns definitionProvider capability", () => {
      const provider = new DefinitionProvider();
      const capabilities = provider.getCapabilities();
      expect(capabilities.definitionProvider).toBe(true);
    });
  });

  describe("include detection", () => {
    it("recognizes string inside include statement_block", async () => {
      const templateContent = '{% include "partials/header.twig" %}';
      const tree = parseTestDocument(templateContent);
      const wsUri = pathToFileURL(tmpDir).toString();

      createFile("templates/partials/header.twig", "<h1>Header</h1>");

      const { context, onDefinitionHandler } = createMockContext({
        workspaceFolderUris: [wsUri],
      });

      const provider = new DefinitionProvider();
      provider.register(context);

      const docUri = "file:///test.twig";
      // Mock getDocument and getTree
      (context.documents.getDocument as ReturnType<typeof vi.fn>).mockReturnValue({ uri: docUri });
      (context.documents.getTree as ReturnType<typeof vi.fn>).mockReturnValue(tree);

      // Cursor on the string (column 12 = inside "partials/header.twig")
      const result = await onDefinitionHandler(makeDefinitionParams(docUri, 0, 12));

      expect(result).not.toBeNull();
      const expectedUri = pathToFileURL(
        path.join(tmpDir, "templates/partials/header.twig")
      ).toString();
      expect(result!.uri).toBe(expectedUri);
      expect(result!.range.start.line).toBe(0);
      expect(result!.range.start.character).toBe(0);
    });

    it("rejects string in non-include context (set statement)", async () => {
      const templateContent = '{% set name = "hello" %}';
      const tree = parseTestDocument(templateContent);
      const wsUri = pathToFileURL(tmpDir).toString();

      const { context, onDefinitionHandler } = createMockContext({
        workspaceFolderUris: [wsUri],
      });

      const provider = new DefinitionProvider();
      provider.register(context);

      const docUri = "file:///test.twig";
      (context.documents.getDocument as ReturnType<typeof vi.fn>).mockReturnValue({ uri: docUri });
      (context.documents.getTree as ReturnType<typeof vi.fn>).mockReturnValue(tree);

      // Cursor on the string "hello" (column 15)
      const result = await onDefinitionHandler(makeDefinitionParams(docUri, 0, 15));
      expect(result).toBeNull();
    });

    it("returns null when cursor is on the include keyword", async () => {
      const templateContent = '{% include "partials/header.twig" %}';
      const tree = parseTestDocument(templateContent);
      const wsUri = pathToFileURL(tmpDir).toString();

      createFile("templates/partials/header.twig");

      const { context, onDefinitionHandler } = createMockContext({
        workspaceFolderUris: [wsUri],
      });

      const provider = new DefinitionProvider();
      provider.register(context);

      const docUri = "file:///test.twig";
      (context.documents.getDocument as ReturnType<typeof vi.fn>).mockReturnValue({ uri: docUri });
      (context.documents.getTree as ReturnType<typeof vi.fn>).mockReturnValue(tree);

      // Cursor on "include" keyword (column 5)
      const result = await onDefinitionHandler(makeDefinitionParams(docUri, 0, 5));
      expect(result).toBeNull();
    });

    it("returns null when document has no tree", async () => {
      const { context, onDefinitionHandler } = createMockContext({
        workspaceFolderUris: [pathToFileURL(tmpDir).toString()],
      });

      const provider = new DefinitionProvider();
      provider.register(context);

      const docUri = "file:///test.twig";
      (context.documents.getDocument as ReturnType<typeof vi.fn>).mockReturnValue({ uri: docUri });
      (context.documents.getTree as ReturnType<typeof vi.fn>).mockReturnValue(null);

      const result = await onDefinitionHandler(makeDefinitionParams(docUri, 0, 12));
      expect(result).toBeNull();
    });

    it("returns null when document is not found", async () => {
      const { context, onDefinitionHandler } = createMockContext({
        workspaceFolderUris: [pathToFileURL(tmpDir).toString()],
      });

      const provider = new DefinitionProvider();
      provider.register(context);

      (context.documents.getDocument as ReturnType<typeof vi.fn>).mockReturnValue(null);

      const result = await onDefinitionHandler(
        makeDefinitionParams("file:///nonexistent.twig", 0, 0)
      );
      expect(result).toBeNull();
    });
  });

  describe("path resolution", () => {
    it("resolves exact path with extension", async () => {
      const templateContent = '{% include "partials/header.twig" %}';
      const tree = parseTestDocument(templateContent);
      const wsUri = pathToFileURL(tmpDir).toString();

      const expectedPath = createFile("templates/partials/header.twig", "<h1>Header</h1>");

      const { context, onDefinitionHandler } = createMockContext({
        workspaceFolderUris: [wsUri],
      });

      const provider = new DefinitionProvider();
      provider.register(context);

      const docUri = "file:///test.twig";
      (context.documents.getDocument as ReturnType<typeof vi.fn>).mockReturnValue({ uri: docUri });
      (context.documents.getTree as ReturnType<typeof vi.fn>).mockReturnValue(tree);

      const result = await onDefinitionHandler(makeDefinitionParams(docUri, 0, 12));

      expect(result).not.toBeNull();
      expect(result!.uri).toBe(pathToFileURL(expectedPath).toString());
    });

    it("appends extension when path has no extension", async () => {
      const templateContent = '{% include "partials/header" %}';
      const tree = parseTestDocument(templateContent);
      const wsUri = pathToFileURL(tmpDir).toString();

      const expectedPath = createFile("templates/partials/header.twig", "<h1>Header</h1>");

      const { context, onDefinitionHandler } = createMockContext({
        workspaceFolderUris: [wsUri],
      });

      const provider = new DefinitionProvider();
      provider.register(context);

      const docUri = "file:///test.twig";
      (context.documents.getDocument as ReturnType<typeof vi.fn>).mockReturnValue({ uri: docUri });
      (context.documents.getTree as ReturnType<typeof vi.fn>).mockReturnValue(tree);

      const result = await onDefinitionHandler(makeDefinitionParams(docUri, 0, 12));

      expect(result).not.toBeNull();
      expect(result!.uri).toBe(pathToFileURL(expectedPath).toString());
    });

    it("handles single-quoted strings", async () => {
      const templateContent = "{% include 'partials/header.twig' %}";
      const tree = parseTestDocument(templateContent);
      const wsUri = pathToFileURL(tmpDir).toString();

      const expectedPath = createFile("templates/partials/header.twig");

      const { context, onDefinitionHandler } = createMockContext({
        workspaceFolderUris: [wsUri],
      });

      const provider = new DefinitionProvider();
      provider.register(context);

      const docUri = "file:///test.twig";
      (context.documents.getDocument as ReturnType<typeof vi.fn>).mockReturnValue({ uri: docUri });
      (context.documents.getTree as ReturnType<typeof vi.fn>).mockReturnValue(tree);

      const result = await onDefinitionHandler(makeDefinitionParams(docUri, 0, 12));

      expect(result).not.toBeNull();
      expect(result!.uri).toBe(pathToFileURL(expectedPath).toString());
    });

    it("returns null when file does not exist", async () => {
      const templateContent = '{% include "partials/nonexistent.twig" %}';
      const tree = parseTestDocument(templateContent);
      const wsUri = pathToFileURL(tmpDir).toString();

      const { context, onDefinitionHandler } = createMockContext({
        workspaceFolderUris: [wsUri],
      });

      const provider = new DefinitionProvider();
      provider.register(context);

      const docUri = "file:///test.twig";
      (context.documents.getDocument as ReturnType<typeof vi.fn>).mockReturnValue({ uri: docUri });
      (context.documents.getTree as ReturnType<typeof vi.fn>).mockReturnValue(tree);

      const result = await onDefinitionHandler(makeDefinitionParams(docUri, 0, 12));
      expect(result).toBeNull();
    });

    it("does not double-append extension when path already ends with it", async () => {
      const templateContent = '{% include "partials/header.twig" %}';
      const tree = parseTestDocument(templateContent);
      const wsUri = pathToFileURL(tmpDir).toString();

      // Only create the .twig file, NOT .twig.twig
      const expectedPath = createFile("templates/partials/header.twig");

      const { context, onDefinitionHandler } = createMockContext({
        workspaceFolderUris: [wsUri],
      });

      const provider = new DefinitionProvider();
      provider.register(context);

      const docUri = "file:///test.twig";
      (context.documents.getDocument as ReturnType<typeof vi.fn>).mockReturnValue({ uri: docUri });
      (context.documents.getTree as ReturnType<typeof vi.fn>).mockReturnValue(tree);

      const result = await onDefinitionHandler(makeDefinitionParams(docUri, 0, 12));

      // Should find exact match, never try .twig.twig
      expect(result).not.toBeNull();
      expect(result!.uri).toBe(pathToFileURL(expectedPath).toString());
    });

    it("uses custom file extension from config", async () => {
      const templateContent = '{% include "partials/header" %}';
      const tree = parseTestDocument(templateContent);
      const wsUri = pathToFileURL(tmpDir).toString();

      const expectedPath = createFile("templates/partials/header.html.twig");

      const { context, onDefinitionHandler } = createMockContext({
        workspaceFolderUris: [wsUri],
        configOverrides: { templates: { root: "templates", fileExtension: ".html.twig" } },
      });

      const provider = new DefinitionProvider();
      provider.register(context);

      const docUri = "file:///test.twig";
      (context.documents.getDocument as ReturnType<typeof vi.fn>).mockReturnValue({ uri: docUri });
      (context.documents.getTree as ReturnType<typeof vi.fn>).mockReturnValue(tree);

      const result = await onDefinitionHandler(makeDefinitionParams(docUri, 0, 12));

      expect(result).not.toBeNull();
      expect(result!.uri).toBe(pathToFileURL(expectedPath).toString());
    });

    it("uses custom template root from config", async () => {
      const templateContent = '{% include "partials/header.twig" %}';
      const tree = parseTestDocument(templateContent);
      const wsUri = pathToFileURL(tmpDir).toString();

      const expectedPath = createFile("views/partials/header.twig");

      const { context, onDefinitionHandler } = createMockContext({
        workspaceFolderUris: [wsUri],
        configOverrides: { templates: { root: "views", fileExtension: ".twig" } },
      });

      const provider = new DefinitionProvider();
      provider.register(context);

      const docUri = "file:///test.twig";
      (context.documents.getDocument as ReturnType<typeof vi.fn>).mockReturnValue({ uri: docUri });
      (context.documents.getTree as ReturnType<typeof vi.fn>).mockReturnValue(tree);

      const result = await onDefinitionHandler(makeDefinitionParams(docUri, 0, 12));

      expect(result).not.toBeNull();
      expect(result!.uri).toBe(pathToFileURL(expectedPath).toString());
    });
  });

  describe("workspace folder resolution", () => {
    it("resolves in single workspace folder", async () => {
      const templateContent = '{% include "header.twig" %}';
      const tree = parseTestDocument(templateContent);
      const wsUri = pathToFileURL(tmpDir).toString();

      const expectedPath = createFile("templates/header.twig");

      const { context, onDefinitionHandler } = createMockContext({
        workspaceFolderUris: [wsUri],
      });

      const provider = new DefinitionProvider();
      provider.register(context);

      const docUri = "file:///test.twig";
      (context.documents.getDocument as ReturnType<typeof vi.fn>).mockReturnValue({ uri: docUri });
      (context.documents.getTree as ReturnType<typeof vi.fn>).mockReturnValue(tree);

      const result = await onDefinitionHandler(makeDefinitionParams(docUri, 0, 12));

      expect(result).not.toBeNull();
      expect(result!.uri).toBe(pathToFileURL(expectedPath).toString());
    });

    it("uses first matching workspace folder when multiple exist", async () => {
      const secondDir = createTmpDir();

      try {
        const templateContent = '{% include "header.twig" %}';
        const tree = parseTestDocument(templateContent);

        // Create the file in the second folder only
        const secondFolderPath = path.join(secondDir, "templates/header.twig");
        fs.mkdirSync(path.dirname(secondFolderPath), { recursive: true });
        fs.writeFileSync(secondFolderPath, "");

        const ws1Uri = pathToFileURL(tmpDir).toString();
        const ws2Uri = pathToFileURL(secondDir).toString();

        const { context, onDefinitionHandler } = createMockContext({
          workspaceFolderUris: [ws1Uri, ws2Uri],
        });

        const provider = new DefinitionProvider();
        provider.register(context);

        const docUri = "file:///test.twig";
        (context.documents.getDocument as ReturnType<typeof vi.fn>).mockReturnValue({
          uri: docUri,
        });
        (context.documents.getTree as ReturnType<typeof vi.fn>).mockReturnValue(tree);

        const result = await onDefinitionHandler(makeDefinitionParams(docUri, 0, 12));

        // Should resolve to second folder (first one doesn't have the file)
        expect(result).not.toBeNull();
        expect(result!.uri).toBe(pathToFileURL(secondFolderPath).toString());
      } finally {
        cleanupTmpDir(secondDir);
      }
    });

    it("first match wins when file exists in multiple folders", async () => {
      const secondDir = createTmpDir();

      try {
        const templateContent = '{% include "header.twig" %}';
        const tree = parseTestDocument(templateContent);

        // Create the file in both folders
        const firstFolderPath = createFile("templates/header.twig", "first");
        const secondFolderPath = path.join(secondDir, "templates/header.twig");
        fs.mkdirSync(path.dirname(secondFolderPath), { recursive: true });
        fs.writeFileSync(secondFolderPath, "second");

        const ws1Uri = pathToFileURL(tmpDir).toString();
        const ws2Uri = pathToFileURL(secondDir).toString();

        const { context, onDefinitionHandler } = createMockContext({
          workspaceFolderUris: [ws1Uri, ws2Uri],
        });

        const provider = new DefinitionProvider();
        provider.register(context);

        const docUri = "file:///test.twig";
        (context.documents.getDocument as ReturnType<typeof vi.fn>).mockReturnValue({
          uri: docUri,
        });
        (context.documents.getTree as ReturnType<typeof vi.fn>).mockReturnValue(tree);

        const result = await onDefinitionHandler(makeDefinitionParams(docUri, 0, 12));

        // Should resolve to first folder (first match wins)
        expect(result).not.toBeNull();
        expect(result!.uri).toBe(pathToFileURL(firstFolderPath).toString());
      } finally {
        cleanupTmpDir(secondDir);
      }
    });

    it("returns null when no workspace folders are available", async () => {
      const templateContent = '{% include "header.twig" %}';
      const tree = parseTestDocument(templateContent);

      const { context, onDefinitionHandler } = createMockContext({
        workspaceFolderUris: [],
      });

      const provider = new DefinitionProvider();
      provider.register(context);

      const docUri = "file:///test.twig";
      (context.documents.getDocument as ReturnType<typeof vi.fn>).mockReturnValue({ uri: docUri });
      (context.documents.getTree as ReturnType<typeof vi.fn>).mockReturnValue(tree);

      const result = await onDefinitionHandler(makeDefinitionParams(docUri, 0, 12));
      expect(result).toBeNull();
    });
  });
});
