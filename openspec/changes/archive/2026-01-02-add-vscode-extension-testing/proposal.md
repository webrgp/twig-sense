# Proposal: Add VS Code Extension Testing

## Summary
Integrate the official `@vscode/test-cli` tool to enable automated testing of the VS Code extension. This establishes a proper test infrastructure for integration testing extension features like activation, language server communication, semantic tokens, and completions.

## Motivation
The project's testing strategy (documented in `openspec/project.md`) specifies:
- Unit tests for parsing and completion logic
- Integration tests for LSP communication
- End-to-end tests for VSCode extension features

Currently, while `@vscode/test-cli` and `@vscode/test-electron` are installed and a basic `.vscode-test.mjs` exists, there are no actual test files or proper test infrastructure in place. This change establishes the foundation for VS Code extension testing.

## Scope

### In Scope
- Configure `@vscode/test-cli` with proper settings for the monorepo
- Create test directory structure and TypeScript compilation for tests
- Add test fixtures (sample `.twig` files) for consistent test scenarios
- Establish example tests for extension activation and basic features
- Update debug configuration and npm scripts for test workflow

### Out of Scope
- Unit tests for language server (separate testing concern)
- Tree-sitter grammar tests (already handled by `tree-sitter test`)
- CI/CD pipeline integration (future work)
- Code coverage reporting (future enhancement)

## Approach
Use the official VS Code testing approach with `@vscode/test-cli` which:
1. Downloads and manages VS Code test instances
2. Runs tests in a real VS Code Extension Host environment
3. Provides Mocha-based test framework
4. Supports headless CI execution

The tests will compile separately from the main extension bundle (to `out/` directory) to keep the production `dist/` bundle clean.

## Success Criteria
1. `npm run test` in `packages/vscode` executes the test suite
2. Tests run in a real VS Code Extension Host environment
3. F5 debugging of tests works via the existing "Extension Tests" launch config
4. Example tests pass demonstrating extension activation

## Spec Deltas
- `specs/extension-testing/spec.md` - New capability defining extension testing requirements
