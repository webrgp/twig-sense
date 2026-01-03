# Tasks: Add Inline Comments Validation

## Phase 1: Validation Logic Implementation

### 1.1 Create validation module

- [ ] Create `packages/language-server/src/validators/inline-comments.ts`
- [ ] Export `validateInlineComments(tree: Tree, document: TextDocument): Diagnostic[]` function
- [ ] Import Tree-sitter and LSP types

### 1.2 Implement traversal logic

- [ ] Traverse syntax tree to find all `inline_comment` nodes
- [ ] For each inline_comment node, get its parent node (output_statement or statement_block)
- [ ] Get the parent's closing delimiter token (last child: `}}`, `-}}`, `%}`, or `-%}`)
- [ ] Check if closing delimiter token's start position is on same line as inline_comment start
- [ ] Use tree-sitter position information (row numbers) for accurate line comparison

### 1.3 Implement diagnostic generation

- [ ] When same-line closing delimiter token detected, create Diagnostic object
- [ ] Set severity to `DiagnosticSeverity.Warning`
- [ ] Set message: "Inline comment extends to end of line. Move closing delimiter to next line."
- [ ] Set range to inline_comment node's position
- [ ] Set source: "twig-sense"

### 1.4 Handle edge cases

- [ ] Verify delimiter detection uses actual syntax tree tokens, not comment text content
- [ ] Handle multi-line expressions: only warn if last inline comment and closer on same line
- [ ] Ignore `}}` or `%}` appearing within inline comment text (not actual delimiter tokens)
- [ ] Test with whitespace-only content between comment and delimiter on same line

## Phase 2: Integration with Language Server

### 2.1 Update diagnostics handler

- [ ] Open `packages/language-server/src/server.ts`
- [ ] Import `validateInlineComments` function
- [ ] Call validation in `onDidChangeContent` or diagnostic computation phase
- [ ] Merge inline comment diagnostics with existing diagnostics

### 2.2 Add configuration support

- [ ] Check `twig-sense.diagnostics.enabled` setting before running validation
- [ ] Add optional `twig-sense.diagnostics.inlineComments` setting for granular control
- [ ] Default to enabled for both settings

### 2.3 Optimize performance

- [ ] Only validate inline comments in changed regions if possible
- [ ] Reuse cached syntax trees from tree-cache module
- [ ] Avoid re-validating entire document on small edits

## Phase 3: Unit Tests

### 3.1 Create validation test file

- [ ] Create `packages/language-server/src/__tests__/inline-comments-validation.test.ts`
- [ ] Set up test harness with parser and validation function

### 3.2 Write positive test cases (should warn)

- [ ] Test: Single-line expression with inline comment and same-line closer
- [ ] Test: Statement block with inline comment and same-line closer
- [ ] Test: Inline comment before closing delimiter with no newline
- [ ] Test: Multi-line expression where last line has comment + closer

### 3.3 Write negative test cases (should not warn)

- [ ] Test: Inline comment with closing delimiter on next line (valid)
- [ ] Test: Multi-line expression with inline comments, properly closed
- [ ] Test: String containing `}}` text (not a real closer)
- [ ] Test: No inline comments present (no validation needed)
- [ ] Test: Comment text contains `}}` or `%}` but delimiter is on next line (valid)
- [ ] Test: Whitespace-only between inline comment and next line's delimiter (valid)
- [ ] Test: Multi-line with intermediate inline comments, all properly spaced (valid)

### 3.4 Test diagnostic properties

- [ ] Verify diagnostic severity is Warning
- [ ] Verify diagnostic message is clear and actionable
- [ ] Verify diagnostic range points to inline comment location
- [ ] Verify diagnostic source is "twig-sense"

### 3.5 Run unit tests

- [ ] Run `npm test` in language-server package
- [ ] Verify all inline comment validation tests pass
- [ ] Ensure no regressions in existing tests

## Phase 4: Integration Tests

### 4.1 Create integration test fixtures

- [ ] Add `packages/vscode/test/fixtures/invalid-inline-comment.twig` with test cases
- [ ] Include examples of both valid and invalid inline comment usage
- [ ] Add comments documenting expected diagnostic behavior

### 4.2 Manual testing in VSCode

- [ ] Start extension in development mode
- [ ] Open invalid-inline-comment.twig fixture
- [ ] Verify warning squiggle appears under invalid inline comments
- [ ] Hover over squiggle to see diagnostic message
- [ ] Verify no false positive warnings

### 4.3 Test diagnostic updates

- [ ] Type an inline comment with same-line closer, verify warning appears
- [ ] Press Enter to move closer to next line, verify warning disappears
- [ ] Test undo/redo maintains correct diagnostic state

## Phase 5: Documentation and Polish

### 5.1 Update documentation

- [ ] Document inline comment validation in language server README
- [ ] Add example of invalid usage to README with explanation
- [ ] Update NOTES.md with implementation details if applicable

### 5.2 Improve diagnostic message (optional)

- [ ] Consider adding hint: "Press Enter before }} to fix"
- [ ] Add diagnostic code for potential quick fix integration later
- [ ] Test message clarity with various users/scenarios

### 5.3 Performance verification

- [ ] Test with large files (1000+ lines) containing many inline comments
- [ ] Verify validation completes within reasonable time (<100ms)
- [ ] Profile if needed and optimize hot paths
