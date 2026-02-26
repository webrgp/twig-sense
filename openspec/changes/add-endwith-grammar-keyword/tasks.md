## 0. Grammar Fix

- [ ] 0.1 Add `"endwith"` to the keyword choice in `packages/tree-sitter-twig/grammar.js` (place it alongside other `end*` keywords like `"endif"`, `"endfor"`, `"endblock"`)
- [ ] 0.2 Regenerate the tree-sitter WASM binary after the grammar change
- [ ] 0.3 Write a test or manual verification that `{% with %}...{% endwith %}` parses correctly — both `with` and `endwith` should appear as `keyword` nodes inside their respective `statement_block` nodes
