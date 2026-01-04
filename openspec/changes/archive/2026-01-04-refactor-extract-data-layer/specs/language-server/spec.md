## MODIFIED Requirements

### Requirement: Static Completion Data Organization

The language server SHALL organize static completion data (keywords, filters, functions, tests, loop variables) in a dedicated `src/data/` directory with co-located documentation.

#### Scenario: Data file structure

- **WHEN** a developer needs to add a new Twig filter
- **THEN** they can find and edit `src/data/filters.ts` containing both the completion item and its documentation

#### Scenario: Barrel export usage

- **WHEN** code needs access to completion data
- **THEN** it can import from `src/data/` using the barrel export

#### Scenario: Self-contained data files

- **WHEN** a data file (keywords.ts, filters.ts, etc.) is examined
- **THEN** it contains both CompletionItem definitions and corresponding MarkupContent documentation
