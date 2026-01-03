# Change: Enhance Completions with Context-Awareness and Documentation

## Why

The current completions implementation provides static lists of Twig keywords, filters, functions, and tests. However, it lacks context-awareness (e.g., showing `endif` only after `if`), doesn't provide documentation for completions, and doesn't extract variables or macros from the current document. These enhancements would significantly improve the developer experience and bring the extension closer to parity with first-class language support.

## What Changes

### Phase 1: Documentation & Same-File Extraction

- Add markdown documentation to all completion items with examples and links to Twig docs
- Add variable completions extracted from `{% set %}` statements in the current document
- Add macro completions from `{% macro %}` definitions in the current document
- Add block name completions from `{% block %}` definitions in the current document
- Add loop variable completions (`loop.index`, `loop.first`, etc.) when inside `for` blocks
- Add configuration `twig-sense.completion.templateRoot` (default: `templates`) for future cross-file support

### Phase 2: Context-Aware Tag Completions

- Add context-aware completions that filter suggestions based on current scope
- Only show `endfor` when inside a `for` loop, `endif` inside `if`, etc.
- Requires grammar enhancement to capture block nesting structure

## Non-Goals (Deferred)

- **Cross-file completions**: Resolving `{% import %}`, `{% extends %}` to parse other template files (see DEFERRED.md)
- **Workspace-wide variable discovery**: Scanning all templates for global variables
- **Framework-specific completions**: Craft CMS or Symfony custom tags/filters

## Impact

- Affected specs: `language-server`
- Affected code: `packages/language-server/src/completions.ts`
- New files: `packages/language-server/src/completion-docs.ts` (documentation definitions)
