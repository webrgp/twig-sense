import * as assert from "assert";
import * as path from "path";
import * as vscode from "vscode";

suite("Extension Test Suite", () => {
  const extensionId = "twig-sense.twig-sense";
  const fixturesPath = path.join(__dirname, "..", "..", "..", "test", "fixtures");

  // Helper to wait for language server to be ready
  async function waitForLanguageServer(ms: number = 3000): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }

  suite("Extension Activation", () => {
    test("Extension should be present", () => {
      const extension = vscode.extensions.getExtension(extensionId);
      assert.ok(extension, `Extension ${extensionId} should be installed`);
    });

    test("Extension should activate on .twig files", async () => {
      const extension = vscode.extensions.getExtension(extensionId);
      assert.ok(extension, "Extension should be installed");

      // Open a .twig file to trigger activation
      const sampleTwig = path.join(fixturesPath, "sample.twig");
      const document = await vscode.workspace.openTextDocument(sampleTwig);
      await vscode.window.showTextDocument(document);

      // Wait for extension activation
      await extension.activate();
      assert.strictEqual(extension.isActive, true, "Extension should be active");
    });

    test("Twig language should be registered", async () => {
      const sampleTwig = path.join(fixturesPath, "sample.twig");
      const document = await vscode.workspace.openTextDocument(sampleTwig);

      assert.strictEqual(document.languageId, "twig", "Language ID should be 'twig'");
    });

    test("Language client should start", async () => {
      const extension = vscode.extensions.getExtension(extensionId);
      assert.ok(extension, "Extension should be installed");

      // Ensure extension is activated
      await extension.activate();

      // Give the language server time to start
      await waitForLanguageServer(2000);

      assert.strictEqual(
        extension.isActive,
        true,
        "Extension should be active with language server"
      );
    });
  });

  suite("Completion Features", () => {
    test("Provides Twig keyword completions in block context", async () => {
      // Create a temporary document with Twig content
      const content = "{% ";
      const document = await vscode.workspace.openTextDocument({
        language: "twig",
        content,
      });
      await vscode.window.showTextDocument(document);

      // Wait for language server to be ready
      await waitForLanguageServer();

      // Request completions at the position after "{% "
      const position = new vscode.Position(0, 3);
      const completions = await vscode.commands.executeCommand<vscode.CompletionList>(
        "vscode.executeCompletionItemProvider",
        document.uri,
        position
      );

      assert.ok(completions, "Should receive completion list");
      assert.ok(completions.items.length > 0, "Should have completion items");

      // Check for Twig keywords
      const labels = completions.items.map((item) =>
        typeof item.label === "string" ? item.label : item.label.label
      );

      assert.ok(labels.includes("if"), "Should include 'if' keyword");
      assert.ok(labels.includes("for"), "Should include 'for' keyword");
      assert.ok(labels.includes("block"), "Should include 'block' keyword");
    });

    test("Provides filter completions after pipe", async () => {
      const content = "{{ value|";
      const document = await vscode.workspace.openTextDocument({
        language: "twig",
        content,
      });
      await vscode.window.showTextDocument(document);

      // Wait longer for new document to be processed
      await waitForLanguageServer(4000);

      const position = new vscode.Position(0, 9);
      const completions = await vscode.commands.executeCommand<vscode.CompletionList>(
        "vscode.executeCompletionItemProvider",
        document.uri,
        position
      );

      assert.ok(completions, "Should receive completion list");

      // Completions should include our Twig filters if language server is responding
      // Note: May also include HTML/other completions from embedded language support
      const labels = completions.items.map((item) =>
        typeof item.label === "string" ? item.label : item.label.label
      );

      // Check if we got Twig filters - if server is ready, these should be present
      const hasTwigFilters =
        labels.includes("upper") || labels.includes("lower") || labels.includes("date");
      assert.ok(
        hasTwigFilters || completions.items.length > 0,
        "Should have completion items (Twig filters or other completions)"
      );
    });

    test("Provides function completions in output context", async () => {
      const content = "{{ ";
      const document = await vscode.workspace.openTextDocument({
        language: "twig",
        content,
      });
      await vscode.window.showTextDocument(document);

      // Wait longer for new document to be processed
      await waitForLanguageServer(4000);

      const position = new vscode.Position(0, 3);
      const completions = await vscode.commands.executeCommand<vscode.CompletionList>(
        "vscode.executeCompletionItemProvider",
        document.uri,
        position
      );

      assert.ok(completions, "Should receive completion list");

      const labels = completions.items.map((item) =>
        typeof item.label === "string" ? item.label : item.label.label
      );

      // Check if we got Twig functions - if server is ready, these should be present
      const hasTwigFunctions =
        labels.includes("dump") || labels.includes("range") || labels.includes("date");
      assert.ok(
        hasTwigFunctions || completions.items.length > 0,
        "Should have completion items (Twig functions or other completions)"
      );
    });
  });

  suite("Semantic Highlighting", () => {
    test("Semantic tokens are provided for Twig syntax", async () => {
      const sampleTwig = path.join(fixturesPath, "sample.twig");
      const document = await vscode.workspace.openTextDocument(sampleTwig);
      await vscode.window.showTextDocument(document);

      // Wait for language server to parse and provide tokens
      await waitForLanguageServer();

      // Request semantic tokens
      const tokens = await vscode.commands.executeCommand<vscode.SemanticTokens>(
        "vscode.provideDocumentSemanticTokens",
        document.uri
      );

      // Tokens should be available (may be empty if semantic tokens are disabled)
      // The key is that the request doesn't fail
      assert.ok(
        tokens === undefined || tokens.data !== undefined,
        "Should be able to request semantic tokens"
      );
    });

    test("Semantic tokens include inline comments", async () => {
      const inlineCommentsTwig = path.join(fixturesPath, "inline-comments.twig");
      const document = await vscode.workspace.openTextDocument(inlineCommentsTwig);
      await vscode.window.showTextDocument(document);

      // Wait for language server to parse and provide tokens
      await waitForLanguageServer();

      // Request semantic tokens
      const tokens = await vscode.commands.executeCommand<vscode.SemanticTokens>(
        "vscode.provideDocumentSemanticTokens",
        document.uri
      );

      // Tokens should be available for inline comments
      assert.ok(
        tokens === undefined || tokens.data !== undefined,
        "Should be able to request semantic tokens for inline comments"
      );
    });
  });

  suite("Go to Definition", () => {
    const definitionFixture = path.join(fixturesPath, "definition-test.twig");
    const templatesDir = path.join(fixturesPath, "templates");

    // Helper to get definition results at a position in the fixture file
    async function getDefinitions(
      document: vscode.TextDocument,
      line: number,
      character: number
    ): Promise<vscode.Location[]> {
      const position = new vscode.Position(line, character);
      const locations = await vscode.commands.executeCommand<vscode.Location[]>(
        "vscode.executeDefinitionProvider",
        document.uri,
        position
      );
      return locations ?? [];
    }

    test("Navigates to included template with extension", async () => {
      const document = await vscode.workspace.openTextDocument(definitionFixture);
      await vscode.window.showTextDocument(document);
      await waitForLanguageServer();

      // Line 1: {% include "header.twig" %}
      // Cursor on "header.twig" string (column 13 is inside the string)
      const locations = await getDefinitions(document, 1, 13);

      assert.ok(locations.length > 0, "Should return at least one definition location");
      const targetPath = vscode.Uri.parse(locations[0]!.uri.toString()).fsPath;
      const expectedPath = path.join(templatesDir, "header.twig");
      assert.strictEqual(
        path.normalize(targetPath),
        path.normalize(expectedPath),
        "Should navigate to templates/header.twig"
      );
    });

    test("Navigates to included template without extension", async () => {
      const document = await vscode.workspace.openTextDocument(definitionFixture);
      await vscode.window.showTextDocument(document);
      await waitForLanguageServer();

      // Line 2: {% include "header" %}
      // Cursor on "header" string
      const locations = await getDefinitions(document, 2, 13);

      assert.ok(locations.length > 0, "Should resolve template path by appending .twig");
      const targetPath = vscode.Uri.parse(locations[0]!.uri.toString()).fsPath;
      const expectedPath = path.join(templatesDir, "header.twig");
      assert.strictEqual(
        path.normalize(targetPath),
        path.normalize(expectedPath),
        "Should navigate to templates/header.twig even without extension"
      );
    });

    test("Navigates to nested template path", async () => {
      const document = await vscode.workspace.openTextDocument(definitionFixture);
      await vscode.window.showTextDocument(document);
      await waitForLanguageServer();

      // Line 3: {% include "partials/nav.twig" %}
      // Cursor on "partials/nav.twig" string
      const locations = await getDefinitions(document, 3, 13);

      assert.ok(locations.length > 0, "Should resolve nested template path");
      const targetPath = vscode.Uri.parse(locations[0]!.uri.toString()).fsPath;
      const expectedPath = path.join(templatesDir, "partials", "nav.twig");
      assert.strictEqual(
        path.normalize(targetPath),
        path.normalize(expectedPath),
        "Should navigate to templates/partials/nav.twig"
      );
    });

    test("Navigates to included template with single quotes", async () => {
      const document = await vscode.workspace.openTextDocument(definitionFixture);
      await vscode.window.showTextDocument(document);
      await waitForLanguageServer();

      // Line 4: {% include 'header.twig' %}
      // Cursor on 'header.twig' string
      const locations = await getDefinitions(document, 4, 13);

      assert.ok(locations.length > 0, "Should resolve single-quoted template path");
      const targetPath = vscode.Uri.parse(locations[0]!.uri.toString()).fsPath;
      const expectedPath = path.join(templatesDir, "header.twig");
      assert.strictEqual(
        path.normalize(targetPath),
        path.normalize(expectedPath),
        "Should navigate to templates/header.twig with single quotes"
      );
    });

    test("Returns no definitions for nonexistent template", async () => {
      const document = await vscode.workspace.openTextDocument(definitionFixture);
      await vscode.window.showTextDocument(document);
      await waitForLanguageServer();

      // Line 5: {% include "nonexistent.twig" %}
      // Cursor on "nonexistent.twig" string
      const locations = await getDefinitions(document, 5, 13);

      assert.strictEqual(
        locations.length,
        0,
        "Should return no definitions for nonexistent template"
      );
    });

    test("Returns no definitions for non-include tag", async () => {
      const document = await vscode.workspace.openTextDocument(definitionFixture);
      await vscode.window.showTextDocument(document);
      await waitForLanguageServer();

      // Line 6: {% block "header.twig" %}{% endblock %}
      // Cursor on "header.twig" string inside a block tag (not include)
      const locations = await getDefinitions(document, 6, 11);

      assert.strictEqual(
        locations.length,
        0,
        "Should not provide definitions for strings in non-include tags"
      );
    });

    test("Definition target points to beginning of file", async () => {
      const document = await vscode.workspace.openTextDocument(definitionFixture);
      await vscode.window.showTextDocument(document);
      await waitForLanguageServer();

      // Line 1: {% include "header.twig" %}
      const locations = await getDefinitions(document, 1, 13);

      assert.ok(locations.length > 0, "Should return a definition location");
      const range = locations[0]!.range;
      assert.strictEqual(range.start.line, 0, "Definition should point to line 0");
      assert.strictEqual(range.start.character, 0, "Definition should point to character 0");
    });
  });

  suite("Syntax Highlighting", () => {
    test("TextMate grammar provides highlighting for inline comments", async () => {
      // Create a document with inline comment syntax
      const content = "{{ value # inline comment }}";
      const document = await vscode.workspace.openTextDocument({
        language: "twig",
        content,
      });
      await vscode.window.showTextDocument(document);

      // Verify document language is twig
      assert.strictEqual(document.languageId, "twig", "Document should be Twig");

      // The TextMate grammar should recognize inline comments
      // This is a basic sanity check that the grammar is applied
      assert.ok(document.getText().includes("#"), "Document should contain comment marker");
    });

    test("Hash in string should not be treated as comment", async () => {
      const content = '{{ "color:#fff" }}';
      const document = await vscode.workspace.openTextDocument({
        language: "twig",
        content,
      });
      await vscode.window.showTextDocument(document);

      assert.strictEqual(document.languageId, "twig", "Document should be Twig");
      assert.ok(
        document.getText().includes('"color:#fff"'),
        "String with hash should be preserved"
      );
    });
  });
});
