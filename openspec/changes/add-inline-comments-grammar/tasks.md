# Tasks: Add Inline Comments Grammar Support

## Phase 1: Grammar Rule Implementation

### 1.1 Add inline comment rule

- [ ] Open `packages/tree-sitter-twig/grammar.js`
- [ ] Add `inline_comment` rule using `token(seq('#', /.*/))` to match `#` and rest of line
- [ ] Place rule with appropriate precedence to avoid conflicts with string contents

### 1.2 Integrate into expression content

- [ ] Add `$.inline_comment` to `_expression_content` choice list
- [ ] Position inline_comment with correct precedence (before identifiers, after strings)
- [ ] Ensure inline comments can appear between other expression elements

### 1.3 Integrate into statement content

- [ ] Verify `_statement_content` uses `_expression_content` (already should)
- [ ] If needed, add explicit inline comment support to statement context

## Phase 2: Test Cases

### 2.1 Create corpus test file

- [ ] Create or update `packages/tree-sitter-twig/corpus/comments.txt`
- [ ] Add test case: "Inline comment on own line in output"
- [ ] Add test case: "Inline comment after expression in output"
- [ ] Add test case: "Multiple inline comments in expression"
- [ ] Add test case: "Inline comment in statement block"
- [ ] Add test case: "Inline comment in array/map syntax"
- [ ] Add test case: "Hash symbol inside string (should not be comment)"
- [ ] Add test case: "Multiple inline comments on separate lines"
- [ ] Add test case: "Inline comment doesn't consume newline character"
- [ ] Add test case: "Code on next line after inline comment parses correctly"
- [ ] Add test case: "Inline comment inside parenthesized expression"
- [ ] Add test case: "Inline comment with filter and function calls"
- [ ] Add test case: "Map literal with inline comments after values (real-world from Twig docs)"
- [ ] Add test case: "Inline comment after trailing comma in array/map"
- [ ] Add test case: "Inline comment before closing bracket/brace"
- [ ] Add test case: "Inline comment after filter pipe on multiline expression"

### 2.2 Define expected parse trees

- [ ] Write expected tree structure for each test case
- [ ] Ensure `inline_comment` nodes appear correctly
- [ ] Verify string content with `#` does not create comment nodes

## Phase 3: Build and Validation

### 3.1 Rebuild grammar

- [ ] Run `npm run build` in `packages/tree-sitter-twig` to generate C parser
- [ ] Verify no compilation errors or warnings
- [ ] Check that `src/grammar.json` includes inline_comment rule

### 3.2 Run corpus tests

- [ ] Run tree-sitter test command to execute corpus tests
- [ ] Fix any parsing failures
- [ ] Verify all test cases pass

### 3.3 Rebuild WASM module

- [ ] Run tree-sitter build command to generate WASM
- [ ] Verify `tree-sitter-twig.wasm` is updated
- [ ] Confirm WASM file size is reasonable (not drastically larger)

## Phase 4: Unit Test Coverage

### 4.1 Create parser unit tests

- [ ] Create `packages/language-server/src/__tests__/inline-comments.test.ts`
- [ ] Test parsing document with inline comment returns tree with inline_comment node
- [ ] Test inline comment node has correct text content
- [ ] Test inline comment node position matches source
- [ ] Test hash in string does not create inline_comment node

### 4.2 Update semantic token handler

- [ ] Open `packages/language-server/src/semantic-tokens.ts`
- [ ] Add case for `inline_comment` in `getTokenType()` function
- [ ] Map `inline_comment` node type to `TOKEN_TYPES.comment`
- [ ] Verify it follows same pattern as existing `comment_content` handling

### 4.3 Update semantic token tests

- [ ] Update `packages/language-server/src/__tests__/semantic-tokens.test.ts`
- [ ] Add test case for inline comment generating comment token type
- [ ] Verify inline comments inside expressions produce tokens
- [ ] Test that inline comment tokens have correct position and length

### 4.4 Run all tests

- [ ] Run `npm test` in language-server package
- [ ] Verify all existing tests still pass
- [ ] Verify new inline comment tests pass
- [ ] Fix any regressions

## Phase 5: Integration Verification

### 5.1 Manual testing

- [ ] Start language server in development mode
- [ ] Open test fixture with inline comments
- [ ] Verify no parse errors in language server logs
- [ ] Check that syntax tree includes inline_comment nodes (via debug logging if needed)

### 5.2 Verify newline handling

- [ ] Test that `token(seq('#', /.*/))` stops at line boundary
- [ ] Verify inline comments don't consume newline characters
- [ ] Confirm multiline expressions with inline comments parse all lines correctly

### 5.3 Documentation

- [ ] Update corpus/comments.txt with inline comment examples
- [ ] Add inline comment test fixtures to `packages/vscode/test/fixtures/`- [ ] Include real-world examples from Twig docs (map literals with comments)- [ ] Document inline comment support in NOTES.md if applicable
