# Tasks: Add Project Structure

Based on [vscode-generator-code](https://github.com/Microsoft/vscode-generator-code) templates, adapted for monorepo.

## 1. Monorepo Foundation
- [ ] 1.1 Create root `package.json` with npm workspaces configuration
- [ ] 1.2 Create `tsconfig.base.json` with shared TypeScript settings (module: Node16, target: ES2022, strict: true)
- [ ] 1.3 Create `eslint.config.mjs` with flat config format (per official generator)
- [ ] 1.4 Create `.prettierrc` with formatting preferences
- [ ] 1.5 Create `.gitignore` with Node.js and build artifact patterns
- [ ] 1.6 Create `.vscode/launch.json` for debugging extension and server
- [ ] 1.7 Create `.vscode/tasks.json` for build tasks
- [ ] 1.8 Create `.vscode/extensions.json` with recommended extensions
- [ ] 1.9 Create `LICENSE` (MIT)
- [ ] 1.10 Create root `README.md` with project overview

## 2. Language Server Package
- [ ] 2.1 Create `packages/language-server/package.json` with LSP dependencies
- [ ] 2.2 Create `packages/language-server/tsconfig.json` extending base
- [ ] 2.3 Create `packages/language-server/src/index.ts` entry point
- [ ] 2.4 Create `packages/language-server/src/server.ts` with LSP connection setup
- [ ] 2.5 Register semantic tokens capability in server initialization
- [ ] 2.6 Configure esbuild for language server bundling

## 3. Tree-sitter Grammar Package
- [ ] 3.1 Create `packages/tree-sitter-twig/package.json` with tree-sitter-cli
- [ ] 3.2 Create `packages/tree-sitter-twig/grammar.js` with minimal Twig grammar
- [ ] 3.3 Create `packages/tree-sitter-twig/corpus/` test directory
- [ ] 3.4 Add build script to generate parser and WASM
- [ ] 3.5 Verify grammar compiles without errors

## 4. VSCode Extension Package
- [ ] 4.1 Create `packages/vscode/package.json` with extension manifest (publisher: twig-sense, vscode: ^1.100.0, activationEvents: onLanguage:twig)
- [ ] 4.2 Create `packages/vscode/tsconfig.json` extending base
- [ ] 4.3 Create `packages/vscode/src/extension.ts` with LSP client setup
- [ ] 4.4 Create `packages/vscode/syntaxes/twig.tmLanguage.json` TextMate grammar
- [ ] 4.5 Create `packages/vscode/languages/twig.configuration.json` language config
- [ ] 4.6 Add `twig-sense.semanticTokens.enabled` setting (default: true)
- [ ] 4.7 Create `packages/vscode/esbuild.js` build script (bundle WASM with extension)
- [ ] 4.8 Create `packages/vscode/.vscodeignore` for package exclusions
- [ ] 4.9 Create `packages/vscode/.vscode-test.mjs` for test configuration
- [ ] 4.10 Add `@vscode/test-cli` and `@vscode/test-electron` devDependencies
- [ ] 4.11 Add `vsce` package script for building VSIX
- [ ] 4.12 Create `packages/vscode/README.md` (shown on marketplace)

## 5. Integration & Validation
- [ ] 5.1 Run `npm install` and verify dependency resolution
- [ ] 5.2 Run `npm run build` and verify all packages build
- [ ] 5.3 Launch extension in Extension Development Host (F5)
- [ ] 5.4 Verify `.twig` files get syntax highlighting
- [ ] 5.5 Verify language server starts (check Output panel)
- [ ] 5.6 Verify semantic tokens are registered (check Developer Tools)

## Dependencies
- Tasks 2.x, 3.x, and 4.x can be done in parallel after 1.x
- Task 5.x requires all previous tasks complete
