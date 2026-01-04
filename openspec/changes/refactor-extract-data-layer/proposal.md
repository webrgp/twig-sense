# Change: Extract Static Data Layer

## Why

The `completions.ts` file (1318 lines) and `completion-docs.ts` file (2189 lines) are too large and mix static data definitions with logic. This makes it difficult to add new completions, find specific items, and maintain documentation consistency.

## What Changes

- Extract `TWIG_KEYWORDS` array to `src/data/keywords.ts`
- Extract `TWIG_FILTERS` array to `src/data/filters.ts`
- Extract `TWIG_FUNCTIONS` array to `src/data/functions.ts`
- Extract `TWIG_TESTS` array to `src/data/tests.ts`
- Extract `LOOP_VARIABLE_COMPLETIONS` array to `src/data/loop-variables.ts`
- Co-locate documentation with data definitions (items + docs in same file)
- Create `src/data/index.ts` barrel export
- Reduce `completions.ts` to ~400-500 lines of pure orchestration logic

## Impact

- Affected specs: `language-server`
- Affected code:
  - `packages/language-server/src/completions.ts` (major refactor)
  - `packages/language-server/src/completion-docs.ts` (to be removed/split)
  - New: `packages/language-server/src/data/` directory with 6 files
