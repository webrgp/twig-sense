# Proposal: Add Inline Comments Grammar Support

## Change ID

`add-inline-comments-grammar`

## Summary

Implement Tree-sitter grammar support for Twig 3.15 inline comments (`#`) within expressions and statements. Inline comments start with `#` and continue to the end of the line, providing a way to annotate code within `{{ }}` and `{% %}` blocks.

## Motivation

Twig 3.15 introduced inline comments as a more convenient way to document code within expressions and statements. Currently, twig-sense:

- Does not recognize `#` as a comment delimiter inside expressions
- Treats `#` as a regular character, causing parse errors or incorrect highlighting
- Provides no way for users to leverage this modern Twig feature

This change adds the foundation for inline comment support by updating the Tree-sitter grammar, enabling:

- Proper parsing of templates with inline comments
- Foundation for syntax highlighting (Phase 2)
- Accurate semantic token generation
- Better developer experience for Twig 3.15+ users

## Scope

### In Scope

- Add `inline_comment` rule to Tree-sitter grammar
- Update grammar to recognize `#` as comment start within expressions
- Handle newline-delimited comment parsing
- Add comprehensive test cases in corpus
- Rebuild parser and WASM module
- Update unit tests to cover inline comment parsing

### Out of Scope

- TextMate grammar updates (Phase 2)
- Semantic token highlighting (already works via Tree-sitter)
- Validation/diagnostics for same-line `}}` restriction (future enhancement)
- Support for block comments (already implemented)

## Dependencies

- Existing `@twig-sense/tree-sitter-twig` package
- Tree-sitter CLI for grammar compilation
- Current grammar.js foundation

## Spec Deltas

- **syntax-highlighting**: ADDED requirements for Inline Comment Grammar Support

## Risk Assessment

- **Low**: Tree-sitter handles token-based parsing well
- **Low-Medium**: Newline handling with `extras: [/\s/]` may need special treatment
- **Mitigation**: Use `token()` wrapper and explicit newline matching

## Success Criteria

1. Grammar successfully parses all valid inline comment examples from Twig docs
2. Inline comments generate `inline_comment` nodes in syntax tree
3. Parser does not treat `#` inside strings as comment start
4. All corpus tests pass
5. Unit tests verify inline comment parsing behavior
6. WASM module rebuilds without errors
