# syntax-highlighting Specification

## Purpose

TBD - created by archiving change add-project-structure. Update Purpose after archive.

## Requirements

### Requirement: TextMate Grammar

The extension SHALL provide a TextMate grammar (`twig.tmLanguage.json`) for basic syntax highlighting of Twig templates, with embedded HTML, CSS, and JavaScript support.

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

#### Scenario: HTML content highlighted

- **WHEN** a `.twig` file contains `<div class="container">`
- **THEN** the HTML tag and attributes are highlighted using HTML grammar rules

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

### Requirement: HTML Injection Grammar Registration

The extension SHALL register an injection grammar for injecting Twig syntax into HTML files.

#### Scenario: HTML injection grammar registered

- **WHEN** the extension is activated
- **THEN** the `twig-html.injection` grammar is available
- **AND** it injects into `text.html.basic` and `text.html.derivative` scopes

### Requirement: Whitespace Control Modifiers

The TextMate grammar SHALL highlight whitespace control modifiers in Twig delimiters.

#### Scenario: Output whitespace control

- **WHEN** a `.twig` file contains `{{- variable -}}`
- **THEN** the `{{-` and `-}}` are highlighted as punctuation

#### Scenario: Tag whitespace control

- **WHEN** a `.twig` file contains `{%- if condition -%}`
- **THEN** the `{%-` and `-%}` are highlighted as punctuation

### Requirement: Embedded Language Scopes

The TextMate grammar SHALL declare embedded language scopes for CSS and JavaScript.

#### Scenario: CSS scope declared

- **WHEN** a `.twig` file contains `<style>.class { color: red; }</style>`
- **THEN** the CSS content is scoped as `source.css`

#### Scenario: JavaScript scope declared

- **WHEN** a `.twig` file contains `<script>const x = 1;</script>`
- **THEN** the JavaScript content is scoped as `source.js`

### Requirement: Inline Comment Grammar Support

The Tree-sitter grammar SHALL recognize inline comments (introduced in Twig 3.15) within expressions and statements.

#### Scenario: Inline comment on own line

- **WHEN** an expression contains `#` followed by text on its own line
- **THEN** the parser creates an `inline_comment` node
- **AND** the comment includes all text from `#` to the end of the line

#### Scenario: Inline comment after code

- **WHEN** an expression contains code followed by `#` and comment text
- **THEN** the parser creates nodes for the code
- **AND** creates an `inline_comment` node for the comment portion
- **AND** both appear in the same expression

#### Scenario: Multiple inline comments

- **WHEN** an expression spans multiple lines with `#` comments on different lines
- **THEN** the parser creates separate `inline_comment` nodes for each line
- **AND** each comment captures text from its `#` to its line end

#### Scenario: Hash in string literal

- **WHEN** a string literal contains `#` character
- **THEN** the `#` is part of the string node
- **AND** no `inline_comment` node is created

#### Scenario: Inline comment in output statement

- **WHEN** an output statement `{{ ... }}` contains inline comments
- **THEN** the inline comments are parsed within the output_statement node
- **AND** the expression content includes inline_comment nodes

#### Scenario: Inline comment in statement block

- **WHEN** a statement block `{% ... %}` contains inline comments
- **THEN** the inline comments are parsed within the statement_block node
- **AND** the statement content includes inline_comment nodes

#### Scenario: Inline comment in array syntax

- **WHEN** array or map syntax contains inline comments after elements
- **THEN** each inline comment is parsed as an inline_comment node
- **AND** the array/map structure remains valid

#### Scenario: Comment consumes to line end only

- **WHEN** an inline comment appears on a line
- **THEN** the comment captures text up to but not including the newline
- **AND** subsequent lines are parsed normally
- **AND** closing delimiters on following lines are recognized

#### Scenario: Nested expression with inline comment

- **WHEN** a parenthesized or bracketed expression contains inline comments
- **THEN** the inline comments are parsed within their containing expression
- **AND** the nested structure remains valid

#### Scenario: Complex expression with inline comments

- **WHEN** an expression contains filters, function calls, and inline comments
- **THEN** all elements are parsed correctly
- **AND** inline comment nodes appear in appropriate positions

#### Scenario: Real-world map literal usage

- **WHEN** a map literal contains inline comments after each value (Twig docs pattern)
- **THEN** each inline comment is parsed as separate inline_comment node
- **AND** the map structure and filter application remain valid

### Requirement: Inline Comment TextMate Highlighting

The VSCode extension SHALL provide TextMate grammar patterns to highlight inline comments in Twig templates.

#### Scenario: Comment pattern matching

- **WHEN** the TextMate grammar encounters `#` followed by any characters until line end
- **AND** the `#` is within an expression or statement block
- **THEN** the matched text is assigned scope `comment.line.number-sign.twig`

#### Scenario: Comment styling in editor

- **WHEN** VSCode renders a document with inline comments
- **THEN** inline comment text appears in the theme's comment color
- **AND** the styling is visually distinct from surrounding code

#### Scenario: String content protection

- **WHEN** a string literal contains `#` character
- **THEN** the `#` maintains string scope
- **AND** no comment scope is applied

#### Scenario: Pattern precedence

- **WHEN** the TextMate grammar evaluates patterns in an expression
- **THEN** string patterns are evaluated before inline-comment pattern
- **AND** inline-comment pattern is evaluated before identifier patterns
- **AND** proper scoping is applied in correct order

#### Scenario: Multi-line expression support

- **WHEN** an expression spans multiple lines with inline comments on different lines
- **THEN** each line's inline comment receives comment scope independently
- **AND** code portions maintain their appropriate scopes

#### Scenario: Immediate highlighting feedback

- **WHEN** a user types `#` followed by text in an expression
- **THEN** the comment highlighting applies immediately
- **AND** highlighting updates as user continues typing

#### Scenario: Theme compatibility

- **WHEN** the user switches VSCode themes
- **THEN** inline comments adapt to the new theme's comment color
- **AND** remain visually distinct from code
