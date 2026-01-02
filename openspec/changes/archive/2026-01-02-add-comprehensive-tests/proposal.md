# Change: Add comprehensive tests for all implemented features

## Why
The project has established VS Code extension testing infrastructure (`extension-testing` spec) with basic activation tests, but there are no unit tests for the language server's core functionality: context detection, completion generation, semantic token generation, and Tree-sitter parsing utilities. Adding comprehensive tests ensures behavior matches specifications and prevents regressions.

## What Changes
- Add Vitest as the unit testing framework for the language server package
- Create unit tests for completion context detection (`completions.ts`)
- Create unit tests for completion generation for all Twig contexts (block, output, filter)
- Create unit tests for semantic token generation (`semantic-tokens.ts`)
- Create unit tests for parser utilities (`parser.ts`)
- Add additional VS Code extension integration tests for completion and semantic token features

## Impact
- Affected specs: `extension-testing` (adding new requirements for feature coverage)
- Affected code:
  - `packages/language-server/` (new test files, package.json updates)
  - `packages/vscode/test/` (additional integration tests)
  - Root `package.json` (potential shared test configuration)
