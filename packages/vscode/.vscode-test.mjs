import { defineConfig } from "@vscode/test-cli";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  files: "out/test/**/*.test.js",
  extensionDevelopmentPath: __dirname,
  workspaceFolder: path.join(__dirname, "test", "fixtures"),
  mocha: {
    ui: "tdd",
    timeout: 20000,
  },
});
