# Tasks: Add Inline Comments TextMate Grammar

## Phase 1: TextMate Pattern Implementation

### 1.1 Add inline comment pattern

- [x] Open `packages/vscode/syntaxes/twig.tmLanguage.json`
- [x] Add `inline-comment` pattern to repository section
- [x] Define pattern with regex: `#[^}%]*(?=}}|%}|$)` (matches `#` to closing delimiter or end of line)
- [x] Set scope name: `comment.line.number-sign.twig`

### 1.2 Include in expression patterns

- [x] Locate `expression` pattern in repository
- [x] Add `{ "include": "#inline-comment" }` to patterns array
- [x] Position with correct precedence (before identifiers, after strings)

### 1.3 Verify pattern ordering

- [x] Ensure inline-comment is checked before identifier patterns
- [x] Ensure string patterns are checked before inline-comment (to prevent `#` in strings)
- [x] Test pattern precedence with complex examples

## Phase 2: Test Fixtures

### 2.1 Create inline comment fixture

- [x] Create `packages/vscode/test/fixtures/inline-comments.twig`
- [x] Add example: inline comment on own line in output
- [x] Add example: inline comment after expression
- [x] Add example: inline comment in statement block
- [x] Add example: inline comment in array/map
- [x] Add example: multiple inline comments
- [x] Add example: hash in string (should not highlight as comment)

### 2.2 Update existing fixtures

- [x] Review `complex.twig` and `sample.twig`
- [x] Add inline comments to demonstrate feature
- [x] Ensure varied comment placement for visual testing

## Phase 3: Manual Testing

### 3.1 Test with light theme

- [x] Open VSCode with light theme
- [x] Open inline-comments.twig fixture
- [x] Verify inline comments are grayed out or in comment color
- [x] Verify code portions maintain correct colors
- [x] Test typing new inline comments

### 3.2 Test with dark theme

- [x] Switch to dark theme
- [x] Verify inline comments use appropriate dark theme comment color
- [x] Check contrast and readability
- [x] Test with popular themes (One Dark, Dracula, etc.)

### 3.3 Test edge cases

- [x] Verify `#` inside strings does not highlight as comment
- [x] Test inline comment immediately after expression: `{{ value # comment }}`
- [x] Test multiple `#` characters: `{{ value # comment # more }}`
- [x] Test inline comment with special characters: `{{ value # TODO: fix! }}`

## Phase 4: Extension Testing

### 4.1 Update extension tests

- [x] Open `packages/vscode/test/suite/extension.test.ts`
- [x] Add test case: "Syntax highlights inline comments"
- [x] Test verifies comment scope is applied to inline comment tokens
- [x] Test verifies code scope is maintained for non-comment portions

### 4.2 Run extension tests

- [x] Run `npm test` in vscode package
- [x] Verify all tests pass
- [x] Fix any failures related to TextMate grammar changes

## Phase 5: Integration and Documentation

### 5.1 Build and package

- [x] Run `npm run build` in vscode package
- [x] Verify TextMate grammar is included in build output
- [x] Test extension in development mode with "Run Extension" command

### 5.2 Update documentation

- [x] Update `packages/vscode/README.md` to mention inline comment support
- [x] Add inline comment example to README code samples
- [x] Document Twig 3.15+ requirement for inline comments

### 5.3 Cross-verify with semantic tokens

- [x] Enable semantic tokens in VSCode settings
- [x] Verify semantic token colors match or complement TextMate colors
- [x] Ensure no visual conflicts between TextMate and semantic highlighting
- [x] Test disabling semantic tokens to verify TextMate fallback
- [x] Verify Phase 1 (grammar) properly generates inline_comment nodes
- [x] Confirm semantic tokens from Phase 1 work correctly with TextMate patterns
