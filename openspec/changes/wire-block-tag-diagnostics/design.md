## Context

The core block tag analysis in `document-analyzer.ts` has been refactored (in the `refactor-block-analysis-for-diagnostics` change) to produce rich structural data via `TagAnalysisResult`. This change is the thin integration layer that connects that data to the user-facing diagnostic experience.

The only existing validator is `inline-comments.ts` which checks for inline comment delimiter issues. The diagnostics pipeline (`DiagnosticsProvider`) runs validators on every parse event and pushes results via `connection.sendDiagnostics()`. This change follows the same pattern.

## Goals / Non-Goals

**Goals:**

- Create a validator that maps `TagAnalysisResult` diagnostic data to LSP `Diagnostic[]` objects
- All diagnostics at Warning severity (not Error)
- Configurable via `diagnostics.blockTags` setting (default: true)
- Master switch (`diagnostics.enabled`) overrides individual toggles
- Follow the existing validator pattern (`inline-comments.ts`)

**Non-Goals:**

- Modifying the core analysis logic (that's done in the prior change)
- Code actions / quick fixes for the diagnostics (future work)
- Narrowing diagnostic ranges to keyword-only (future refinement)

## Decisions

### Decision 1: Thin validator file, no analysis logic

**Choice:** Create `validators/block-tags.ts` with a `validateBlockTags(tree): Diagnostic[]` function that calls `extractScopedBlocks()` and maps results. No analysis logic in the validator.

**Alternatives considered:**

- **Inline the mapping in DiagnosticsProvider:** Less modular, breaks the established pattern.

**Rationale:** Keeps `document-analyzer.ts` free of LSP dependencies (it only uses `web-tree-sitter` types). The validator is a thin translation layer following the same pattern as `validators/inline-comments.ts`.

### Decision 2: Warning severity for all diagnostics

**Choice:** All block tag diagnostics use `DiagnosticSeverity.Warning`, not Error.

**Rationale:** The grammar is flat and we infer structure from keyword matching. While the algorithm is reliable, we can't be 100% certain about intent in all edge cases. Framework extensions might inject custom tags that look like orphans. Warnings are less disruptive and build trust — we can escalate to errors later if confidence is established.

### Decision 3: Diagnostic range covers full `statement_block`

**Choice:** Diagnostic ranges cover the entire `statement_block` node. A future refinement could narrow the range to just the keyword node for a cleaner editor UX.

**Rationale:** Using the full `statement_block` is simpler to implement and consistent. Narrowing to the keyword node is a viable future improvement but not a blocker.

## Risks / Trade-offs

**[Risk] Double full-document walk on parse events** — Both `DiagnosticsProvider.validate()` and `getScopeAtPosition()` (via completions) call `extractScopedBlocks()` independently, resulting in two full tree walks within milliseconds on the same parse event.
→ Mitigation: Acceptable for initial implementation. If performance profiling shows this is a bottleneck for large files (10,000+ lines), cache the `TagAnalysisResult` per document and invalidate on parse. This optimization is deferred.

**[Risk] False positives on framework-injected tags** — Some frameworks (Craft CMS, Symfony) add custom tags that our `BLOCK_PAIRS` map doesn't know about.
→ Mitigation: Warning severity (not Error), configurable toggle, and framework adapter support is planned for a future phase.
