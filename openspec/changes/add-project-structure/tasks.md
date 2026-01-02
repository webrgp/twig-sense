# Tasks: Add Project Structure

Based on [vscode-generator-code](https://github.com/Microsoft/vscode-generator-code) templates, adapted for monorepo.

## 1. Monorepo Foundation
- [x] 1.1 Create root `package.json` with npm workspaces configuration
- [x] 1.2 Create `tsconfig.base.json` with shared TypeScript settings (module: Node16, target: ES2022, strict: true)
- [x] 1.3 Create `eslint.config.mjs` with flat config format (per official generator)
- [x] 1.4 Create `.prettierrc` with formatting preferences
- [x] 1.5 Create `.gitignore` with Node.js and build artifact patterns
- [x] 1.6 Create `.vscode/launch.json` for debugging extension and server
- [x] 1.7 Create `.vscode/tasks.json` for build tasks
- [x] 1.8 Create `.vscode/extensions.json` with recommended extensions
- [x] 1.9 Create `LICENSE` (MIT)
- [x] 1.10 Create root `README.md` with project overview

## 2. Language Server Package
- [x] 2.1 Create `packages/language-server/package.json` with LSP dependencies
- [x] 2.2 Create `packages/language-server/tsconfig.json` extending base
- [x] 2.3 Create `packages/language-server/src/index.ts` entry point
- [x] 2.4 Create `packages/language-server/src/server.ts` with LSP connection setup
- [x] 2.5 Register semantic tokens capability in server initialization
- [x] 2.6 Configure esbuild for language server bundling

## 3. Tree-sitter Grammar Package
- [x] 3.1 Create `packages/tree-sitter-twig/package.json` with tree-sitter-cli
- [x] 3.2 Create `packages/tree-sitter-twig/grammar.js` with minimal Twig grammar
- [x] 3.3 Create `packages/tree-sitter-twig/corpus/` test directory
- [x] 3.4 Add build script to generate parser and WASM
- [x] 3.5 Verify grammar compiles without errors

## 4. VSCode Extension Package
- [x] 4.1 Create `packages/vscode/package.json` with extension manifest (publisher: twig-sense, vscode: ^1.100.0, activationEvents: onLanguage:twig)
- [x] 4.2 Create `packages/vscode/tsconfig.json` extending base
- [x] 4.3 Create `packages/vscode/src/extension.ts` with LSP client setup
- [x] 4.4 Create `packages/vscode/syntaxes/twig.tmLanguage.json` TextMate grammar
- [x] 4.5 Create `packages/vscode/languages/twig.configuration.json` language config
- [x] 4.6 Add `twig-sense.semanticTokens.enabled` setting (default: true)
- [x] 4.7 Create `packages/vscode/esbuild.js` build script (bundle WASM with extension)
- [x] 4.8 Create `packages/vscode/.vscodeignore` for package exclusions
- [x] 4.9 Create `packages/vscode/.vscode-test.mjs` for test configuration
- [x] 4.10 Add `@vscode/test-cli` and `@vscode/test-electron` devDependencies
- [x] 4.11 Add `vsce` package script for building VSIX
- [x] 4.12 Create `packages/vscode/README.md` (shown on marketplace)

## 5. Integration & Validation
- [x] 5.1 Run `npm install` and verify dependency resolution
- [x] 5.2 Run `npm run build` and verify all packages build
- [ ] 5.3 Launch extension in Extension Development Host (F5)
- [ ] 5.4 Verify `.twig` files get syntax highlighting
- [ ] 5.5 Verify language server starts (check Output panel)
- [ ] 5.6 Verify semantic tokens are registered (check Developer Tools)

## Dependencies
- Tasks 2.x, 3.x, and 4.x can be done in parallel after 1.x
- Task 5.x requires all previous tasks complete
