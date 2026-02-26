# Adversarial Audit: refactor-block-analysis-for-diagnostics

**Auditor**: Devil's Advocate (OpenSpec)  
**Date**: 2026-02-26  
**Fragility Score**: 5/10

---

## Methodology

1. Read all change artifacts (proposal, design, spec, tasks, tests)
2. Read the full implementation in `document-analyzer.ts` (lines 462-596)
3. Traced every spec scenario through the code by hand
4. Ran the tree-sitter grammar against edge case inputs to observe actual parse output
5. Ran the full test suite (33/33 pass, with one console.warn)
6. Cross-referenced with downstream consumer (`wire-block-tag-diagnostics`)

---

## 🔴 CRITICAL FINDINGS

### Finding C1: `endwith` Grammar Not Recognized — Silent Behavioral Regression

**Severity**: 🔴 Critical  
**Category**: Stale WASM Binary / Spec Violation

The `add-endwith-grammar-keyword` change was archived as complete (all tasks checked), but **the WASM binary was never regenerated**. Evidence:

- `grammar.js` last modified: Feb 25, 19:42
- `tree-sitter-twig.wasm` last modified: Feb 25, 17:26 (2+ hours BEFORE the grammar change)

**Grammar parse output for `{% endwith %}`:**

```
statement_block ["{% endwith %}"]
  ERROR ["end"]        ← tree-sitter sees "end" as error recovery
  keyword ["with"]     ← the grammar falls back to recognizing "with" only
```

**What this means for `extractScopedBlocks`:**

When the function encounters `{% endwith %}`, `walkStatementBlocks` yields the statement_block. Its `namedChildren` contain an `ERROR` node (text "end") and a `keyword` node (text "with"). The function's inner loop only processes children with `child.type === "keyword"`. So it sees `text === "with"`:

1. `"with"` is NOT in `MID_BLOCK_RULES` → skipped
2. `"with"` IS in `BLOCK_PAIRS` → **pushed as a NEW opener onto the stack**

**Result**: `{% with %}...{% endwith %}` produces:

- Stack gets `with` pushed at the `{% with %}` line
- Stack gets a SECOND `with` pushed at the `{% endwith %}` line (misinterpreted as an opener)
- Neither is matched → **both end up in `unclosed[]`** instead of being paired
- Both get added to `scopedBlocks` with `maxEndLine + 1000`

**Spec scenarios violated:**

- "with/endwith pairing → no unclosed" — **FAILS** (2 unclosed entries)
- "Clean template" with with/endwith — **FAILS**

**The test "works" only because it has a conditional escape hatch** (test line 343-353): if `unclosed.length > 0`, it logs a warning and doesn't fail. This is effectively `test.skip` disguised as a passing test.

**Recommendation**: Regenerate the WASM binary. The grammar.js change is correct; only the build step was skipped.

---

### Finding C2: `endwith` Misparse Creates False `with` Opener — Cascading Stack Corruption

**Severity**: 🔴 Critical  
**Category**: Bug

This is a consequence of C1 but worth calling out separately. Because `{% endwith %}` is parsed as `keyword("with")`, it **corrupts the pairing stack for everything after it**. In a real template:

```twig
{% with %}
  {% if condition %}
    {{ foo }}
  {% endif %}
{% endwith %}
{% block content %}
  hello
{% endblock %}
```

The stack state progression would be:

1. `{% with %}` → push `with` (stack: [`with`])
2. `{% if %}` → push `if` (stack: [`with`, `if`])
3. `{% endif %}` → match `if`, pop (stack: [`with`])
4. `{% endwith %}` → parsed as `keyword("with")` → push ANOTHER `with` (stack: [`with`, `with`])
5. `{% block %}` → push `block` (stack: [`with`, `with`, `block`])
6. `{% endblock %}` → match `block`, pop (stack: [`with`, `with`])
7. End of file → **2 unclosed `with` entries** ← false positives

The downstream `wire-block-tag-diagnostics` change would surface **two false "Unclosed {% with %}" warnings** to the user. This is exactly the kind of false positive the design doc warns about.

