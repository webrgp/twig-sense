## ADDED Requirements

### Requirement: Template Root Configuration

The extension SHALL provide a configuration setting for the template root directory.

#### Scenario: Default template root

- **WHEN** user has not configured `twig-sense.completion.templateRoot`
- **THEN** the default value is `templates` relative to workspace root

#### Scenario: Custom template root

- **WHEN** user sets `twig-sense.completion.templateRoot` to `views`
- **THEN** template path resolution uses `views` as the root directory

### Requirement: Completion Documentation

The language server SHALL provide markdown documentation for all built-in Twig completion items.

#### Scenario: Filter documentation

- **WHEN** user triggers completion after `|` in `{{ variable| }}`
- **THEN** each filter completion item includes a `documentation` field
- **AND** the documentation contains a description, syntax example, and usage example

#### Scenario: Function documentation

- **WHEN** user triggers completion in `{{ }}` context
- **THEN** each function completion item includes a `documentation` field
- **AND** the documentation contains a description, parameters, and usage example

#### Scenario: Keyword documentation

- **WHEN** user triggers completion in `{% %}` context
- **THEN** each keyword completion item includes a `documentation` field
- **AND** the documentation contains a description and syntax example

#### Scenario: Test documentation

- **WHEN** user triggers completion after `is` keyword
- **THEN** each test completion item includes a `documentation` field
- **AND** the documentation contains a description and usage example

### Requirement: Context-Aware End Tag Completions

The language server SHALL filter `end*` keyword completions based on the current scope context.

#### Scenario: endif only inside if block

- **WHEN** cursor is inside `{% if %}...{% | %}`
- **THEN** `endif` completion is shown
- **AND** `endfor`, `endblock`, `endmacro` are NOT shown

#### Scenario: endfor only inside for block

- **WHEN** cursor is inside `{% for %}...{% | %}`
- **THEN** `endfor` completion is shown
- **AND** `endif`, `endblock`, `endmacro` are NOT shown

#### Scenario: nested blocks show innermost end tag

- **WHEN** cursor is inside `{% if %}{% for %}...{% | %}`
- **THEN** `endfor` completion is shown as first suggestion
- **AND** `endif` is also available (for outer block)

#### Scenario: else/elseif only inside if block

- **WHEN** cursor is inside `{% if %}...{% | %}`
- **THEN** `else` and `elseif` completions are shown
- **WHEN** cursor is inside `{% for %}...{% | %}`
- **THEN** `else` completion is shown (for loop else)
- **AND** `elseif` is NOT shown

### Requirement: Variable Completions

The language server SHALL provide completions for variables defined in the current document.

#### Scenario: set variable completion

- **WHEN** document contains `{% set username = 'john' %}`
- **AND** user triggers completion in `{{ | }}`
- **THEN** `username` appears in completion list
- **AND** it has kind `Variable`

#### Scenario: for loop variable completion

- **WHEN** document contains `{% for item in items %}`
- **AND** cursor is inside the for block
- **AND** user triggers completion
- **THEN** `item` appears in completion list
- **AND** it has kind `Variable`

#### Scenario: loop variable completions inside for

- **WHEN** cursor is inside a `{% for %}` block
- **AND** user triggers completion after `loop.`
- **THEN** completions include `index`, `index0`, `revindex`, `revindex0`, `first`, `last`, `length`, `parent`

#### Scenario: loop variable not shown outside for

- **WHEN** cursor is outside any `{% for %}` block
- **THEN** `loop` variable is NOT shown in completions

### Requirement: Macro Completions

The language server SHALL provide completions for macros defined in the current document.

#### Scenario: local macro completion

- **WHEN** document contains `{% macro input(name, value) %}`
- **AND** user triggers completion in `{{ | }}`
- **THEN** `input` appears in completion list
- **AND** it has kind `Function`
- **AND** insert text includes parameter placeholders `input(${1:name}, ${2:value})`

#### Scenario: macro with no parameters

- **WHEN** document contains `{% macro separator() %}`
- **AND** user triggers completion in `{{ | }}`
- **THEN** `separator` appears in completion list
- **AND** insert text is `separator()`

### Requirement: Block Name Completions

The language server SHALL provide completions for block names defined in the current document.

#### Scenario: block name in block tag

- **WHEN** document contains `{% block header %}...{% endblock %}`
- **AND** user types `{% block | %}`
- **THEN** `header` appears in completion list

#### Scenario: block name in block function

- **WHEN** document contains `{% block sidebar %}...{% endblock %}`
- **AND** user types `{{ block('|') }}`
- **THEN** `sidebar` appears in completion list

#### Scenario: parent block completion

- **WHEN** cursor is inside a `{% block %}` definition
- **AND** user triggers completion
- **THEN** `parent()` function is prioritized in completions
