# Twig Tooling in VS Code — Findings Reference

This document captures consolidated findings on the current state of Twig tooling in VS Code.
It is intended to be used as a **reference baseline** when designing, evaluating, and prioritizing features for a first-class Twig VS Code extension (e.g. `twig-sense`).

---

## 1. Executive Findings (Condensed)

- Twig tooling in VS Code is **fragmented**, with responsibilities split across syntax extensions, language servers, linters, and formatters.
- No tool currently provides a **complete, stable, low-configuration experience**.
- **Formatting is the single biggest source of developer frustration**.
- **Language Server–based approaches are the future**, but current implementations are incomplete or fragile.
- Framework awareness (Symfony, Drupal, Craft CMS) is **essential**, not optional.
- Many experienced Twig developers **fallback to PhpStorm** due to tooling gaps in VS Code.

---

## 2. Tooling Landscape Overview

### Categories

| Category          | Purpose                   | Current State           |
| ----------------- | ------------------------- | ----------------------- |
| Syntax Extensions | Highlighting, snippets    | Mature but stagnant     |
| Language Servers  | IntelliSense, diagnostics | Promising but unstable  |
| Linters           | Static analysis           | Reliable but limited UX |
| Formatters        | Code style enforcement    | Highly problematic      |
| Commercial IDEs   | Full integration          | Best experience, paid   |

---

## 3. Syntax Extensions (Baseline Capabilities)

### Commonly Used

- Twig Language 2
- Twig Pack
- Twig Language Support (Twig v3 fork)

### Strengths

- Reliable syntax highlighting
- Snippets for control structures
- Emmet support for HTML in Twig
- Minimal setup

### Systemic Issues

1. No semantic understanding (pure text grammars)
2. No navigation (includes, blocks, macros)
3. No framework context
4. Outdated or abandoned maintenance
5. Formatting often bundled but unreliable

**Implication for Features:**
Syntax highlighting is **table stakes**, not a differentiator. It should not be coupled to formatting.

---

## 4. Language Servers (Core Differentiator)

### Commonly Used

- Modern Twig (Twig Language Server)
- Twiggy (Twig LS fork with framework hooks)

### Strengths

- Real diagnostics (syntax + semantic)
- Autocomplete for Twig constructs
- Hover documentation
- Partial go-to-definition

### Systemic Issues

1. Crashes and instability (filesystem access, large projects)
2. High CPU / memory usage on initialization
3. False positives due to missing runtime context
4. Weak framework awareness by default
5. Complex setup (PHP paths, console execution)

**Implication for Features:**
A Twig extension must:

- Be **language-server-first**
- Degrade gracefully
- Be context-aware **without executing user code**
- Support incremental indexing and caching

---

## 5. Framework Awareness (Non-Optional)

### Frameworks in Scope

- Symfony
- Drupal
- Craft CMS

### Current State

- Framework globals (`app`, `attributes`, `craft`, etc.) are unknown to most tools
- Twig extensions (filters/functions) are invisible unless executed
- Results in:
  - False “undefined variable” errors
  - Broken autocomplete
  - Disabled diagnostics by users

### Twiggy’s Approach

- Executes PHP console commands to extract context
- Powerful but:
  - Fragile in Docker
  - OS-dependent
  - Hard to configure

**Implication for Features:**
Framework support must be:

- Declarative
- Config-driven
- Non-executing
- Composable (plugins/adapters)

---

## 6. Linting (Static Analysis)

### Common Tools

- twigcs
- Symfony `lint:twig`

### Strengths

- Accurate syntax validation
- Enforces official Twig standards
- CI-friendly
- Stable and predictable

### Limitations

1. No auto-fix (twigcs)
2. CLI-only UX
3. Binary setup friction
4. Slow on large template sets
5. No deep semantic checks

**Implication for Features:**
Linting should be:

- Embedded into the language server
- Incremental
- Auto-fix capable
- Configurable per project

---

## 7. Formatting (Largest Pain Point)

### Common Approaches

- PrettyDiff (Twig Language 2)
- Prettier plugins (twig-melody and forks)
- Twig CS Fixer (CLI)

### Systemic Problems

1. Corrupt output (HTML/JS/CSS mixed with Twig)
2. Repeated reformat drift
3. Poor support for modern Twig syntax
4. Conflicts between multiple formatters
5. Unmaintained plugins

### Developer Behavior

- Disable formatting entirely
- Manually format Twig
- Switch editors (PhpStorm)

**Implication for Features:**
Formatting must be:

- AST-based
- Twig-native
- Context-aware
- Predictable and idempotent
- Optional but trustworthy

---

## 8. Navigation & Refactoring (Major Gap)

### What’s Missing Today

- Jump to included template
- Jump to block definition
- Macro discovery
- Safe variable renames
- Template dependency graphs

### Why It Matters

- Twig templates grow large
- Includes/macros are heavily used
- Refactoring is currently unsafe

**Implication for Features:**
Navigation and refactoring are **high-impact, low-competition** features.

---

## 9. Developer Pain Patterns (Cross-Tool)

| Pain                     | Appears In         |
| ------------------------ | ------------------ |
| Formatting breaks code   | Almost all tools   |
| False diagnostics        | Language servers   |
| No framework context     | All                |
| Heavy configuration      | Advanced tools     |
| Stalled maintenance      | Popular extensions |
| “Works until it doesn’t” | Universal          |

---

## 10. Competitive Benchmark: PhpStorm

### Why Developers Switch

- Deep PHP ↔ Twig awareness
- Accurate autocompletion
- Safe refactoring
- Reliable formatting

### Takeaway

The bar is already defined.
VS Code tooling is not competing with nothing — it’s competing with PhpStorm.

---

## 11. Strategic Takeaways for Feature Planning

When cross-referencing features, prioritize:

1. Language server as the core
2. Framework-aware, non-executing context
3. Trustworthy formatting
4. Navigation & refactoring
5. Low-friction setup
6. Composable architecture

---

**Usage Note:**
This document should be used as:

- A validation checklist for proposed features
- A gap-analysis baseline
- A justification source for roadmap and prioritization decisions