---

### Finding C3: `enddeprecated` Is Not Silently Ignored — It Produces a Phantom `deprecated` Opener

**Severity**: 🔴 Critical  
**Category**: Bug

The spec says: _"Unknown end keyword (enddeprecated) → silently ignored, NOT in orphanClosers"_

The grammar parses `{% enddeprecated %}` as:

```
statement_block ["{% enddeprecated %}"]
  ERROR ["end"]
  keyword ["deprecated"]
```

The function sees `keyword("deprecated")`. It checks:

1. `"deprecated"` is NOT in `MID_BLOCK_RULES` → skipped
2. `"deprecated"` is NOT in `BLOCK_PAIRS` → skipped
3. `"deprecated"` does NOT start with `"end"` → skipped

**Result**: No orphan closer is produced (that part is correct). But `"deprecated"` is also NOT pushed to the stack (since it's not in `BLOCK_PAIRS`). So it is indeed silently ignored.

**Wait** — the test passes (test line 382-389). Let me re-verify... Yes, `"deprecated"` is not a key in `BLOCK_PAIRS`, so it's correctly skipped at the `text in BLOCK_PAIRS` check. The `text.startsWith("end")` branch is never reached because `"deprecated"` doesn't start with "end".

**REVISED**: This scenario is **correct by accident**. The code doesn't "silently ignore an unknown end\* keyword" — it sees `deprecated` (not `enddeprecated`) and treats it as an unrecognized non-block keyword. The test passes for the right outcome but the wrong reason. If the grammar were ever fixed to emit `keyword("enddeprecated")` as a single token, the code would then correctly hit the `text.startsWith("end")` → `openingType = "deprecated"` → `"deprecated" not in BLOCK_PAIRS` → `continue` path. So it works in both cases. **Downgraded to DESIGN CONCERN.**

---

## 🟡 CONCERNS

### Finding Y1: Splice Removes Matched Item AND All Items After It

**Severity**: 🟡 Concern  
**Category**: Logic Subtlety

Line 562: `stack.splice(matchIndex)` removes from `matchIndex` to end of array. This means the matched opener AND all "crossed" items above it are removed. The crossed items were already recorded as nesting errors (lines 551-558), so they don't leak into `unclosed`.

**Trace for "forgot endif inside for":**

- Stack before: [`for`@0, `if`@1]
- `endfor` arrives. matchIndex=0 (`for`).
- Cross loop: k=1 (stack[1]=`if`). Records nesting error: outer=`for`, inner=`if`, closer=`endfor`. ✅
- `stack.splice(0)` removes both `for` and `if`. Stack = [].
- `for`/`endfor` pair added to `scopedBlocks`. ✅
- `if` does NOT appear in `unclosed` because it was spliced. ✅ (It's in `nestingErrors` instead.)

**Trace for "swapped closers" (if-for-endif-endfor):**

- Stack: [`if`@0, `for`@1]
- `endif` arrives. matchIndex=0 (`if`).
- Cross loop: k=1 (stack[1]=`for`). Records nesting error: outer=`if`, inner=`for`, closer=`endif`. ✅
- `stack.splice(0)` removes both. Stack = [].
- `if`/`endif` pair added to `scopedBlocks`. ✅
- `endfor` arrives. Stack is empty. matchIndex=-1. → orphan closer. ✅

This is **correct** but the behavior means crossed-over items are NOT independently tracked in `unclosed[]`. They appear only in `nestingErrors[].inner`. The downstream diagnostic mapper must know to emit a diagnostic for `nestingErrors[].inner` — otherwise the user gets no warning about the unclosed `if` in the "forgot endif inside for" case.

**Risk**: If `wire-block-tag-diagnostics` only maps `unclosed[]` to diagnostics and ignores `nestingErrors[].inner`, users will silently lose warnings about the crossed blocks.

### Finding Y2: `maxEndLine` Is 0 for Empty Documents

**Severity**: 🟡 Concern  
**Category**: Edge Case

If a document is empty (no statement_blocks), `maxEndLine` stays 0. The `for` loop over `walkStatementBlocks` never executes. The stack remains empty. So unclosed blocks cannot exist. No issue in practice.

But if a document has a single `{% if %}` on line 0 with no closing tag:

- `maxEndLine = 0` (the statement_block's `endPosition.row` is 0)
- The unclosed `if` gets `endLine: 0 + 1000 = 1000`

This is fine — the fallback is meant to be "far enough." But if a document is 5000 lines and the only statement_block is on line 0 of a 5000-line file (rest is HTML), the scope would incorrectly end at line 1000 instead of extending to end of file.

**Actual impact**: Low. `maxEndLine` is the max endPosition.row of any statement_block in the document, not the total document line count. If the only statement_block is `{% if %}` on line 0, the document probably doesn't have 5000 lines of content after it. And even if it did, the "+1000" heuristic was already in the codebase before this change.

### Finding Y3: Test 4.10 Has a Conditional Bypass That Hides the WASM Bug

**Severity**: 🟡 Concern  
**Category**: Test Quality

Test "valid with/endwith pair produces no errors" (line 332-354) contains:

```typescript
if (result.unclosed.length === 0) {
  // ... real assertions
} else {
  console.warn("...");
}
```

This means the test ALWAYS PASSES regardless of whether the grammar works. It's a green test that proves nothing. The `console.warn` is easy to miss in CI output among other noise.

**Recommendation**: Either:

1. Mark it `it.skip(...)` with a TODO comment so it's visible in test reports
2. Or add `it.fails(...)` (vitest pattern) to assert the test is expected to fail until WASM is rebuilt
3. Or regenerate the WASM (best option — the grammar change is already applied)

### Finding Y4: Nesting Error `outer` Field Is Misleading for Some Cases

**Severity**: 🟡 Concern  
**Category**: Naming / Semantics

In `NestingError`, the field `outer` refers to the matched opener (the one that the closer pairs with). In the "forgot endif inside for" case:

- `outer` = `for` (the matched opener)
- `inner` = `if` (the crossed item)
- `closer` = `endfor`

But "outer" and "inner" suggest spatial nesting. In reality, `for` opened first (outer) and `if` opened second (inner), which happens to match. However, the naming could confuse downstream consumers who might think `outer` means "the outermost block in the document" vs "the opener that was matched."

### Finding Y5: `walkStatementBlocks` Uses Cursor-Based DFS — Order Depends on Grammar

**Severity**: 🟡 Concern  
**Category**: Assumption Risk

The pairing algorithm assumes `walkStatementBlocks` yields statement_blocks in document order (top-to-bottom, left-to-right). The cursor-based DFS traversal does this for a flat grammar where all statement_blocks are direct children of `source_file`. But if the grammar ever nests statement_blocks (e.g., an `if` block that contains its children as subtrees), the traversal order could change.

**Current grammar**: Flat. All statement_blocks are siblings under source_file. The design doc explicitly notes this ("the tree-sitter grammar is deliberately flat"). So this is safe today.

### Finding Y6: `in` Keyword Could Theoretically Appear as a Statement Keyword

**Severity**: 🟡 Concern  
**Category**: Grammar Edge Case

The grammar defines `"in"` as a keyword. If someone writes `{% in %}`, the parser would produce `keyword("in")`. The function would check:

1. Not in MID_BLOCK_RULES
2. Not in BLOCK_PAIRS
3. Doesn't start with "end"

So it's silently ignored. No bug here, just noting that the function is resilient to non-block keywords appearing in the keyword list.

---

## ✅ ALL CLEAR

### AC1: Simple Unclosed If/For/Block/Macro — CORRECT

Traced `{% if condition %}` with no closer:

- `walkStatementBlocks` yields one statement_block
- keyword "if" found, in `BLOCK_PAIRS` → pushed to stack
- Loop ends, stack has one entry → pushed to `unclosed[]` and `scopedBlocks[]` with `endLine: maxEndLine + 1000`
- All TagLocation fields populated correctly via `makeTagLocation` ✅

### AC2: Orphan Endif/Endfor — CORRECT

Traced `{% endif %}` standalone:

- keyword "endif" found, starts with "end" → openingType = "if"
- "if" is in BLOCK_PAIRS → proceeds to search stack
- Stack is empty → matchIndex = -1 → pushed to `orphanClosers[]` ✅

### AC3: Extra Closing Tag After Valid Pair — CORRECT

Traced `{% if %}...{% endif %}{% endif %}`:

- First `if` → pushed to stack
- First `endif` → matches `if` at index 0, splice, pair added
- Second `endif` → stack empty, orphan closer ✅

### AC4: Unknown End Keyword — CORRECT (by accident, see C3 revised)

`{% enddeprecated %}` parsed as `keyword("deprecated")`. Not in BLOCK_PAIRS, doesn't start with "end" → silently skipped. No orphan closer. ✅

### AC5: Cross-Nesting — CORRECT

Both scenarios ("forgot endif" and "swapped closers") traced correctly. See Y1 for detailed trace. ✅

### AC6: Inline Set — CORRECT

Traced `{% set x = 1 %}`:

- namedChildren: keyword("set"), identifier("x"), operator("="), number("1")
- `isInlineSet(block)` finds operator("=") → returns true
- Function skips stack push → no unclosed entry ✅

Traced `{% set content %}`:

- namedChildren: keyword("set"), identifier("content")
- `isInlineSet(block)` finds no operator("=") → returns false
- Function pushes to stack → unclosed if no endset ✅

### AC7: Mid-Block Validation — CORRECT

All scenarios verified:

- `else` inside `if` → stack top is `if`, valid ✅
- `else` inside `for` → stack top is `for`, valid ✅
- `else` outside any block → stack empty, misplaced ✅
- `else` inside `block` → stack top is `block`, not in ["if","for"], misplaced ✅
- `elseif` inside `if` → valid ✅
- `elseif` inside `for` → stack top is `for`, not in ["if"], misplaced ✅
- `elseif` outside block → stack empty, misplaced ✅
- Strict innermost (`else` in `block` in `for`) → stack top is `block`, misplaced ✅
- For-else with closed nested if → after `endif`, stack top is `for`, `else` valid ✅

### AC8: Clean Template — CORRECT

Properly nested block-if-for-endfor-endif-endblock: all pairs match, stack empty at end, all error arrays empty ✅

### AC9: Named Endblock — CORRECT

`{% endblock header %}` parsed as `keyword("endblock") identifier("header")`. The function only looks at the keyword child, sees "endblock", pairs with "block". The identifier "header" is ignored by the pairing logic. ✅

### AC10: Backward Compatibility — CORRECT

`getScopeAtPosition` (line 613) destructures `{ scopedBlocks }` from `extractScopedBlocks(tree)`. The `scopedBlocks` array contains identical data to the pre-refactor return. All existing tests in `document-analyzer.test.ts` continue to pass. ✅

### AC11: Nested Same-Type Blocks (e.g., if inside if) — CORRECT

Traced `{% if a %}{% if b %}{% endif %}{% endif %}`:

- Stack: push `if`@0, push `if`@1
- First `endif`: matchIndex=1 (innermost `if`), no cross, splice(1), pair inner if ✅
- Second `endif`: matchIndex=0, no cross, splice(0), pair outer if ✅

### AC12: `makeTagLocation` Uses Correct Nodes — CORRECT

- `keyword`: from keywordNode (the keyword text like "if", "endif")
- `line`, `character`: from statementBlock.startPosition (the `{%` position)
- `endLine`, `endCharacter`: from statementBlock.endPosition (the `%}` position)

This gives the full tag range, matching the design decision in `wire-block-tag-diagnostics` ("Diagnostic range covers full statement_block"). ✅

---

## 🔵 DESIGN CONCERNS

### DC1: Crossed Items Are "Lost" From `unclosed[]`

When a splice crosses over items, they go into `nestingErrors[]` but NOT `unclosed[]`. This is by design (the splice removes them). But it means the downstream consumer must iterate BOTH `unclosed[]` AND `nestingErrors[].inner` to find ALL blocks that lack a proper closer.

The `wire-block-tag-diagnostics` design doc doesn't explicitly address this.

### DC2: `enddeprecated` Works by Grammar Accident

The "unknown end\* silently ignored" spec scenario works because the grammar splits `enddeprecated` into `ERROR("end") + keyword("deprecated")`. If a future grammar change makes `enddeprecated` parse as a single keyword (e.g., by adding it to the keyword list), the code would STILL work (`text.startsWith("end")` → `openingType = "deprecated"` → not in BLOCK_PAIRS → continue). But the mechanism is different. The test doesn't validate the code path — it validates a grammar behavior.

### DC3: Performance — Two Full Document Walks Per Parse Event

As noted in the `wire-block-tag-diagnostics` design doc, `extractScopedBlocks()` is called once by `DiagnosticsProvider` and once by `getScopeAtPosition()` (via completions). No caching exists. For large files this could be measurable.

### DC4: `isInlineSet` Checks ALL Named Children, Not Just Those After `set`

The heuristic iterates ALL namedChildren of the statement_block looking for `operator("=")`. In theory, a future grammar change could produce `=` tokens before the `set` keyword (unlikely but possible in error recovery). In practice, the Twig grammar places `set` first, then identifier, then `=`, so this is fine.

### DC5: Block-Form Set Without a Name

`{% set %}` (no identifier, no `=`) would be treated as block-form (no `=` operator found). It would be pushed to the stack and reported as unclosed if no `endset` follows. The design doc acknowledges this: _"If someone writes `{% set %}` with no name and no `=`, we'd treat it as block-form. This is invalid Twig anyway."_ Acceptable.

---

## 📊 GAPS IN TEST COVERAGE

### Gap G1: No Test for Deeply Nested Same-Type Blocks

No test for `{% if %}{% if %}{% if %}...{% endif %}{% endif %}{% endif %}` (3+ levels). The algorithm handles it correctly (traced in AC11 for 2 levels), but there's no explicit regression test.

### Gap G2: No Test for Crossed Items Not Appearing in `unclosed`

When a splice crosses over items, they appear in `nestingErrors` but NOT in `unclosed`. No test explicitly asserts `unclosed` does NOT contain the crossed item. The "forgot endif inside for" test (line 107-118) checks `nestingErrors` but doesn't assert `unclosed.length === 0`.

### Gap G3: No Test for Single-Line Templates with Multiple Tags

All multi-tag tests use multi-line templates. No test for `{% if x %}{% for y in z %}{{ y }}{% endfor %}{% endif %}` on a single line. Should work identically, but untested.

### Gap G4: No Test for `{% set %}` (No Name, No Value)

Edge case where `{% set %}` has no identifier and no `=`. Would be treated as block-form per DC5, but untested.

### Gap G5: No Negative Test for `enddeprecated` Checking the Specific Code Path

Test 4.12 asserts the outcome (no orphan closer) but doesn't assert HOW. If the grammar changes to emit `keyword("enddeprecated")`, the test would still pass but through a different code path. Consider adding a comment noting the grammar dependency.

---

## Summary

| Category        | Count                        | Severity |
| --------------- | ---------------------------- | -------- |
| Critical        | 2 (C1, C2 — same root cause) | 🔴       |
| Concerns        | 6                            | 🟡       |
| All Clear       | 12                           | ✅       |
| Design Concerns | 5                            | 🔵       |
| Test Gaps       | 5                            | 📊       |

**The "Killer" Finding**: C1/C2 — The WASM binary was never rebuilt after the `endwith` grammar change. This means `{% endwith %}` is parsed as `keyword("with")`, which the code interprets as a NEW opener, corrupting the pairing stack for everything downstream. Every template using `with`/`endwith` will produce false unclosed warnings. The test suite hides this behind a conditional bypass.

**Fragility Score**: 5/10 — The core algorithm is solid and handles all non-`with` scenarios correctly. The critical issue is an external dependency (stale WASM) not a logic bug. Once the WASM is rebuilt, the score would drop to 2/10.
