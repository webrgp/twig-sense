# Change: Refactor to Provider Architecture

## Why

Adding new LSP features requires editing `server.ts` in multiple places, leading to a monolithic file that's hard to maintain. There's no clear pattern for implementing new features, making onboarding difficult.

## What Changes

- Create `FeatureProvider` interface defining contract for all LSP features
- Create `ProviderRegistry` for automatic capability aggregation and handler registration
- Extract `DocumentManager` class for document lifecycle management
- Convert existing features to providers:
  - `CompletionProvider`
  - `SemanticTokensProvider`
  - `DiagnosticsProvider`
- Refactor `server.ts` to use registry pattern (~100 lines instead of 300+)

## Impact

- Affected specs: `language-server`
- Affected code:
  - `packages/language-server/src/server.ts` (major simplification)
  - New: `packages/language-server/src/providers/` directory
  - New: `packages/language-server/src/document-manager.ts`
  - `packages/language-server/src/completions.ts` (wrapped by provider)
  - `packages/language-server/src/semantic-tokens.ts` (wrapped by provider)
