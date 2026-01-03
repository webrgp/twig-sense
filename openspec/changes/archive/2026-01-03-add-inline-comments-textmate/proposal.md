# Proposal: Add Inline Comments TextMate Grammar

## Change ID

`add-inline-comments-textmate`

## Summary

Update the TextMate grammar to provide syntax highlighting for inline comments (`#`) within Twig expressions and statements. This builds on the Tree-sitter grammar support added in Phase 1 to provide immediate visual feedback in the editor.

## Motivation

With Tree-sitter grammar parsing inline comments (Phase 1), users can write valid Twig 3.15 code without parse errors. However:

- VSCode uses TextMate grammars for initial syntax highlighting before semantic tokens load
- Inline comments currently appear as regular code, not as comments
- Users don't get visual distinction between code and comments until semantic tokens apply
- Poor user experience for users who prefer TextMate highlighting or have semantic tokens disabled

TextMate grammar support provides:

- Immediate visual feedback when typing inline comments
- Consistent highlighting for users who disable semantic tokens
- Better integration with VSCode themes (comment colors)
- Graceful fallback when language server is unavailable

## Scope

### In Scope

- Add inline comment pattern to `twig.tmLanguage.json`
- Apply comment scope to lines starting with `#` within expressions
- Test highlighting in VSCode with various themes
- Update test fixtures to include inline comment examples
- Document inline comment support in README

### Out of Scope

- Tree-sitter grammar (completed in Phase 1)
- Semantic token generation (already works via Tree-sitter nodes)
- Validation/diagnostics for invalid inline comment usage
- Embedded language highlighting within inline comments

## Dependencies

- Phase 1: `add-inline-comments-grammar` must be completed
- Existing TextMate grammar in `packages/vscode/syntaxes/twig.tmLanguage.json`
- VSCode TextMate grammar system

## Spec Deltas

- **syntax-highlighting**: ADDED requirements for Inline Comment TextMate Highlighting

## Risk Assessment

- **Low**: TextMate patterns are straightforward regex-based
- **Low**: Adding comment pattern unlikely to conflict with existing patterns
- **Mitigation**: Test with various theme combinations to ensure proper scoping

## Success Criteria

1. Inline comments appear with comment styling in VSCode
2. Highlighting works with both light and dark themes
3. Comments are visually distinct from code
4. Highlighting appears immediately as user types
5. Test fixtures demonstrate proper highlighting
6. No regressions in existing TextMate highlighting
