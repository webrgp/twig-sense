# Design: Comprehensive Testing Architecture

## Context
The project has two test environments:
1. **VS Code Extension Tests** - Run in Extension Host using `@vscode/test-cli` and Mocha (TDD UI)
2. **Language Server Unit Tests** - Need a standalone test runner that can test pure TypeScript functions without VS Code

The `project.md` specifies Vitest as the testing framework. Language server functions like `detectContext`, `getCompletions`, and `generateSemanticTokens` are pure functions that can be unit tested without VS Code.

## Goals
- Enable fast unit testing of language server core logic
- Maintain existing VS Code extension integration tests
- Achieve meaningful coverage of specification scenarios
- Keep test setup minimal and consistent with project conventions

## Non-Goals
- Full end-to-end testing of the LSP protocol communication
- Performance benchmarking
- Snapshot testing for semantic tokens (prefer explicit assertions)

## Decisions

### Decision: Use Vitest for language server unit tests
**Rationale**: Vitest is specified in `project.md`, provides fast execution, native ESM support, and TypeScript support out of the box. It integrates well with the existing monorepo structure.
**Alternatives considered**:
- Jest: Slower, requires more configuration for ESM/TypeScript
- Mocha: Already used in VS Code tests, but Vitest is more modern and faster for unit tests

### Decision: Test semantic tokens with mock Tree-sitter trees
**Rationale**: The `generateSemanticTokens` function takes a Tree object from web-tree-sitter. We can create minimal mock trees or parse real Twig snippets to test token generation without mocking the entire parser.
**Trade-off**: Requires parser to be available in tests, but this provides more realistic test scenarios.

### Decision: Export internal functions for testing
**Rationale**: Functions like `detectContext` and `getCompletions` are already exported from `completions.ts`. For semantic tokens, `getTokenType` and `encodeTokens` are internal but can remain internal since testing `generateSemanticTokens` end-to-end is sufficient.

### Decision: Keep VS Code integration tests focused on activation and basic features
**Rationale**: VS Code tests are slower (require launching Extension Host). Unit tests cover detailed logic; integration tests verify the extension works as a whole.

## Test File Structure

```
packages/language-server/
├── src/
│   ├── __tests__/
│   │   ├── completions.test.ts
│   │   ├── semantic-tokens.test.ts
│   │   └── parser.test.ts
│   ├── completions.ts
│   ├── semantic-tokens.ts
│   └── parser.ts
├── vitest.config.ts
└── package.json

packages/vscode/
└── test/
    ├── suite/
    │   └── extension.test.ts  (existing + additions)
    └── fixtures/
        └── sample.twig        (existing)
```

## Risks / Trade-offs

### Risk: Tree-sitter WASM loading in tests
**Mitigation**: Ensure Vitest can load WASM modules. May need to configure `vitest.config.ts` with appropriate settings or use a test setup file to initialize the parser once.

### Risk: Test brittleness with completion items
**Mitigation**: Test for presence of key completions rather than exact arrays. Check that completion counts are reasonable ranges rather than exact numbers.

## Open Questions
- None at this time. The testing approach is straightforward.
