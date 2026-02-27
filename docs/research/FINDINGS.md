# twig-sense Implementation Analysis

This document analyzes the current state of twig-sense against the feature specification (FEATURES.md) and market positioning (MARKET.md).

---

## Executive Summary

**Implementation Status: ~30-35% of specification complete**

twig-sense has a **solid foundation** with:

- Full tree-sitter-based incremental parser
- Comprehensive context-aware completions with documentation
- Semantic token highlighting
- Block tag diagnostics (unclosed tags, orphan closers, nesting errors, misplaced keywords)

**Critical gaps** that affect competitive positioning:

- No navigation features (go-to-definition, find references)
- No formatting
- No workspace indexing
- No framework support
- No hover/signature help

---

## 1. Feature Coverage Matrix

### Core Language Experience (Section 1)

| Feature                  | Status | Notes                      |
| ------------------------ | ------ | -------------------------- |
| `.twig` file association | Done   | Configured in package.json |
| Comment handling `{# #}` | Done   | Parser + auto-pairs        |
| Auto-closing pairs       | Done   | `{{ }}`, `{% %}`, `{# #}`  |
| Smart indentation        | Done   | TextMate patterns          |
| Bracket matching         | Done   | Cross HTML/Twig            |

### Syntax Highlighting (Section 1)

| Feature                          | Status | Notes                       |
| -------------------------------- | ------ | --------------------------- |
| Output expressions `{{ }}`       | Done   | TextMate + semantic tokens  |
| Control tags `{% %}`             | Done   | TextMate + semantic tokens  |
| Comments `{# #}`                 | Done   | TextMate + semantic tokens  |
| Filters, tests, functions        | Done   | Semantic token types        |
| Whitespace control `-}}`, `-%}`  | Done   | Parser handles these        |
| Nested expressions               | Done   | Tree-sitter handles nesting |
| Inline expressions in attributes | Done   | HTML injection grammar      |
| No highlight bleeding            | Done   | TextMate scoping            |

### Parsing & AST Infrastructure (Section 2)

| Feature                         | Status  | Notes                                            |
| ------------------------------- | ------- | ------------------------------------------------ |
| Incremental parsing             | Done    | web-tree-sitter                                  |
| Error-tolerant AST              | Done    | Error nodes don't block                          |
| Precise source ranges           | Done    | Line/column for all nodes                        |
| Node types for all constructs   | Partial | Missing some edge cases; `endwith` keyword added |
| Parser reusable outside VS Code | Done    | Separate package                                 |

### Diagnostics & Validation (Section 3)

| Feature                   | Status      | Notes                                             |
| ------------------------- | ----------- | ------------------------------------------------- |
| Mismatched block tags     | Done        | Nesting error detection via `extractScopedBlocks` |
| Unclosed tags             | Done        | Stack-based analysis with inline-set heuristic    |
| Invalid tag placement     | Done        | Mid-block keyword validation (else/elseif)        |
| Duplicate definitions     | **Missing** |                                                   |
| Invalid include paths     | **Missing** | Needs indexing                                    |
| Inline comment validation | Done        | Warns on delimiter issues                         |
| Orphan closing tags       | Done        | Detects `endfor`/`endif` without matching opener  |

### Navigation (Section 4)

| Feature                                  | Status      | Notes                    |
| ---------------------------------------- | ----------- | ------------------------ |
| Go to definition (include/extends/embed) | **Missing** | Critical gap             |
| Configurable template roots              | **Missing** |                          |
| Relative/absolute path resolution        | **Missing** |                          |
| Namespace support                        | **Missing** |                          |
| Go to definition (block/macro)           | **Missing** | Critical gap             |
| Document symbols/outline                 | **Missing** | Data exists, no provider |

### Workspace Indexing (Section 5)

| Feature                     | Status      | Notes          |
| --------------------------- | ----------- | -------------- |
| Incremental workspace index | **Missing** | Major gap      |
| File watching               | **Missing** |                |
| Cached index                | **Missing** |                |
| Find references             | **Missing** | Needs indexing |
| Rename support              | **Missing** | Needs indexing |

### Completions (Section 6)

| Feature                         | Status      | Notes                  |
| ------------------------------- | ----------- | ---------------------- |
| Context-aware (output vs block) | Done        | Full context detection |
| Variable scope inference        | Done        | set, for, macro params |
| Loop variables                  | Done        | Full `loop.*` support  |
| Macro parameters                | Done        | Snippet insertion      |
| Imported macros                 | **Missing** | Needs cross-file       |
| Ranked results                  | Done        | Local > global         |
| Inline documentation            | Done        | Comprehensive          |

