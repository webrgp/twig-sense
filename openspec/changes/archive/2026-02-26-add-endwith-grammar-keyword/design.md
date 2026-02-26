## Context

The tree-sitter grammar (`packages/tree-sitter-twig/grammar.js`) defines all known Twig keywords in a `choice()` rule. The keyword `"with"` is present but `"endwith"` is absent. This means the parser cannot produce a `keyword("endwith")` node when encountering `{% endwith %}` — it will instead produce an `ERROR` node or fail to capture the text as a keyword.

The language server's `extractScopedBlocks()` in `document-analyzer.ts` walks `keyword` children of `statement_block` nodes to pair opening and closing block tags. Without `"endwith"` in the grammar, the function will never see it, making `with`/`endwith` pairing impossible.

## Goals / Non-Goals

**Goals:**

- Add `"endwith"` to the grammar's keyword choice so that `{% endwith %}` parses as a proper `statement_block` with a `keyword("endwith")` child node
- Regenerate the WASM binary to include the grammar change
- Verify correct parsing before any downstream changes depend on it

**Non-Goals:**

- Adding `with`/`endwith` to the language server's `BLOCK_PAIRS` map (that belongs to a separate change)
- Any diagnostic functionality
- Modifying any other keyword definitions

## Decisions

### Decision 1: Add only `"endwith"` to the keyword list

**Choice:** Add `"endwith"` as a new entry in the existing keyword `choice()` rule, alongside the other `end*` keywords.

**Alternatives considered:**

- **Batch add multiple missing keywords:** Could audit for other missing `end*` keywords. However, `endwith` is the only confirmed gap. Adding speculative keywords risks unintended parser behavior.

**Rationale:** Minimal, targeted fix. The grammar already has the pattern established (e.g., `"endif"`, `"endfor"`, `"endblock"`). Adding `"endwith"` follows the exact same pattern with zero risk to existing parsing.

## Risks / Trade-offs

**[Risk] WASM binary regeneration may fail or produce different results on different environments**
→ Mitigation: The project already has a regeneration workflow. Follow the existing process.

**[Risk] Adding a keyword could theoretically affect parsing of other constructs**
→ Mitigation: Keywords are in a flat `choice()` — adding one new string literal has no interaction with other alternatives. Tree-sitter handles this correctly.
