# Change: Add Typed Configuration Interface

## Why

Configuration is accessed with untyped dynamic property access (`config.diagnostics?.enabled`), making it error-prone and difficult to maintain. There's no single source of truth for available configuration options or their default values.

## What Changes

- Create `src/types/config.ts` with `TwigSenseConfig` interface
- Define `DEFAULT_CONFIG` constant with all default values
- Add `mergeWithDefaults()` function for safe configuration access
- Update all configuration access points to use typed interface
- Eliminate optional chaining when accessing known config properties

## Impact

- Affected specs: `language-server`
- Affected code:
  - New: `packages/language-server/src/types/config.ts`
  - `packages/language-server/src/server.ts` (configuration handling)
  - All files accessing workspace configuration
