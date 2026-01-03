# syntax-highlighting Specification Delta

## ADDED Requirements

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
