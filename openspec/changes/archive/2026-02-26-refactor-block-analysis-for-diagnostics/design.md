## Context

The language server's `document-analyzer.ts` already contains `extractScopedBlocks()`, a stack-based function that pairs opening Twig block tags (`{% if %}`, `{% for %}`, etc.) with their closing counterparts (`{% endif %}`, `{% endfor %}`, etc.). It uses a `BLOCK_PAIRS` map and a splice-based stack search to handle nested structures. Currently this function serves only scope detection for completions — unclosed blocks get `endLine: maxEndLine + 1000` as a fallback, orphan closers are silently ignored, and no diagnostics are produced.

The tree-sitter grammar is deliberately flat: every `{% ... %}` is a `statement_block` node with a `keyword` child. Opening and closing tags are NOT distinct node types — the distinction is made by keyword text (e.g., `"if"` vs `"endif"`). There is no paired node structure in the grammar, so all structural validation must happen in the language server.

**Pre-existing bug in `extractScopedBlocks`:** The function currently pushes every `set` keyword onto the stack unconditionally (including inline `{% set x = 1 %}`). This is invisible today because unclosed blocks only affect scope detection (the fallback `endLine: maxEndLine + 1000` acts as "extends to end of document"). But once diagnostics are wired (in a subsequent change), every inline set will produce a false "Unclosed {% set %}" warning. The inline set heuristic must be implemented and tested in THIS change, before any diagnostic output is wired.

## Goals / Non-Goals

**Goals:**

- Detect unclosed block tags (openers left on stack after full document walk)
- Detect orphan closing tags (closers with no matching opener)
- Detect cross-nesting anomalies (when a closer matches an opener by skipping over intermediate open blocks)
- Validate mid-block keywords (`else` and `elseif`) appear only inside their valid parent blocks, checking the innermost (stack top) block only
- Distinguish inline `{% set x = 1 %}` from block-form `{% set content %}...{% endset %}` to avoid false unclosed warnings
- Add `with`/`endwith` to `BLOCK_PAIRS` and `"with"` to the `BlockType` union
- Maintain backward compatibility for `getScopeAtPosition()` and all existing scope-dependent features
- Produce all data needed for future LSP diagnostics without depending on LSP types

**Non-Goals:**

- Creating LSP `Diagnostic[]` objects (deferred to `wire-block-tag-diagnostics` change)
- Configuration toggles or VSCode extension changes
- Wiring into `DiagnosticsProvider`
- Validating expression correctness inside tags
- Cross-file validation
- `endblock name` validation

## Decisions

### Decision 1: Splice-based matching with anomaly detection

**Choice:** Keep the existing splice-based stack search (find matching opener anywhere in stack, not just top) and ADD detection of "crossed" items when a splice skips over intermediate blocks.

**Alternatives considered:**

- **Strict top-only matching:** Only match closers against the stack top. Produces less intuitive errors for the common "forgot an endif" case — would report a mismatch instead of pointing at the specific unclosed block.
- **Two-pass approach:** First pass for pairing, second pass for overlap detection. Correct but unnecessarily complex.

**Rationale:** The splice approach naturally handles the most common real-world bug (forgetting a closing tag in a nested context) by pointing directly at the unclosed block. When a splice skips items, those "crossed" items are the anomalies — blocks that should have been closed before the outer block was closed.

### Decision 2: Extend `extractScopedBlocks` rather than create parallel function

**Choice:** Refactor `extractScopedBlocks()` to return a `TagAnalysisResult` containing both the existing `scopedBlocks: ScopedBlockInfo[]` array AND new diagnostic data.

**Alternatives considered:**

- **New standalone function:** Separate `analyzeTagPairing()` function that duplicates the walk logic. Avoids touching existing code but leads to duplicated logic and two full-document walks.

**Rationale:** The pairing logic IS the scope detection logic. Splitting them means maintaining two copies of the same algorithm. The extended return type is backward-compatible — `getScopeAtPosition` just destructures `.scopedBlocks` from the result.

### Decision 3: Inline `set` heuristic via `=` operator

**Choice:** When encountering a `set` keyword, check if the `statement_block`'s named children contain an `operator` node with text `"="`. If yes, it's inline set (don't push to stack). If no, it's block-form set (push and expect `endset`).

**Rationale:** This matches Twig's own parser logic. `{% set x = 1 %}` always has an assignment operator. `{% set content %}...{% endset %}` never does — the name is followed directly by `%}`. The tree-sitter grammar reliably produces `operator("=")` nodes.

### Decision 4: Strict stack-top for mid-block validation

**Choice:** `else` and `elseif` are validated against the innermost (top of stack) open block only, not any block on the stack.

**Rationale:** Twig's actual parser requires `else`/`elseif` to be direct children of their parent `if`/`for` block. A `{% else %}` nested inside an intermediate `{% block %}` within an `{% if %}` is invalid even though the `if` is technically on the stack. Strict top-only matching catches these real bugs.

### Decision 5: Orphan closer detection limited to known block types

**Choice:** Only track orphan closers whose base keyword (text after `end`) is a known key in `BLOCK_PAIRS`. Unknown `end*` keywords (e.g., `{% enddeprecated %}`) are silently ignored.

**Rationale:** Twig framework extensions may define custom tags. Reporting every unknown `end*` keyword as an orphan closer would produce false positives. Limiting to known `BLOCK_PAIRS` values keeps the data focused on actionable issues.

## Risks / Trade-offs

**[Risk] Breaking `getScopeAtPosition` during refactor** — Changing the return type of `extractScopedBlocks` could break the scope detection chain used by completions.
→ Mitigation: The `scopedBlocks` array in the new return type contains identical data. `getScopeAtPosition` just destructures it. Existing tests for scope detection and completions will catch any regression.

**[Risk] Inline `set` heuristic fails on edge cases** — If someone writes `{% set %}` with no name and no `=`, we'd treat it as block-form. This is invalid Twig anyway, so a false "unclosed" warning is acceptable.
→ Mitigation: The heuristic covers all valid Twig syntax. Invalid syntax may produce imprecise results, which is expected behavior.

**[Risk] Nesting error data may not map cleanly to diagnostic messages** — The analysis data must be generic enough for LSP mapping but specific enough to be useful.
→ Mitigation: `TagLocation` captures keyword text, line, character, endLine, endCharacter — sufficient for any message format.
