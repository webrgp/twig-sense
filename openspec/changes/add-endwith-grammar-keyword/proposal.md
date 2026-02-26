## Why

The tree-sitter grammar for Twig defines `"with"` as a keyword but does NOT define `"endwith"`. This means `{% endwith %}` parses as an ERROR node instead of a proper `statement_block` with a `keyword` child. This blocks any future structural validation of `with`/`endwith` blocks (e.g., unclosed tag diagnostics) and causes the language server's `extractScopedBlocks()` to never see `endwith` keywords — every `{% with %}` block would produce false unclosed warnings once block-tag diagnostics are wired.

## What Changes

- Add `"endwith"` to the keyword choice in `packages/tree-sitter-twig/grammar.js`
- Regenerate the tree-sitter WASM binary after the grammar change
- Verify `{% with %}...{% endwith %}` parses correctly (keyword nodes for both) before proceeding

## Capabilities

### New Capabilities

_(none — this is a grammar-level fix with no new spec-level capability)_

### Modified Capabilities

_(none — no existing spec-level requirements change; this enables future work)_

## Impact

- `packages/tree-sitter-twig/grammar.js` — Add `"endwith"` to keyword choice
- `packages/tree-sitter-twig` WASM binary — Must be regenerated after grammar change
- Prerequisite for future `with`/`endwith` block pairing in the language server
