# VS Code Twig Extension — Features

This document defines the complete feature set required to make a **first‑class VS Code extension for the Twig template language**. The focus is on correctness, performance, trust, and real‑world usability in large projects.

---

## 1. Core Language Experience

### Language Definition

- `.twig` file association
- Comment handling (`{# #}`)
- Auto‑closing pairs for:
  - `{{ }}`
  - `{% %}`
  - `{# #}`

- Smart indentation for nested Twig blocks
- Bracket matching across Twig and HTML boundaries

### Syntax Highlighting

- Accurate highlighting for:
  - Output expressions (`{{ ... }}`)
  - Control tags (`{% ... %}`)
  - Comments (`{# ... #}`)
  - Filters, tests, functions
  - Operators, strings, arrays, hashes

- Proper handling of:
  - Whitespace control (`{{-`, `-}}`, `{%-`, `-%}`)
  - Nested expressions
  - Inline expressions in HTML attributes

- No highlight bleeding on malformed templates
- Safe coexistence with HTML, CSS, and JavaScript

---

## 2. Parsing & AST Infrastructure

- Incremental document‑level parsing
- Error‑tolerant AST or CST generation
- Precise source ranges for all nodes
- Node types for all Twig constructs
- Parser reusable outside VS Code

---

## 3. Diagnostics & Validation

### High‑Confidence Diagnostics

- Mismatched block tags (`if/endif`, `for/endfor`, etc.)
- Unclosed tags
- Invalid tag placement
- Duplicate block or macro definitions
- Invalid include paths (when resolvable)

### Diagnostic Principles

- Conservative, trust‑first behavior
- No speculative or low‑confidence warnings
- Clear, actionable messages
- Fast incremental updates

---

## 4. Navigation

### Template Navigation

- Go to definition / peek for:
  - `include`
  - `extends`
  - `embed`
  - `import`
  - `from`

- Configurable template roots
- Relative and absolute path resolution
- Namespace and alias support (framework‑dependent)

### Symbol Navigation

- Go to definition / peek for:
  - `block`
  - `macro`

- Outline view symbols:
  - Blocks
  - Macros
  - Top‑level `set` statements

---

## 5. Workspace Indexing

### Indexing & Caching

- Incremental workspace index
- File watching with debounced re‑indexing
- Cached index with warm startup
- Safe fallback when index is unavailable

### Cross‑File Intelligence

- Find references for:
  - Macros
  - Blocks

- Safe rename support:
  - Macros
  - Blocks (only when unambiguous)

- Refusal over unsafe rename operations

---

## 6. Completions

### Context Awareness

- Completions scoped strictly to Twig regions
- Different completion behavior for:
  - `{{ }}` expressions
  - `{% %}` statements

- No completion noise in plain HTML

### Variable Scope Inference

- Loop variables
- `set` variables
- Macro parameters
- `with {}` object keys
- Imported macros

### Completion Quality

- Ranked results (local > imported > global)
- De‑duplication
- Accurate kinds and labels
- Inline documentation when available

---

## 7. Hover & Signature Help

- Hover documentation for:
  - Built‑in tags, filters, functions, tests
  - Custom symbols via framework adapters

- Signature help for:
  - Filters with arguments
  - Functions

- Concise, readable documentation

---

## 8. Formatting

### Formatter Behavior

- Idempotent formatting
- Preservation of Twig whitespace control syntax
- Stable indentation across HTML/Twig boundaries
- Configurable:
  - Indentation size
  - Line length
  - Attribute wrapping

- Format‑on‑save support
- Optional range formatting

---

## 9. Refactors & Code Actions

### Refactors

- Rename macro
- Rename block
- Extract macro
- Inline macro (safe cases only)

### Code Actions

- Add missing `end*` tags
- Normalize `import` / `from` usage
- Convert repeated patterns to macros
- Quick fixes for diagnostics

---

## 10. Framework Integrations

### Adapter Architecture

- Pluggable framework adapters
- Opt‑in per project
- Reloadable metadata

### Craft CMS

- Template roots and aliases
- Craft globals
- Craft filters, functions, and tests
- Manifest‑based symbol loading

### Symfony / Twig Bundle

- Namespace‑aware template resolution
- Project‑defined Twig extensions
- Bundle‑aware include paths

---

## 11. Multi‑Language Awareness

- HTML as host language
- Twig‑aware selection expansion
- Respect `<script>` and `<style>` blocks
- No cross‑language completion pollution
- Support for inline Twig in attributes

---

## 12. Commands & UX

### Commands

- Go to template
- Reindex workspace
- Reload framework metadata
- Show resolved template path

### UX Principles

- Minimal configuration with strong defaults
- Clear error reporting
- Predictable, discoverable behavior

---

## 13. Performance & Stability

- No blocking work on the UI thread
- Incremental parsing and indexing
- Graceful degradation on errors
- Automatic server recovery
- Handles large workspaces (thousands of templates)

---

## 14. Testing & Quality

- Golden tests for highlighting and formatting
- Unit tests for parser, indexing, and resolution
- Integration tests for LSP features
- Real‑world project fixtures

---

## 15. Developer Experience

- Clear separation of parser, server, and adapters
- Debug commands (AST viewer, index stats)
- Structured logging
- Easy issue reporting with diagnostics bundle

---

## Non‑Goals

- Runtime execution or rendering of Twig
- Full static type system
- Live template preview or evaluation
