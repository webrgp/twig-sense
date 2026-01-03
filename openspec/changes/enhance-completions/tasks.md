# Phase 1: Documentation & Same-File Extraction

## 1. Documentation Enhancement

- [ ] 1.1 Create `completion-docs.ts` with markdown documentation for all Twig built-ins
- [ ] 1.2 Add `documentation` field to all filter completion items
- [ ] 1.3 Add `documentation` field to all function completion items
- [ ] 1.4 Add `documentation` field to all keyword completion items
- [ ] 1.5 Add `documentation` field to all test completion items

## 2. Configuration

- [ ] 2.1 Add `twig-sense.completion.templateRoot` setting (default: `templates`)
- [ ] 2.2 Document setting in README

## 3. Variable Completions

- [ ] 3.1 Extract `{% set %}` variable names from document using Tree-sitter
- [ ] 3.2 Extract `{% for item in items %}` loop variables from document
- [ ] 3.3 Add variable completions in output (`{{ }}`) and block (`{% %}`) contexts
- [ ] 3.4 Add `loop` variable completions (`loop.index`, `loop.first`, etc.) when inside `for` blocks
- [ ] 3.5 Add unit tests for variable completions

## 4. Macro Completions (Same-File)

- [ ] 4.1 Extract `{% macro %}` definitions from current document
- [ ] 4.2 Provide macro completions with parameter snippets
- [ ] 4.3 Add unit tests for macro completions

## 5. Block Name Completions (Same-File)

- [ ] 5.1 Extract `{% block %}` names from current document
- [ ] 5.2 Provide block name completions in `{% block %}` and `{{ block() }}` contexts
- [ ] 5.3 Prioritize `parent()` when inside a block definition
- [ ] 5.4 Add unit tests for block name completions

# Phase 2: Context-Aware Tag Completions

## 6. Grammar Enhancement

- [ ] 6.1 Update Tree-sitter grammar to capture block nesting structure
- [ ] 6.2 Regenerate parser and update tests

## 7. Scope-Aware Completions

- [ ] 7.1 Implement scope tracking to detect current block context (for/if/block/macro/etc.)
- [ ] 7.2 Filter `end*` keywords to only show when inside corresponding block
- [ ] 7.3 Add `else`/`elseif` completions only inside `if` blocks
- [ ] 7.4 Add `else` for `{% for %}` (loop else)
- [ ] 7.5 Add unit tests for context-aware tag completions
