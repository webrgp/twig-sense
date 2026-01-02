# Proposal: Add Inline Comments Validation

## Change ID

`add-inline-comments-validation`

## Summary

Implement validation and diagnostic warnings for invalid inline comment usage, specifically detecting when closing delimiters (`}}` or `%}`) appear on the same line as an inline comment, which causes the delimiter to be consumed by the comment.

## Motivation

Twig's inline comment syntax has a known limitation: comments extend to the end of the line, so closing delimiters on the same line become part of the comment:

```twig
{{ "Hello"|upper # comment }}  ❌ Invalid - }} is part of comment
```

Currently, twig-sense:

- Allows this invalid syntax without warning
- Users discover the issue only at runtime
- No guidance on how to fix the problem
- Poor developer experience for those learning inline comments

Adding validation provides:

- Immediate feedback when writing invalid inline comments
- Clear diagnostic messages explaining the issue
- Code actions to auto-fix by moving delimiter to next line (future)
- Better alignment with Twig's actual behavior

## Scope

### In Scope

- Detect inline comments on same line as closing delimiters (`}}`, `%}`)
- Generate diagnostic warning with clear message
- Add tests for various invalid inline comment patterns
- Handle both single-line and multi-line expressions with inline comments
- Performance: validate only changed regions when possible

### Out of Scope

- Code actions to auto-fix (future enhancement)
- Validation of other comment-related issues (e.g., unclosed comments)
- Detection of inline comments in embedded HTML/JS/CSS (complex, low value)
- Configurable severity levels (warning is appropriate)

## Dependencies

- Phase 1: `add-inline-comments-grammar` (parsing inline comments)
- Existing diagnostic infrastructure in language server
- Tree-sitter API for node traversal and position information

## Spec Deltas

- **language-server**: ADDED requirements for Inline Comment Validation

## Risk Assessment

- **Low**: Diagnostic generation is well-established in language server
- **Low**: Tree-sitter provides accurate position information
- **Medium**: False positives if delimiter pattern appears elsewhere (e.g., in strings)
- **Mitigation**: Only validate within inline_comment nodes and check actual delimiter tokens

## Success Criteria

1. Diagnostic warning appears for inline comment with same-line closing delimiter
2. Warning includes clear message explaining the issue
3. Warning points to the inline comment node location
4. No false positives (e.g., `}}` in strings doesn't trigger warning)
5. All validation tests pass
6. No performance degradation on large files
