## ADDED Requirements

### Requirement: Context Detection Module

The language server SHALL have a dedicated context detection module that determines the current Twig editing context.

#### Scenario: Context type detection

- **WHEN** `detectContext(document, position)` is called
- **THEN** it returns a `ContextInfo` object with context type (output/block/filter/none) and relevant flags

#### Scenario: Context flags

- **WHEN** editing after `is` keyword
- **THEN** `ContextInfo.isAfterIs` is true

#### Scenario: Loop context detection

- **WHEN** editing after `loop.`
- **THEN** `ContextInfo.isAfterLoopDot` is true

### Requirement: Completion Strategy Pattern

The language server SHALL use strategy pattern for context-specific completion logic.

#### Scenario: Block context completions

- **WHEN** cursor is inside `{% %}` block tag
- **THEN** `BlockContextStrategy` provides keywords, functions, variables, and macros

#### Scenario: Output context completions

- **WHEN** cursor is inside `{{ }}` output tag
- **THEN** `OutputContextStrategy` provides functions, variables, and macros (no keywords)

#### Scenario: Filter context completions

- **WHEN** cursor is after `|` pipe character
- **THEN** `FilterContextStrategy` provides only filter completions

### Requirement: Dynamic Completion Extraction

The language server SHALL provide dynamic completions (variables, macros, block names) through a dedicated module.

#### Scenario: Variable completions

- **WHEN** `getVariableCompletions(tree, scope)` is called
- **THEN** it returns completions for all variables defined in the current scope

#### Scenario: Macro completions

- **WHEN** `getMacroCompletions(tree)` is called
- **THEN** it returns completions for all macros imported or defined in the document
