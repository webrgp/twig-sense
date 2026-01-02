## ADDED Requirements

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

## MODIFIED Requirements

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
