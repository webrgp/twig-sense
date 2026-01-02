# syntax-highlighting Specification Delta

## ADDED Requirements

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
