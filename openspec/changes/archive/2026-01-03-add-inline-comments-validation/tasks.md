# Tasks: Add Inline Comments Validation

## Phase 1: Validation Logic Implementation

### 1.1 Create validation module

- [x] Create `packages/language-server/src/validators/inline-comments.ts`
- [x] Export `validateInlineComments(tree: Tree, document: TextDocument): Diagnostic[]` function
- [x] Import Tree-sitter and LSP types

### 1.2 Implement traversal logic

- [x] Traverse syntax tree to find all `inline_comment` nodes
- [x] For each inline_comment node, get its parent node (output_statement or statement_block)
- [x] Get the parent's closing delimiter token (last child: `}}`, `-}}`, `%}`, or `-%}`)
- [x] Check if closing delimiter token's start position is on same line as inline_comment start
- [x] Use tree-sitter position information (row numbers) for accurate line comparison

### 1.3 Implement diagnostic generation

- [x] When same-line closing delimiter token detected, create Diagnostic object
- [x] Set severity to `DiagnosticSeverity.Warning`
- [x] Set message: "Inline comment extends to end of line. Move closing delimiter to next line."
- [x] Set range to inline_comment node's position
- [x] Set source: "twig-sense"

### 1.4 Handle edge cases

- [x] Verify delimiter detection uses actual syntax tree tokens, not comment text content
- [x] Handle multi-line expressions: only warn if last inline comment and closer on same line
- [x] Ignore `}}` or `%}` appearing within inline comment text (not actual delimiter tokens)
- [x] Test with whitespace-only content between comment and delimiter on same line

## Phase 2: Integration with Language Server

### 2.1 Update diagnostics handler

- [x] Open `packages/language-server/src/server.ts`
- [x] Import `validateInlineComments` function
- [x] Call validation in `onDidChangeContent` or diagnostic computation phase
- [x] Merge inline comment diagnostics with existing diagnostics

### 2.2 Add configuration support

- [x] Check `twig-sense.diagnostics.enabled` setting before running validation
- [x] Add optional `twig-sense.diagnostics.inlineComments` setting for granular control
- [x] Default to enabled for both settings

### 2.3 Optimize performance

- [x] Only validate inline comments in changed regions if possible
- [x] Reuse cached syntax trees from tree-cache module
- [x] Avoid re-validating entire document on small edits

## Phase 3: Unit Tests

### 3.1 Create validation test file

- [x] Create `packages/language-server/src/__tests__/inline-comments-validation.test.ts`
- [x] Set up test harness with parser and validation function

### 3.2 Write positive test cases (should warn)

- [x] Test: Single-line expression with inline comment and same-line closer
- [x] Test: Statement block with inline comment and same-line closer
- [x] Test: Inline comment before closing delimiter with no newline
- [x] Test: Multi-line expression where last line has comment + closer

### 3.3 Write negative test cases (should not warn)

- [x] Test: Inline comment with closing delimiter on next line (valid)
- [x] Test: Multi-line expression with inline comments, properly closed
- [x] Test: String containing `}}` text (not a real closer)
- [x] Test: No inline comments present (no validation needed)
- [x] Test: Comment text contains `}}` or `%}` but delimiter is on next line (valid)
- [x] Test: Whitespace-only between inline comment and next line's delimiter (valid)
- [x] Test: Multi-line with intermediate inline comments, all properly spaced (valid)

### 3.4 Test diagnostic properties

- [x] Verify diagnostic severity is Warning
- [x] Verify diagnostic message is clear and actionable
- [x] Verify diagnostic range points to inline comment location
- [x] Verify diagnostic source is "twig-sense"

### 3.5 Run unit tests

- [x] Run `npm test` in language-server package
- [x] Verify all inline comment validation tests pass
- [x] Ensure no regressions in existing tests

## Phase 4: Integration Tests

### 4.1 Create integration test fixtures

- [x] Add `packages/vscode/test/fixtures/invalid-inline-comment.twig` with test cases
- [x] Include examples of both valid and invalid inline comment usage
- [x] Add comments documenting expected diagnostic behavior

### 4.2 Manual testing in VSCode

- [x] Start extension in development mode
- [x] Open invalid-inline-comment.twig fixture
- [x] Verify warning squiggle appears under invalid inline comments
- [x] Hover over squiggle to see diagnostic message
- [x] Verify no false positive warnings

### 4.3 Test diagnostic updates

- [x] Type an inline comment with same-line closer, verify warning appears
- [x] Press Enter to move closer to next line, verify warning disappears
- [x] Test undo/redo maintains correct diagnostic state

## Phase 5: Documentation and Polish

### 5.1 Update documentation

- [x] Document inline comment validation in language server README
- [x] Add example of invalid usage to README with explanation
- [x] Update NOTES.md with implementation details if applicable

### 5.2 Improve diagnostic message (optional)

- [x] Consider adding hint: "Press Enter before }} to fix"
- [x] Add diagnostic code for potential quick fix integration later
- [x] Test message clarity with various users/scenarios

### 5.3 Performance verification

- [x] Test with large files (1000+ lines) containing many inline comments
- [x] Verify validation completes within reasonable time (<100ms)
- [x] Profile if needed and optimize hot paths
