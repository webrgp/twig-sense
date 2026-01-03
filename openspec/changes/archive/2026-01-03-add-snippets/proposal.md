# Proposal: Add Twig Snippets

## Summary

Add comprehensive code snippets for Twig templates through two complementary mechanisms:

1. **VS Code native snippets** - JSON-based snippets triggered via Tab completion
2. **Enhanced LSP completions** - Multi-line snippet completions in the language server

Both approaches use natural names (e.g., `for`, `if`, `block`) for intuitive discovery.

## Motivation

Currently, the extension provides single-line completion snippets via LSP (e.g., `if ${1:condition}`). However, users frequently need complete block structures like:

```twig
{% for item in items %}
    {{ item }}
{% endfor %}
```

Typing these structures manually is tedious and error-prone. Snippets dramatically improve productivity by:

- Inserting complete block structures with proper indentation
- Providing tab-stop navigation between editable placeholders
- Offering common patterns (e.g., `for/else` for empty collections)

## Scope

### In Scope

- VS Code native snippets file (`snippets/twig.json`)
- Enhanced multi-line LSP completion snippets
- Control structures: `if`, `if/else`, `if/elseif/else`, `for`, `for/else`
- Template inheritance: `extends`, `block`, `embed`
- Includes: `include`, `import`, `from`
- Definitions: `macro`, `set`, `set block`
- Utility blocks: `autoescape`, `spaceless`, `verbatim`, `apply`, `cache`, `with`, `sandbox`, `do`

### Out of Scope

- Framework-specific snippets (Craft CMS, Symfony) - deferred to future work
- User-customizable snippet definitions
- Snippet syncing across machines

## Approach

### VS Code Native Snippets

Create `packages/vscode/snippets/twig.json` with comprehensive snippets. Register in `package.json` via the `contributes.snippets` field. Use natural prefixes that align with Twig keywords. Use `\t` for indentation to respect user tab/space preferences.

### Enhanced LSP Completions

Update the language server's completion items to provide multi-line alternatives where appropriate. The LSP already supports `InsertTextFormat.Snippet` which enables multi-line snippets with placeholders.

### Deduplication Strategy

VS Code native snippets and LSP completions will coexist:

- **Native snippets**: Available everywhere, triggered by typing prefix + Tab
- **LSP completions**: Context-aware, only shown in appropriate contexts (e.g., `endif` only inside `if` blocks)

The natural name overlap is intentional - users can choose their preferred workflow.

## Success Criteria

1. All listed snippets are available via Tab completion
2. All listed snippets appear in LSP completions (where contextually appropriate)
3. Snippets use consistent placeholder ordering and naming
4. Multi-line snippets maintain proper indentation
5. Documentation describes available snippets

## Risks & Mitigations

| Risk                                  | Mitigation                                                                                                                         |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Duplicate suggestions confuse users   | LSP completions are context-aware; native snippets are always available. Users learn to use the approach that fits their workflow. |
| Performance impact from many snippets | Snippets are static definitions with negligible runtime cost                                                                       |
