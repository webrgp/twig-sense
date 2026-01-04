# Change: Refactor Completion System with Strategy Pattern

## Why

The `getCompletions()` function has a large switch-like structure with context detection and completion logic interleaved. This makes it hard to understand what completions are available in each context and difficult to modify context-specific behavior.

## What Changes

- Extract context detection to dedicated `src/context/twig-context.ts` module
- Create `CompletionStrategy` interface for context-specific completion logic
- Implement strategies:
  - `BlockContextStrategy` (for `{% %}` context)
  - `OutputContextStrategy` (for `{{ }}` context)
  - `FilterContextStrategy` (for after `|` character)
- Refactor `completions.ts` to orchestrate strategies
- Move dynamic completion helpers to `src/completions/dynamic-completions.ts`

## Impact

- Affected specs: `language-server`
- Affected code:
  - `packages/language-server/src/completions.ts` (major refactor)
  - New: `packages/language-server/src/context/twig-context.ts`
  - New: `packages/language-server/src/completions/strategies/` directory
  - New: `packages/language-server/src/completions/dynamic-completions.ts`