### Hover & Signature Help (Section 7)

| Feature                    | Status      | Notes                    |
| -------------------------- | ----------- | ------------------------ |
| Hover for built-ins        | **Missing** | Data exists, no provider |
| Hover for custom symbols   | **Missing** |                          |
| Signature help (filters)   | **Missing** |                          |
| Signature help (functions) | **Missing** |                          |

### Formatting (Section 8)

| Feature                 | Status      | Notes     |
| ----------------------- | ----------- | --------- |
| AST-based formatting    | **Missing** | Major gap |
| Whitespace preservation | **Missing** |           |
| Configurable options    | **Missing** |           |
| Format-on-save          | **Missing** |           |

### Refactors & Code Actions (Section 9)

| Feature              | Status      | Notes |
| -------------------- | ----------- | ----- |
| Rename macro         | **Missing** |       |
| Rename block         | **Missing** |       |
| Extract macro        | **Missing** |       |
| Add missing end tags | **Missing** |       |
| Quick fixes          | **Missing** |       |

### Framework Integrations (Section 10)

| Feature              | Status      | Notes            |
| -------------------- | ----------- | ---------------- |
| Adapter architecture | **Missing** | No plugin system |
| Craft CMS            | **Missing** |                  |
| Symfony              | **Missing** |                  |

### Multi-Language Awareness (Section 11)

| Feature                     | Status | Notes             |
| --------------------------- | ------ | ----------------- |
| HTML as host language       | Done   | Injection grammar |
| Script/style block support  | Done   |                   |
| No cross-language pollution | Done   |                   |
| Inline Twig in attributes   | Done   |                   |

### Commands & UX (Section 12)

| Feature                     | Status      | Notes |
| --------------------------- | ----------- | ----- |
| Go to template command      | **Missing** |       |
| Reindex workspace command   | **Missing** |       |
| Reload framework metadata   | **Missing** |       |
| Show resolved template path | **Missing** |       |

### Performance & Stability (Section 13)

| Feature                  | Status  | Notes               |
| ------------------------ | ------- | ------------------- |
| Non-blocking UI          | Done    | Separate process    |
| Incremental parsing      | Done    |                     |
| Graceful degradation     | Done    |                     |
| Large workspace handling | Unknown | No indexing to test |

---

## 2. Gap Analysis by Priority

### Tier 1: Critical Gaps (Blocking Adoption)

These features are **table stakes** for competing with existing tools:

1. **Navigation (Go-to-Definition)**
   - Users cannot navigate include/extends/embed paths
   - Cannot jump to block or macro definitions
   - **Impact**: Forces manual file searching
   - **Effort**: Medium (needs path resolution + indexing)

2. **Hover Information**
   - Completion documentation exists but no hover
   - **Impact**: Users must memorize syntax
   - **Effort**: Low (reuse completion data)

### Tier 2: High-Impact Gaps (Competitive Differentiation)

These features address **major pain points** from MARKET.md:

1. **Formatting**
   - Biggest developer frustration per market research
   - No existing reliable Twig formatter
   - **Impact**: Massive differentiation opportunity
   - **Effort**: High (AST-based formatter design)

2. **Workspace Indexing**
   - Enables cross-file features
   - Blocks: find references, rename, imported macros
   - **Impact**: Unlocks advanced refactoring
   - **Effort**: High (persistent cache, file watching)

3. **Framework Support (Craft CMS)**
   - Framework context is "non-optional" per market research
   - False diagnostics without framework awareness
   - **Impact**: Eliminates major false positive source
   - **Effort**: Medium (adapter pattern + manifests)

### Tier 3: Enhancement Gaps (Polish & UX)

1. **Document Symbols/Outline**
   - Data already extracted by DocumentAnalyzer
   - Just needs LSP provider
   - **Effort**: Very Low

2. **Signature Help**
   - Filter/function parameter hints
   - Improves writing speed
   - **Effort**: Low-Medium

3. **Code Actions**
   - Auto-fix for diagnostics
   - Add missing end tags
   - **Effort**: Medium

---

## 3. Market Position Analysis

### Current Position

Per MARKET.md analysis, twig-sense currently offers:

| Market Need                  | twig-sense Status                |
| ---------------------------- | -------------------------------- |
| Reliable syntax highlighting | **Strong**                       |
| Language Server core         | **Strong foundation**            |
| Template validation          | **Good** — block tag diagnostics |
| Framework awareness          | **Not addressed**                |
| Trustworthy formatting       | **Not addressed**                |
| Navigation & refactoring     | **Not addressed**                |
| Low-friction setup           | **Strong**                       |

