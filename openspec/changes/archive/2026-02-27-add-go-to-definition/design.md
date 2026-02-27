## Context

The language server uses a provider-based architecture where each LSP feature implements `FeatureProvider` and registers with a `ProviderRegistry`. Providers receive a `ProviderContext` containing `connection` and `documents` (the `DocumentManager`). Documents are parsed with tree-sitter into cached syntax trees.

Currently, `ProviderContext` has no concept of the workspace filesystem. Providers can access document content and parsed trees, but cannot resolve paths relative to the workspace root. Go to Definition requires this capability.

The tree-sitter grammar parses `{% include "path.twig" %}` as a flat `statement_block` with children: `keyword("include")`, `string("path.twig")`. There is no dedicated `include_statement` node type.

Configuration currently uses `completion.templateRoot` for the template root directory. This setting is defined but not yet consumed at runtime, making it safe to rename.

## Goals / Non-Goals

**Goals:**

- Ctrl+click / F12 on a template path string in `{% include "..." %}` navigates to the file
- Support paths with and without file extensions (`"header"` and `"header.twig"` both resolve)
- Configurable template root directory and file extension
- Clean config namespace (`templates.*`) that serves both completion and definition features
- Everything at the language server level -- no editor-specific code

**Non-Goals:**

- Dynamic paths with concatenation (`"partials/" ~ name ~ ".twig"`)
- Array syntax (`["page.twig", "fallback.twig"]`)
- The `include()` function form (`{{ include("...") }}`)
- Other tags (`extends`, `embed`, `import`, `from`, `use`) -- natural follow-ups but not this change
- Template file indexing or filesystem watching
- Multi-root workspace support beyond trying each workspace folder

## Decisions

### 1. Widen `ProviderContext` with `workspaceFolders`

**Decision**: Add `workspaceFolders: WorkspaceFolder[]` to `ProviderContext`.

**Rationale**: Providers need workspace root paths to resolve template references. `ProviderContext` is the established mechanism for passing shared dependencies to providers. This is the smallest change that makes workspace information available to any provider that needs it.

**Alternatives considered**:

- Put it on `DocumentManager` -- concentrates too much responsibility; document management and workspace topology are separate concerns.
- New `WorkspaceContext` abstraction -- premature; we just need the folder list right now.

**Capture**: `server.ts` reads `params.workspaceFolders` in `onInitialize`. Falls back to constructing a single-entry list from `params.rootUri` for older clients. Stored and passed to `registry.initializeAll()`.

### 2. Config namespace: `templates.root` and `templates.fileExtension`

**Decision**: Replace `completion.templateRoot` with `templates.root` (default: `"templates"`) and add `templates.fileExtension` (default: `".twig"`).

**Rationale**: Template path resolution is a cross-cutting concern used by completion and definition (and likely more features later). The `completion.*` namespace was a historical accident of where the setting was first needed.

**Alternatives considered**:

- Keep `completion.templateRoot` and add `templates.fileExtension` separately -- splits related config across namespaces.
- Add `fileExtension` under `completion` -- perpetuates the wrong namespace.

**Breaking change**: Acceptable pre-1.0. No runtime code currently reads `completion.templateRoot`, so only user settings and the VSCode schema are affected.

### 3. AST traversal: find string node inside include statement_block

**Decision**: On `textDocument/definition`, find the deepest node at the cursor position. Walk up to check if it's a `string` node inside a `statement_block` whose first `keyword` child is `include`.

**Rationale**: The tree-sitter grammar uses a flat `statement_block` structure for all tags. There's no `include_statement` node type to match on directly. Walking up from the cursor position and checking the keyword child is the simplest reliable approach.

**Pattern**:

```
node = tree.rootNode.descendantForPosition(cursor)
if node.type === "string" && node.parent.type === "statement_block":
    keyword = parent.children.find(c => c.type === "keyword")
    if keyword.text === "include":
        templatePath = stripQuotes(node.text)
```

### 4. Path resolution: exact match, then append extension

**Decision**: Given a template path string, try resolving in order:

1. `workspaceFolder / templates.root / path` (exact)
2. `workspaceFolder / templates.root / path + templates.fileExtension` (appended, only if path doesn't already end with the extension)

First match wins. Try each workspace folder in order.

**Rationale**: Users write both `{% include "header.twig" %}` and `{% include "header" %}`. The Twig engine resolves both. Trying exact first avoids double-appending extensions. Skipping step 2 when the extension is already present prevents checking for `header.twig.twig`.

### 5. File existence: synchronous `fs.existsSync`

**Decision**: Use `fs.existsSync` for checking if the resolved path exists on disk.

**Rationale**: This runs on user-initiated actions (Ctrl+click / F12), not on every keystroke. A single `stat` syscall per resolution attempt is negligible. No need for caching, indexing, or async complexity.

**Alternatives considered**:

- Pre-index template files with a filesystem watcher -- overkill for this scope; adds complexity for no measurable benefit.
- Async `fs.access` -- unnecessary since the handler can be synchronous for this use case (LSP handlers support both sync and async return).

### 6. Definition target: line 0, column 0 of the resolved file

**Decision**: Return `Location { uri, range: { start: {0,0}, end: {0,0} } }`.

**Rationale**: The definition target is the file itself, not a specific symbol within it. Jumping to the top of the file is the standard behavior for file-level definitions. This matches what other template language extensions do.

## Risks / Trade-offs

**[Flat AST structure]** The grammar doesn't distinguish `include` from other keywords in `statement_block`. If the grammar changes to add dedicated node types, the traversal logic would need updating. → Low risk; the grammar is stable and any change would be additive.

**[Breaking config change]** Users with `twig-sense.completion.templateRoot` lose their setting silently. → Pre-1.0, small user base. Document in changelog. The default value (`"templates"`) covers most users.

**[No dynamic path support]** Users who heavily use concatenation or variables in includes won't get navigation. → Clearly scoped as non-goal. The feature degrades gracefully (nothing happens on Ctrl+click). Can be revisited with heuristic matching later.

**[Single extension]** `templates.fileExtension` is a single string, not an array. Projects mixing `.twig` and `.html.twig` would need to pick one. → Start simple. Can be expanded to an array later if needed without breaking the single-string case.
