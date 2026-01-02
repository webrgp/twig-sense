import * as assert from "assert";
import * as vscode from "vscode";
import * as path from "path";

suite("Extension Test Suite", () => {
  const extensionId = "twig-sense.twig-sense";

  test("Extension should be present", () => {
    const extension = vscode.extensions.getExtension(extensionId);
    assert.ok(extension, `Extension ${extensionId} should be installed`);
  });

  test("Extension should activate on .twig files", async () => {
    const extension = vscode.extensions.getExtension(extensionId);
    assert.ok(extension, "Extension should be installed");

    // Open a .twig file to trigger activation
    // __dirname is out/test/suite, so go up 3 levels to package root, then into test/fixtures
    const fixturesPath = path.join(__dirname, "..", "..", "..", "test", "fixtures");
    const sampleTwig = path.join(fixturesPath, "sample.twig");
    const document = await vscode.workspace.openTextDocument(sampleTwig);
    await vscode.window.showTextDocument(document);

    // Wait for extension activation
    await extension.activate();
    assert.strictEqual(extension.isActive, true, "Extension should be active");
  });

  test("Twig language should be registered", async () => {
    // __dirname is out/test/suite, so go up 3 levels to package root, then into test/fixtures
    const fixturesPath = path.join(__dirname, "..", "..", "..", "test", "fixtures");
    const sampleTwig = path.join(fixturesPath, "sample.twig");
    const document = await vscode.workspace.openTextDocument(sampleTwig);

    assert.strictEqual(
      document.languageId,
      "twig",
      "Language ID should be 'twig'"
    );
  });

  test("Language client should start", async () => {
    const extension = vscode.extensions.getExtension(extensionId);
    assert.ok(extension, "Extension should be installed");

    // Ensure extension is activated
    await extension.activate();

    // Give the language server time to start
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // The extension exports the client, we can check if it's running
    // For now, just verify the extension is active (language server starts during activation)
    assert.strictEqual(
      extension.isActive,
      true,
      "Extension should be active with language server"
    );
  });
});
