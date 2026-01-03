# Tasks: Add Inline Comments Grammar Support

## Phase 1: Grammar Rule Implementation

### 1.1 Add inline comment rule

- [x] Open `packages/tree-sitter-twig/grammar.js`
- [x] Add `inline_comment` rule using `token(seq('#', /.*/))` to match `#` and rest of line
- [x] Place rule with appropriate precedence to avoid conflicts with string contents

### 1.2 Integrate into expression content

- [x] Add `$.inline_comment` to `_expression_content` choice list
- [x] Position inline_comment with correct precedence (before identifiers, after strings)
- [x] Ensure inline comments can appear between other expression elements

### 1.3 Integrate into statement content

- [x] Verify `_statement_content` uses `_expression_content` (already should)
- [x] If needed, add explicit inline comment support to statement context

## Phase 2: Test Cases

### 2.1 Create corpus test file

- [x] Create or update `packages/tree-sitter-twig/corpus/comments.txt`
- [x] Add test case: "Inline comment on own line in output"
- [x] Add test case: "Inline comment after expression in output"
- [x] Add test case: "Multiple inline comments in expression"
- [x] Add test case: "Inline comment in statement block"
- [x] Add test case: "Inline comment in array/map syntax"
- [x] Add test case: "Hash symbol inside string (should not be comment)"
- [x] Add test case: "Multiple inline comments on separate lines"
- [x] Add test case: "Inline comment doesn't consume newline character"
- [x] Add test case: "Code on next line after inline comment parses correctly"
- [x] Add test case: "Inline comment inside parenthesized expression"
- [x] Add test case: "Inline comment with filter and function calls"
- [x] Add test case: "Map literal with inline comments after values (real-world from Twig docs)"
- [x] Add test case: "Inline comment after trailing comma in array/map"
- [x] Add test case: "Inline comment before closing bracket/brace"
- [x] Add test case: "Inline comment after filter pipe on multiline expression"

### 2.2 Define expected parse trees

- [x] Write expected tree structure for each test case
- [x] Ensure `inline_comment` nodes appear correctly
- [x] Verify string content with `#` does not create comment nodes

## Phase 3: Build and Validation

### 3.1 Rebuild grammar

- [x] Run `npm run build` in `packages/tree-sitter-twig` to generate C parser
- [x] Verify no compilation errors or warnings
- [x] Check that `src/grammar.json` includes inline_comment rule

### 3.2 Run corpus tests

- [x] Run tree-sitter test command to execute corpus tests
- [x] Fix any parsing failures
- [x] Verify all test cases pass

### 3.3 Rebuild WASM module

- [x] Run tree-sitter build command to generate WASM
- [x] Verify `tree-sitter-twig.wasm` is updated
- [x] Confirm WASM file size is reasonable (not drastically larger)

## Phase 4: Unit Test Coverage

### 4.1 Create parser unit tests

- [x] Create `packages/language-server/src/__tests__/inline-comments.test.ts`
- [x] Test parsing document with inline comment returns tree with inline_comment node
- [x] Test inline comment node has correct text content
- [x] Test inline comment node position matches source
- [x] Test hash in string does not create inline_comment node

### 4.2 Update semantic token handler

- [x] Open `packages/language-server/src/semantic-tokens.ts`
- [x] Add case for `inline_comment` in `getTokenType()` function
- [x] Map `inline_comment` node type to `TOKEN_TYPES.comment`
- [x] Verify it follows same pattern as existing `comment_content` handling

### 4.3 Update semantic token tests

- [x] Update `packages/language-server/src/__tests__/semantic-tokens.test.ts`
- [x] Add test case for inline comment generating comment token type
- [x] Verify inline comments inside expressions produce tokens
- [x] Test that inline comment tokens have correct position and length

### 4.4 Run all tests

- [x] Run `npm test` in language-server package
- [x] Verify all existing tests still pass
- [x] Verify new inline comment tests pass
- [x] Fix any regressions

## Phase 5: Integration Verification

### 5.1 Manual testing

- [x] Start language server in development mode
- [x] Open test fixture with inline comments
- [x] Verify no parse errors in language server logs
- [x] Check that syntax tree includes inline_comment nodes (via debug logging if needed)

### 5.2 Verify newline handling

- [x] Test that `token(seq('#', /.*/))` stops at line boundary
- [x] Verify inline comments don't consume newline characters
- [x] Confirm multiline expressions with inline comments parse all lines correctly

### 5.3 Documentation

- [x] Update corpus/comments.txt with inline comment examples
- [x] Add inline comment test fixtures to `packages/vscode/test/fixtures/`
- [x] Include real-world examples from Twig docs (map literals with comments)
- [x] Document inline comment support in NOTES.md if applicable
