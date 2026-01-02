# Tasks: Add Embedded Language Support

## 1. Package Configuration

- [ ] 1.1 Add `htmlLanguageParticipants` contribution to `packages/vscode/package.json`
- [ ] 1.2 Add `extensionDependencies` for `vscode.html-language-features`
- [ ] 1.3 Add `embeddedLanguages` mapping for CSS and JS scopes in grammar contribution
- [ ] 1.4 Add `twig-sense.html.semanticHighlighting` setting (default: true)

## 2. TextMate Grammar Updates

- [ ] 2.1 Update `packages/vscode/syntaxes/twig.tmLanguage.json` to properly scope Twig constructs
- [ ] 2.2 Ensure Twig patterns take precedence over HTML patterns in the grammar
- [ ] 2.3 Add support for whitespace control modifiers (`{{-`, `-}}`, `{%-`, `-%}`)

## 3. HTML Injection Grammar

- [ ] 3.1 Create `packages/vscode/syntaxes/twig-html-injection.json` for injecting Twig into plain HTML files
- [ ] 3.2 Register HTML injection grammar in `package.json` with `injectTo` targets

## 4. Language Server Completions

- [ ] 4.1 Create `packages/language-server/src/completions.ts` with Twig keywords, filters, and functions
- [ ] 4.2 Implement context detection (block vs output vs filter context)
- [ ] 4.3 Wire up completion handler in `packages/language-server/src/server.ts`
- [ ] 4.4 Configure completion trigger characters (`{`, `|`, `.`)

## 5. Documentation

- [ ] 5.1 Update README.md with embedded language features
- [ ] 5.2 Document user configuration options (Emmet, semantic highlighting)

## 6. Testing

- [ ] 6.1 Test HTML completions work in `.twig` files
- [ ] 6.2 Test Emmet expansion works in `.twig` files
- [ ] 6.3 Test CSS completions in `<style>` tags
- [ ] 6.4 Test Twig highlighting in `.html` files
- [ ] 6.5 Test Twig completions (keywords, filters, functions)
- [ ] 6.6 Test `twig-sense.html.semanticHighlighting` setting toggle

## Dependencies

- Tasks 2.x can run in parallel with Tasks 3.x
- Tasks 4.x depend on existing language server infrastructure
- Tasks 5.x and 6.x depend on all implementation tasks
