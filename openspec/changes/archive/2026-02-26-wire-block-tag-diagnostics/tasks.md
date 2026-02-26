## 1. Validator

- [x] 1.1 Create `validators/block-tags.ts` with `validateBlockTags(tree): Diagnostic[]` function
- [x] 1.2 Map `unclosed` items to diagnostics: message `Unclosed {% TAG %} — expected {% endTAG %}`, range on opening tag, Warning severity, source `"twig-sense"`
- [x] 1.3 Map `orphanClosers` to diagnostics: message `Unexpected {% endTAG %} — no matching {% TAG %}`, range on closing tag
- [x] 1.4 Map `nestingErrors` to diagnostics: message `{% TAG %} at line N was closed while {% INNER %} at line M was still open`, range on the closing tag that caused the cross
- [x] 1.5 Map `misplacedKeywords` to diagnostics: message `{% KEYWORD %} is only valid inside {% VALID_PARENTS %}`, range on the misplaced keyword

## 2. Configuration

- [x] 2.1 Add `blockTags: boolean` to `TwigSenseConfig.diagnostics` in `types/config.ts` (default: `true`)
- [x] 2.2 Update `mergeWithDefaults` to include `blockTags` with default value
- [x] 2.3 Add `twig-sense.diagnostics.blockTags` to `packages/vscode/package.json` configuration schema

## 3. Wire into DiagnosticsProvider

- [x] 3.1 Import `validateBlockTags` in `diagnostics-provider.ts`
- [x] 3.2 Add `config.diagnostics.blockTags` guard and call `validateBlockTags(tree)` in the `validate` method

## 4. Tests

- [x] 4.1 Create test file for block tag diagnostics output (verifying LSP Diagnostic objects are correctly formed)
- [x] 4.2 Add test case: unclosed tag produces Warning-severity diagnostic with correct message format
- [x] 4.3 Add test case: orphan closer produces Warning-severity diagnostic with correct message format
- [x] 4.4 Add test case: nesting error produces diagnostic with correct message including line numbers
- [x] 4.5 Add test case: misplaced keyword produces diagnostic with correct valid parents in message
- [x] 4.6 Add test case: `blockTags: false` produces zero block tag diagnostics
- [x] 4.7 Add test case: `{ enabled: false, blockTags: true, inlineComments: true }` produces zero diagnostics (master switch interaction)
- [x] 4.8 Update `config.test.ts` for new `blockTags` config property
- [x] 4.9 Add test case: clean template produces zero diagnostics
- [x] 4.10 Add test case: multiple errors in one document produce multiple diagnostics
- [x] 4.11 Run full test suite and verify all existing tests pass
