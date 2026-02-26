## 1. Data Model & Interfaces

- [x] 1.1 Add new interfaces to `document-analyzer.ts`: `TagLocation` (keyword text, line, character, endLine, endCharacter), `NestingError` (outer/inner/closer locations), `MisplacedKeyword` (keyword location + valid parents), `TagAnalysisResult` (scopedBlocks + unclosed + orphanClosers + nestingErrors + misplacedKeywords)
- [x] 1.2 Add `with`/`endwith` to `BLOCK_PAIRS` map and `"with"` to the `BlockType` union (depends on `add-endwith-grammar-keyword` change — grammar must produce `endwith` keyword nodes first)
- [x] 1.3 Add `MID_BLOCK_RULES` map: `else → ["if", "for"]`, `elseif → ["if"]`

## 2. Refactor `extractScopedBlocks`

- [x] 2.1 Change return type of `extractScopedBlocks` from `ScopedBlockInfo[]` to `TagAnalysisResult`
- [x] 2.2 Add inline `set` heuristic: check for `operator("=")` in statement_block children, skip stack push if present
- [x] 2.3 Add orphan closer tracking: when a closing keyword finds no matching opener on the stack, push to `orphanClosers` array — only track closers whose base keyword (text after `end`) is a known key in `BLOCK_PAIRS`
- [x] 2.4 Add cross-nesting anomaly tracking: when a splice skips over stack items, record `NestingError` with outer/inner/closer locations
- [x] 2.5 Add mid-block keyword validation: when encountering `else` or `elseif`, check stack top against `MID_BLOCK_RULES` and push to `misplacedKeywords` if invalid
- [x] 2.6 Store full `TagLocation` data (keyword text, line, character, endLine, endCharacter) for all tracked items

## 3. Update Consumers

- [x] 3.1 Update `getScopeAtPosition` to destructure `scopedBlocks` from the new `TagAnalysisResult` return type
- [x] 3.2 Verify no other direct callers of `extractScopedBlocks` need updates

## 4. Tests

- [x] 4.1 Add test cases for unclosed tags (if, for, block, macro, with, and other block types)
- [x] 4.2 Add test cases for orphan closers (endif without if, extra endfor, etc.)
- [x] 4.3 Add test cases for cross-nesting anomalies (forgot endif inside for, swapped closers)
- [x] 4.4 Add test cases for mid-block validation (else outside block, elseif in for, else in block not if/for, strict innermost check)
- [x] 4.5 Add test case: `{% for %}{% if %}...{% endif %}{% else %}...{% endfor %}` — valid for-else with properly-closed nested if produces zero misplaced keyword entries for the else
- [x] 4.6 Add test cases for inline set NOT tracked, block-form set without endset IS tracked
- [x] 4.7 Add integration gate test: template with 5+ inline sets produces zero entries in unclosed/orphanClosers arrays
- [x] 4.8 Add test case: clean template with proper nesting produces empty error arrays
- [x] 4.9 Add test case: multiple errors in one document
- [x] 4.10 Add test cases for `{% with %}...{% endwith %}` pairing (valid pair produces no error, unclosed `{% with %}` is tracked)
- [x] 4.11 Add test case: `{% endblock header %}` (named endblock) produces no error entries
- [x] 4.12 Add test case: unknown `end*` keywords (e.g. `{% enddeprecated %}`) are silently ignored, NOT added to orphanClosers
- [x] 4.13 Update `document-analyzer.test.ts` for new `extractScopedBlocks` return type if needed
- [x] 4.14 Run full test suite and verify all existing tests pass
