# Proposal: Integrate Tree-sitter Semantic Tokens

## Change ID
`integrate-tree-sitter-tokens`

## Summary
Implement tree-sitter integration in the language server to provide actual semantic tokens for context-aware syntax highlighting. The server currently declares semantic token capability but returns empty tokens. This change adds web-tree-sitter loading, document parsing, node-to-token mapping, and syntax tree caching.

## Motivation
The language server declares `semanticTokensProvider` capability but currently returns `{ data: [] }`. This means:
- Users only get TextMate grammar highlighting (regex-based, limited context awareness)
- No differentiation between variables, properties, filters, and functions
- No foundation for future intelligent features (completions, hover, diagnostics)

Tree-sitter provides accurate, incremental parsing that enables:
- Context-aware token types (e.g., `user` as variable vs `name` as property in `user.name`)
- Fast incremental updates when editing
- A syntax tree foundation for completions, hover, and diagnostics

## Scope

### In Scope
- Load `web-tree-sitter` and the `tree-sitter-twig.wasm` module at server startup
- Parse documents on open/change using tree-sitter
- Map tree-sitter node types to LSP semantic token types
- Cache syntax trees per document for efficient re-parsing
- Support incremental parsing for edit operations

### Out of Scope
- Completions, hover, or diagnostics (future changes)
- Grammar enhancements (handled separately if needed)
- Performance optimizations beyond basic caching (premature)

## Dependencies
- Existing `@twig-sense/tree-sitter-twig` package with WASM build
- Existing language server with document sync and semantic token declaration

## Spec Deltas
- **language-server**: MODIFIED requirements for Tree-sitter Integration (adds implementation detail scenarios)

## Risk Assessment
- **Low**: web-tree-sitter is mature and widely used
- **Medium**: WASM loading path resolution across different runtime environments
- **Mitigation**: Use `__dirname` resolution and test in VSCode extension host

## Success Criteria
1. Semantic tokens returned for all Twig constructs (variables, properties, filters, keywords, strings, numbers, comments)
2. Tokens visible in VSCode with semantic highlighting enabled
3. Tree-sitter tests continue to pass
4. Language server builds and runs without errors