### Competitive Landscape

**vs. Syntax Extensions (Twig Language 2, Twig Pack):**

- twig-sense is **already superior** with LSP-based completions and semantic tokens
- These extensions are "table stakes, not differentiators"

**vs. Language Servers (Modern Twig, Twiggy):**

- Similar completions coverage
- twig-sense lacks navigation that Twiggy partially provides
- twig-sense has better stability (no PHP execution)
- twig-sense has block tag diagnostics (unclosed/orphan/nesting/misplaced) that competitors lack
- **Parity at best on navigation, ahead on diagnostics**

**vs. PhpStorm:**

- PhpStorm is the "bar" per market research
- twig-sense lacks: navigation, formatting, refactoring, framework awareness
- **Significant gap**

### Strategic Opportunities

From MARKET.md Section 11:

> "Navigation and refactoring are **high-impact, low-competition** features"

Current VS Code Twig tools have weak navigation. This is an **exploitable gap**.

> "Formatting is the single biggest source of developer frustration"

No reliable Twig formatter exists. First-to-market with AST-based formatting creates **strong moat**.

> "Framework support must be declarative, config-driven, non-executing"

Twiggy's PHP execution approach is fragile. A manifest-based approach could win users frustrated with complex setup.

---

## 4. Recommended Roadmap

### Phase 1: Foundation Completion (Quick Wins)

**Goal**: Achieve feature parity with best existing extensions

1. **Hover Provider** (1-2 days)
   - Reuse completion documentation data
   - Immediate UX improvement

2. **Document Symbols** (1 day)
   - DocumentAnalyzer already extracts blocks/macros/variables
   - Wire up LSP provider

### Phase 2: Navigation (Key Differentiator)

**Goal**: Enable template navigation that other tools lack

1. **Template Path Resolution** (3-4 days)
   - Parse include/extends/embed paths
   - Configurable template roots
   - Basic namespace support

2. **Go-to-Definition** (2-3 days)
   - Template files
   - Block definitions
   - Macro definitions (same file first)

3. **Workspace Indexing** (5-7 days)
   - File watching
   - Macro/block registry
   - Cross-file go-to-definition

### Phase 3: Formatting (Major Differentiator)

**Goal**: Become the only reliable Twig formatter

1. **Formatter Design** (research)
   - AST-to-string printer
   - HTML/Twig boundary handling
   - Whitespace control preservation

2. **Core Formatter** (7-10 days)
   - Idempotent output
   - Configurable options
   - Format-on-save integration

### Phase 4: Framework Support

**Goal**: Eliminate false positives for framework users

1. **Adapter Architecture** (3-4 days)
   - Plugin interface definition
   - Configuration schema

2. **Craft CMS Adapter** (3-5 days)
   - Manifest-based globals/filters/functions
   - Template alias resolution

---

## 5. Technical Debt & Risks

### Current Strengths to Preserve

1. **Parser stability** - Tree-sitter approach is solid; `endwith` grammar gap resolved
2. **Completion quality** - Documentation and context awareness are best-in-class
3. **Clean architecture** - Separate packages, clear boundaries
4. **Test coverage** - 200 tests across 11 files, 0 failures
5. **Block tag diagnostics** - Comprehensive unclosed/orphan/nesting/misplaced detection with configurable toggle

### Technical Risks

1. **Workspace indexing scalability**
   - "Handles large workspaces (thousands of templates)" per spec
   - Need efficient data structures and caching

2. **Formatter complexity**
   - HTML/Twig interleaving is hard
   - Risk of "corrupt output" like existing tools

3. **Framework adapter maintenance**
   - Craft/Symfony APIs change
   - Need sustainable update mechanism

### Missing Infrastructure

1. **Persistent cache** - Currently only in-memory
2. **File watcher abstraction** - Needed for indexing
3. **Configuration schema** - Limited settings today

---

## 6. Conclusion

twig-sense has built a **strong foundation** but is missing the features that would make it a **compelling choice** over existing tools. The current implementation covers syntax and completions well but lacks the navigation, formatting, and framework support that developers need.

**Key insight from market research**: Users are frustrated with fragmented, unreliable tools. They want **one extension that works**.

**Recommended priority**:

1. Hover + Document Symbols (quick wins, immediate value)
2. Navigation features (differentiation)
3. Formatting (major moat)
4. Framework support (adoption driver)

Executing this roadmap would position twig-sense as the **best Twig extension for VS Code**, potentially matching PhpStorm's Twig experience in an open-source package.
