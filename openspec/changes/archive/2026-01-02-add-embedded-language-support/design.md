# Design: Embedded Language Support

## Context

VSCode's HTML Language Server provides features like completions, hover, formatting, and Emmet for HTML files. The challenge is enabling these features for `.twig` files while maintaining the `twig` language ID (so status bar shows "Twig" instead of "HTML").

### Stakeholders
- Extension users expecting full HTML tooling in Twig files
- Users with JSON Twig templates for API responses

### Constraints
- Must not break existing Twig syntax highlighting
- Must maintain `twig` as the language ID for `.twig` files
- Should work with VSCode's built-in HTML/CSS/JS language servers

## Goals / Non-Goals

### Goals
- Full HTML Language Server features in `.twig` files (completions, hover, formatting)
- CSS IntelliSense in `<style>` tags
- JavaScript IntelliSense in `<script>` tags
- Emmet support out of the box
- Twig syntax highlighting in `.html` files (via injection)
- Twig syntax highlighting in `.json` files (via injection)

### Non-Goals
- Diagnostics for Twig syntax (future work)
- Cross-language features like CSS class renaming affecting HTML
- TypeScript support in `<script>` tags (complex, requires virtual projects)

## Decisions

### Decision 1: Use `htmlLanguageParticipants` Contribution Point

**What**: Register `twig` as an HTML language participant in `package.json`:
```json
{
  "htmlLanguageParticipants": [{ "languageId": "twig", "autoInsert": true }],
  "extensionDependencies": ["vscode.html-language-features"]
}
```

**Why**: This is VSCode's official mechanism for extending HTML Language Server features to custom language IDs. It enables HTML completions, hover, formatting, and Emmet without implementing our own language services.

**Alternatives considered**:
- Embed `vscode-html-languageservice` directly: More control but significantly more code and maintenance burden
- Request forwarding via middleware: Works for completions but cannot support diagnostics
- Use `files.associations` to map `.twig` to `html`: Would lose "Twig" in status bar

### Decision 2: Injection Grammar for HTML Files

**What**: Create injection grammar that injects Twig syntax into `text.html` scopes.

**Why**: Users may have Twig syntax in `.html` files. Injection allows Twig highlighting without requiring file extension changes. HTML injection is safe because Twig delimiters (`{{`, `{%`) are not valid HTML syntax.

**Alternatives considered**:
- Require users to rename files to `.twig`: Poor user experience
- Auto-detect Twig syntax and change language: Unreliable and confusing

### Decision 3: HTML Semantic Highlighting Configuration

**What**: Add `twig-sense.html.semanticHighlighting` setting (default: `true`) to control HTML semantic tokens in Twig files.

**Why**: HTML Language Server semantic tokens can override TextMate grammar in some edge cases. Providing a toggle gives users control if they experience highlighting issues.

**Implementation**: When disabled, the extension will configure `editor.semanticHighlighting.enabled` to `false` for the `twig` language scope.

### Decision 4: Keep TextMate Grammar with HTML Base

**What**: Maintain `text.html.twig` scope that includes `text.html.basic` as the base, with Twig patterns taking precedence.

**Why**: This ensures HTML highlighting works as fallback and Twig patterns override where applicable. The `htmlLanguageParticipants` feature works with any `text.html.*` derived scope.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    .twig file                       │
├─────────────────────────────────────────────────────┤
│  Language ID: "twig"                                │
│  Grammar Scope: text.html.twig                      │
├─────────────────────────────────────────────────────┤
│  HTML Language Server (via htmlLanguageParticipants)│
│  └─ Completions, Hover, Formatting, Emmet           │
├─────────────────────────────────────────────────────┤
│  TextMate Grammar (text.html.twig)                  │
│  └─ Twig syntax + HTML base                         │
├─────────────────────────────────────────────────────┤
│  Twig Language Server                               │
│  └─ Twig completions (keywords, filters, functions) │
│  └─ Semantic tokens (optional)                      │
└─────────────────────────────────────────────────────┘
```

## Risks / Trade-offs

### Risk: Semantic Token Conflicts
- **Issue**: HTML Language Server semantic tokens may override Twig highlighting
- **Mitigation**: Document workaround (disable HTML semantic highlighting if needed)
- **Severity**: Low (rarely affects Twig constructs which are not valid HTML)

### Risk: Completion Overlap
- **Issue**: Both HTML and Twig completions may appear simultaneously
- **Mitigation**: Twig completions only appear within Twig delimiters (`{{`, `{%`)
- **Severity**: Low (context-aware filtering)

### Trade-off: Extension Dependency
- `extensionDependencies` on `vscode.html-language-features` means our extension won't fully work if that extension is disabled
- Acceptable because the built-in HTML extension is almost never disabled

## Open Questions

None - all questions resolved during planning.
