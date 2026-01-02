# Capability: Syntax Highlighting

## ADDED Requirements

### Requirement: TextMate Grammar
The extension SHALL provide a TextMate grammar (`twig.tmLanguage.json`) for basic syntax highlighting of Twig templates.

#### Scenario: Twig delimiters highlighted
- **WHEN** a `.twig` file contains `{{ variable }}`
- **THEN** the `{{` and `}}` delimiters are highlighted as punctuation
- **AND** `variable` is highlighted as a variable

#### Scenario: Tag blocks highlighted
- **WHEN** a `.twig` file contains `{% if condition %}`
- **THEN** the `{%` and `%}` delimiters are highlighted as punctuation
- **AND** `if` is highlighted as a keyword

#### Scenario: Comments highlighted
- **WHEN** a `.twig` file contains `{# comment #}`
- **THEN** the entire block is highlighted as a comment

### Requirement: Language Configuration
The extension SHALL provide a language configuration (`twig.configuration.json`) defining brackets, comments, and auto-closing pairs.

#### Scenario: Comment toggling
- **WHEN** user presses Cmd+/ on a line in a `.twig` file
- **THEN** the line is wrapped with `{# ` and ` #}`

#### Scenario: Bracket matching
- **WHEN** cursor is on `{{`
- **THEN** the matching `}}` is highlighted

### Requirement: Semantic Tokens
The language server SHALL provide semantic tokens for context-aware syntax highlighting powered by Tree-sitter parsing.

#### Scenario: Variable tokens
- **WHEN** the language server parses `{{ user.name }}`
- **THEN** `user` is tagged as `variable` token type
- **AND** `name` is tagged as `property` token type

#### Scenario: Filter tokens
- **WHEN** the language server parses `{{ name|upper }}`
- **THEN** `upper` is tagged as `function` token type

#### Scenario: Tag keyword tokens
- **WHEN** the language server parses `{% for item in items %}`
- **THEN** `for` and `in` are tagged as `keyword` token type

### Requirement: Two-Layer Highlighting
The extension SHALL use TextMate grammar as a fallback and overlay LSP semantic tokens when available.

#### Scenario: Immediate highlighting
- **WHEN** a `.twig` file is opened
- **THEN** TextMate highlighting appears immediately
- **AND** semantic token highlighting overlays after server is ready

### Requirement: Semantic Tokens Configuration
The extension SHALL enable semantic tokens by default with an option to disable them in settings.

#### Scenario: Default enabled
- **WHEN** the extension is installed with default settings
- **THEN** semantic tokens are enabled and provide context-aware highlighting

#### Scenario: User disables semantic tokens
- **WHEN** user sets `twig-sense.semanticTokens.enabled` to `false`
- **THEN** only TextMate grammar highlighting is used

### Requirement: File Extension Registration
The extension SHALL register only the `.twig` file extension under the `twig` language ID.

#### Scenario: Twig file recognized
- **WHEN** a file with `.twig` extension is opened
- **THEN** it is associated with the `twig` language
- **AND** syntax highlighting is applied
