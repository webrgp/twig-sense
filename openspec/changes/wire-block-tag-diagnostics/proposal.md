## Why

The core block tag analysis in `document-analyzer.ts` now produces rich structural data (unclosed tags, orphan closers, nesting anomalies, misplaced mid-block keywords) but this data is not yet exposed to users. This change creates the thin LSP translation layer that maps analysis results to `Diagnostic[]` objects, adds the configuration toggle, and wires everything into the `DiagnosticsProvider` so users see warnings in their editor.

## What Changes

- Create `validators/block-tags.ts` with a `validateBlockTags(tree): Diagnostic[]` function that calls the extended `extractScopedBlocks()` and maps the `TagAnalysisResult` diagnostics to LSP `Diagnostic[]` objects (all at Warning severity, source `"twig-sense"`)
- Add `blockTags: boolean` to `TwigSenseConfig.diagnostics` in `types/config.ts` (default: `true`)
- Update `mergeWithDefaults` to include `blockTags` with default value
- Add `twig-sense.diagnostics.blockTags` to `packages/vscode/package.json` configuration schema
- Wire the new validator into `DiagnosticsProvider` with a `config.diagnostics.blockTags` guard
- Tests for diagnostic output, configuration toggles, and master switch interaction

## Capabilities

### New Capabilities

_(none — the `block-tag-diagnostics` capability spec was created in the previous change)_

### Modified Capabilities

- `language-server`: Adding new diagnostic validation requirements — block tag diagnostics configuration (`diagnostics.blockTags` property), diagnostic lifecycle for block tag warnings, master switch interaction

## Impact

- `packages/language-server/src/validators/block-tags.ts` — New file (thin LSP mapping layer)
- `packages/language-server/src/providers/diagnostics-provider.ts` — Wire new validator
- `packages/language-server/src/types/config.ts` — New `blockTags` config property + merge logic
- `packages/vscode/package.json` — New `twig-sense.diagnostics.blockTags` configuration schema entry
- New test file for block tag diagnostic output and configuration
- `config.test.ts` — Update for new `blockTags` config property
