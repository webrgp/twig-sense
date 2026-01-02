# Tasks: Add comprehensive tests for all implemented features

## 1. Language Server Unit Testing Setup
- [x] 1.1 Add Vitest as dev dependency in `packages/language-server/package.json`
- [x] 1.2 Create `vitest.config.ts` in language-server package
- [x] 1.3 Add `test` script to language-server `package.json`
- [x] 1.4 Create `packages/language-server/src/__tests__/` directory structure

## 2. Completion Context Detection Tests
- [x] 2.1 Create `completions.test.ts` test file
- [x] 2.2 Test `detectContext` returns `"output"` inside `{{ }}`
- [x] 2.3 Test `detectContext` returns `"block"` inside `{% %}`
- [x] 2.4 Test `detectContext` returns `"filter"` after pipe in expressions
- [x] 2.5 Test `detectContext` returns `"none"` outside Twig delimiters
- [x] 2.6 Test nested context scenarios (e.g., filter inside output)

## 3. Completion Generation Tests
- [x] 3.1 Test `getCompletions` returns keywords and functions in block context
- [x] 3.2 Test `getCompletions` returns functions in output context
- [x] 3.3 Test `getCompletions` returns filters in filter context
- [x] 3.4 Test `getCompletions` returns tests after `is` keyword
- [x] 3.5 Test `getCompletions` returns empty array outside Twig delimiters
- [x] 3.6 Verify completion items have correct `kind`, `insertText`, and `detail`

## 4. Semantic Token Generation Tests
- [x] 4.1 Create `semantic-tokens.test.ts` test file
- [x] 4.2 Test variable tokens are generated for identifiers in expressions
- [x] 4.3 Test property tokens are generated for property access (e.g., `user.name`)
- [x] 4.4 Test function tokens are generated for filter names
- [x] 4.5 Test keyword tokens are generated for Twig keywords
- [x] 4.6 Test operator tokens are generated for Twig operators
- [x] 4.7 Test string and number literal tokens
- [x] 4.8 Test comment tokens are generated inside `{# #}`
- [x] 4.9 Test delta encoding is correct for multi-token output
- [x] 4.10 Verify tokens are only generated inside Twig constructs (not HTML)

## 5. Parser Utility Tests
- [x] 5.1 Create `parser.test.ts` test file
- [x] 5.2 Test `parseDocument` returns valid tree for Twig template
- [x] 5.3 Test `parseDocument` handles syntax errors gracefully
- [x] 5.4 Test `isParserReady` returns correct state
- [x] 5.5 Test incremental parsing with `parseDocumentIncremental`

## 6. VS Code Extension Integration Tests
- [x] 6.1 Add test for Twig keyword completions in block context
- [x] 6.2 Add test for filter completions after pipe
- [x] 6.3 Add test for semantic highlighting applied to Twig syntax
- [x] 6.4 Create additional test fixtures for complex Twig templates

## 7. CI/Build Integration
- [x] 7.1 Ensure `npm run test` at root runs both language-server and vscode tests
- [x] 7.2 Verify all tests pass locally before PR
