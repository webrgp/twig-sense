# Change: Refactor Test Infrastructure

## Why

Parser initialization is duplicated across test files, leading to slower tests and maintenance burden. There's no shared test utilities for common patterns like creating test documents or setting up the parser.

## What Changes

- Create shared test utilities in `src/__tests__/utils/`
- Create `parser-setup.ts` with singleton parser initialization
- Create `document-factory.ts` for test document creation
- Add Vitest setup file for global parser initialization
- Add provider-specific test files
- Update vitest.config.ts to use setup file

## Impact

- Affected specs: `extension-testing`
- Affected code:
  - New: `packages/language-server/src/__tests__/utils/` directory
  - New: `packages/language-server/src/__tests__/setup.ts`
  - Updated: `packages/language-server/vitest.config.ts`
  - Existing test files updated to use shared utilities
