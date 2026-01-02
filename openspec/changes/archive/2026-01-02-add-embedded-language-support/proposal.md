# Change: Add Embedded Language Support

## Why

Twig templates are predominantly HTML-based with embedded CSS and JavaScript in `<style>` and `<script>` tags. Users expect full HTML/CSS/JS IntelliSense, Emmet support, and syntax highlighting when editing Twig files. Currently, the extension only highlights Twig syntax and provides basic HTML via TextMate grammar inclusion, missing language server features like completions, hover, and formatting.

## What Changes

- Register `twig` language as an HTML Language Participant via `htmlLanguageParticipants` contribution point
- Add `extensionDependencies` on `vscode.html-language-features` for HTML Language Server features
- Create injection grammar for Twig syntax in plain `.html` files
- Add `twig-sense.html.semanticHighlighting` setting to control HTML semantic tokens
- Update TextMate grammar to properly scope Twig constructs within HTML
- Implement Twig-specific completions (keywords, filters, functions) in the language server

## Impact

- **Affected specs**:
  - `syntax-highlighting` - Add injection grammar patterns
  - `embedded-languages` - New capability (HTML/CSS/JS/JSON integration)
- **Affected code**:
  - `packages/vscode/package.json` - Add contributions
  - `packages/vscode/syntaxes/` - New injection grammar files
  - `packages/language-server/src/completions.ts` - Twig completions
  - `packages/language-server/src/server.ts` - Wire up completions
