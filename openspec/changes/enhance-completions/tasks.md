# Phase 1: Documentation & Same-File Extraction

## 1. Documentation Enhancement

- [x] 1.1 Create `completion-docs.ts` with markdown documentation for all Twig built-ins
- [x] 1.2 Add `documentation` field to all filter completion items
- [x] 1.3 Add `documentation` field to all function completion items
- [x] 1.4 Add `documentation` field to all keyword completion items
- [x] 1.5 Add `documentation` field to all test completion items

## 2. Configuration

- [x] 2.1 Add `twig-sense.completion.templateRoot` setting (default: `templates`)
- [x] 2.2 Document setting in README

## 3. Variable Completions

- [x] 3.1 Extract `{% set %}` variable names from document using Tree-sitter
- [x] 3.2 Extract `{% for item in items %}` loop variables from document
- [x] 3.3 Add variable completions in output (`{{ }}`) and block (`{% %}`) contexts
- [x] 3.4 Add `loop` variable completions (`loop.index`, `loop.first`, etc.) when inside `for` blocks
- [x] 3.5 Add unit tests for variable completions

## 4. Macro Completions (Same-File)

- [x] 4.1 Extract `{% macro %}` definitions from current document
- [x] 4.2 Provide macro completions with parameter snippets
- [x] 4.3 Add unit tests for macro completions

## 5. Block Name Completions (Same-File)

- [x] 5.1 Extract `{% block %}` names from current document
- [x] 5.2 Provide block name completions in `{% block %}` and `{{ block() }}` contexts
- [x] 5.3 Prioritize `parent()` when inside a block definition
- [x] 5.4 Add unit tests for block name completions

# Phase 2: Context-Aware Tag Completions

## 6. Grammar Enhancement

- [x] 6.1 Update Tree-sitter grammar to capture block nesting structure
- [x] 6.2 Regenerate parser and update tests

## 7. Scope-Aware Completions

- [x] 7.1 Implement scope tracking to detect current block context (for/if/block/macro/etc.)
- [x] 7.2 Filter `end*` keywords to only show when inside corresponding block
- [x] 7.3 Add `else`/`elseif` completions only inside `if` blocks
- [x] 7.4 Add `else` for `{% for %}` (loop else)
- [x] 7.5 Add unit tests for context-aware tag completions
