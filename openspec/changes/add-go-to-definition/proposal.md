## Why

The language server provides completions, diagnostics, and semantic tokens, but no navigation support. Go to Definition is the next high-value feature -- it lets users Ctrl+click (or F12) on a template path in `{% include "..." %}` to jump directly to that file. This is one of the most-requested capabilities in template tooling and a natural complement to the existing completion support.

Starting with `include` as the first target, scoped to static string paths.

## What Changes

- **BREAKING**: Configuration namespace `twig-sense.completion.templateRoot` moves to `twig-sense.templates.root`. A new `twig-sense.templates.fileExtension` setting is added (default: `.twig`).
- New `DefinitionProvider` in the language server that handles `textDocument/definition` requests.
- `ProviderContext` is widened to include `workspaceFolders` so providers can resolve file paths.
- `server.ts` captures `InitializeParams.workspaceFolders` (with `rootUri` fallback) and passes it through to providers.
- Template path resolution: tries exact path first, then appends the configured file extension if the path doesn't already end with it.

## Capabilities

### New Capabilities

- `go-to-definition`: LSP definition provider that resolves template paths in `{% include %}` tags to files on disk. Covers static string paths only (not dynamic expressions, arrays, or the function form).

### Modified Capabilities

- `language-server`: Configuration shape changes -- `completion.templateRoot` replaced by `templates.root` and `templates.fileExtension`. Server capabilities updated to declare `definitionProvider`. `ProviderContext` widened with `workspaceFolders`.

## Impact

- **Config (breaking)**: Users with `twig-sense.completion.templateRoot` in their settings must update to `twig-sense.templates.root`. Pre-1.0 so acceptable.
- **Language server**: New provider file, updated types, updated server initialization flow.
- **VSCode package.json**: Configuration schema updated to reflect new `templates.*` namespace.
- **Tests**: New tests for definition provider. Existing config tests updated for new shape.
- **No client-side code changes**: The LSP client automatically negotiates definition support from server capabilities.
