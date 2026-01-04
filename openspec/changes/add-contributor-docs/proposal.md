# Change: Add Contributor Documentation

## Why

New contributors have no clear entry point to understand the architecture or patterns used in the codebase. There's no guide for adding new LSP features or understanding the project structure.

## What Changes

- Create `docs/ARCHITECTURE.md` explaining:
  - Package structure
  - Core components (DocumentManager, ProviderRegistry)
  - Data flow diagrams
  - How to add new features
- Create `CONTRIBUTING.md` with:
  - Quick start guide
  - Code style guidelines
  - Testing instructions
  - Pull request process

## Impact

- Affected specs: `project-structure`
- Affected code:
  - New: `docs/ARCHITECTURE.md`
  - New: `CONTRIBUTING.md`
