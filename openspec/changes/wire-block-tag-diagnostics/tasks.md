## 1. Validator

- [ ] 1.1 Create `validators/block-tags.ts` with `validateBlockTags(tree): Diagnostic[]` function
- [ ] 1.2 Map `unclosed` items to diagnostics: message `Unclosed {% TAG %} — expected {% endTAG %}`, range on opening tag, Warning severity, source `"twig-sense"`
- [ ] 1.3 Map `orphanClosers` to diagnostics: message `Unexpected {% endTAG %} — no matching {% TAG %}`, range on closing tag
- [ ] 1.4 Map `nestingErrors` to diagnostics: message `{% TAG %} at line N was closed while {% INNER %} at line M was still open`, range on the closing tag that caused the cross
- [ ] 1.5 Map `misplacedKeywords` to diagnostics: message `{% KEYWORD %} is only valid inside {% VALID_PARENTS %}`, range on the misplaced keyword

## 2. Configuration

- [ ] 2.1 Add `blockTags: boolean` to `TwigSenseConfig.diagnostics` in `types/config.ts` (default: `true`)
- [ ] 2.2 Update `mergeWithDefaults` to include `blockTags` with default value
- [ ] 2.3 Add `twig-sense.diagnostics.blockTags` to `packages/vscode/package.json` configuration schema

## 3. Wire into DiagnosticsProvider

- [ ] 3.1 Import `validateBlockTags` in `diagnostics-provider.ts`
- [ ] 3.2 Add `config.diagnostics.blockTags` guard and call `validateBlockTags(tree)` in the `validate` method

## 4. Tests

- [ ] 4.1 Create test file for block tag diagnostics output (verifying LSP Diagnostic objects are correctly formed)
- [ ] 4.2 Add test case: unclosed tag produces Warning-severity diagnostic with correct message format
- [ ] 4.3 Add test case: orphan closer produces Warning-severity diagnostic with correct message format
- [ ] 4.4 Add test case: nesting error produces diagnostic with correct message including line numbers
- [ ] 4.5 Add test case: misplaced keyword produces diagnostic with correct valid parents in message
- [ ] 4.6 Add test case: `blockTags: false` produces zero block tag diagnostics
- [ ] 4.7 Add test case: `{ enabled: false, blockTags: true, inlineComments: true }` produces zero diagnostics (master switch interaction)
- [ ] 4.8 Update `config.test.ts` for new `blockTags` config property
- [ ] 4.9 Add test case: clean template produces zero diagnostics
- [ ] 4.10 Add test case: multiple errors in one document produce multiple diagnostics
- [ ] 4.11 Run full test suite and verify all existing tests pass
