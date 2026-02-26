## Why

The language server's `extractScopedBlocks()` in `document-analyzer.ts` performs stack-based pairing of Twig block tags for scope detection, but currently discards all structural error information — unclosed blocks get a fallback endLine, orphan closers are silently ignored, and no diagnostic data is produced. Additionally, the function has a pre-existing bug: it pushes ALL `{% set %}` keywords to the stack unconditionally, treating inline `{% set x = 1 %}` as block-form. This is invisible today (the fallback endLine masks it), but must be fixed before any diagnostic output is wired, as it would produce false "Unclosed {% set %}" warnings on every inline set statement.

This change refactors the core analysis function to produce rich structural data (unclosed tags, orphan closers, nesting anomalies, misplaced mid-block keywords) without yet connecting it to LSP diagnostics. This separation ensures the analysis logic is independently testable and the inline set bug is resolved before diagnostic output is exposed.

## What Changes

- Add new interfaces: `TagLocation`, `NestingError`, `MisplacedKeyword`, `TagAnalysisResult`
- Add `with`/`endwith` to the `BLOCK_PAIRS` map and `"with"` to the `BlockType` union (requires the `add-endwith-grammar-keyword` change to be applied first)
- Add `MID_BLOCK_RULES` map for `else` and `elseif` validation
- Refactor `extractScopedBlocks()` return type from `ScopedBlockInfo[]` to `TagAnalysisResult` (containing both `scopedBlocks` and diagnostic data)
- Add inline `set` heuristic: check for `operator("=")` in statement_block children, skip stack push if present
- Add orphan closer tracking (limited to known `BLOCK_PAIRS` values only)
- Add cross-nesting anomaly tracking (when a splice skips over intermediate open blocks)
- Add mid-block keyword validation (`else`/`elseif` checked against stack top only)
- Update `getScopeAtPosition()` to consume the new return shape
- Comprehensive tests for all new analysis logic

## Capabilities

### New Capabilities

- `block-tag-diagnostics`: Validation of Twig block tag structure — detecting unclosed tags, orphan closing tags, nesting errors, and misplaced mid-block keywords. This change implements the core analysis; LSP wiring is deferred to a subsequent change.

### Modified Capabilities

- `language-server`: The `BlockType` union and `BLOCK_PAIRS` map are extended with `"with"`, and `extractScopedBlocks` return type changes.

## Impact

- `packages/language-server/src/document-analyzer.ts` — Refactored return type for `extractScopedBlocks`, new interfaces, updated `getScopeAtPosition` to consume new return shape, `BlockType` union and `BLOCK_PAIRS` map extended with `"with"`, inline `set` heuristic, orphan/nesting/mid-block tracking
- Existing tests in `document-analyzer.test.ts` may need updates for the new return type
- New test file for block tag analysis covering all diagnostic categories
- No changes to LSP layer, validators, config, or VSCode extension
