# Tasks: Add Inline Comments TextMate Grammar

## Phase 1: TextMate Pattern Implementation

### 1.1 Add inline comment pattern

- [ ] Open `packages/vscode/syntaxes/twig.tmLanguage.json`
- [ ] Add `inline-comment` pattern to repository section
- [ ] Define pattern with regex: `#.*$` (matches `#` to end of line)
- [ ] Set scope name: `comment.line.number-sign.twig`

### 1.2 Include in expression patterns

- [ ] Locate `expression` pattern in repository
- [ ] Add `{ "include": "#inline-comment" }` to patterns array
- [ ] Position with correct precedence (before identifiers, after strings)

### 1.3 Verify pattern ordering

- [ ] Ensure inline-comment is checked before identifier patterns
- [ ] Ensure string patterns are checked before inline-comment (to prevent `#` in strings)
- [ ] Test pattern precedence with complex examples

## Phase 2: Test Fixtures

### 2.1 Create inline comment fixture

- [ ] Create `packages/vscode/test/fixtures/inline-comments.twig`
- [ ] Add example: inline comment on own line in output
- [ ] Add example: inline comment after expression
- [ ] Add example: inline comment in statement block
- [ ] Add example: inline comment in array/map
- [ ] Add example: multiple inline comments
- [ ] Add example: hash in string (should not highlight as comment)

### 2.2 Update existing fixtures

- [ ] Review `complex.twig` and `sample.twig`
- [ ] Add inline comments to demonstrate feature
- [ ] Ensure varied comment placement for visual testing

## Phase 3: Manual Testing

### 3.1 Test with light theme

- [ ] Open VSCode with light theme
- [ ] Open inline-comments.twig fixture
- [ ] Verify inline comments are grayed out or in comment color
- [ ] Verify code portions maintain correct colors
- [ ] Test typing new inline comments

### 3.2 Test with dark theme

- [ ] Switch to dark theme
- [ ] Verify inline comments use appropriate dark theme comment color
- [ ] Check contrast and readability
- [ ] Test with popular themes (One Dark, Dracula, etc.)

### 3.3 Test edge cases

- [ ] Verify `#` inside strings does not highlight as comment
- [ ] Test inline comment immediately after expression: `{{ value # comment }}`
- [ ] Test multiple `#` characters: `{{ value # comment # more }}`
- [ ] Test inline comment with special characters: `{{ value # TODO: fix! }}`

## Phase 4: Extension Testing

### 4.1 Update extension tests

- [ ] Open `packages/vscode/test/suite/extension.test.ts`
- [ ] Add test case: "Syntax highlights inline comments"
- [ ] Test verifies comment scope is applied to inline comment tokens
- [ ] Test verifies code scope is maintained for non-comment portions

### 4.2 Run extension tests

- [ ] Run `npm test` in vscode package
- [ ] Verify all tests pass
- [ ] Fix any failures related to TextMate grammar changes

## Phase 5: Integration and Documentation

### 5.1 Build and package

- [ ] Run `npm run build` in vscode package
- [ ] Verify TextMate grammar is included in build output
- [ ] Test extension in development mode with "Run Extension" command

### 5.2 Update documentation

- [ ] Update `packages/vscode/README.md` to mention inline comment support
- [ ] Add inline comment example to README code samples
- [ ] Document Twig 3.15+ requirement for inline comments

### 5.3 Cross-verify with semantic tokens

- [ ] Enable semantic tokens in VSCode settings
- [ ] Verify semantic token colors match or complement TextMate colors
- [ ] Ensure no visual conflicts between TextMate and semantic highlighting
- [ ] Test disabling semantic tokens to verify TextMate fallback
