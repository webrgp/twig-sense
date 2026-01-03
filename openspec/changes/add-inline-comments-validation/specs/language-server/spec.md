# language-server Specification Delta

## ADDED Requirements

### Requirement: Inline Comment Validation

The language server SHALL validate inline comment usage and warn when closing delimiters appear on the same line as an inline comment.

#### Scenario: Same-line delimiter detection

- **WHEN** a document contains an inline comment node
- **AND** the parent construct's closing delimiter token appears on the same line as the inline comment
- **THEN** a diagnostic warning is generated
- **AND** the diagnostic points to the inline comment location

#### Scenario: Token-based delimiter detection

- **WHEN** validating inline comment placement
- **THEN** the validator checks the actual closing delimiter token from the syntax tree
- **AND** not text content that resembles delimiters within the comment
- **AND** uses line numbers from tree-sitter position information

#### Scenario: Diagnostic message content

- **WHEN** a same-line delimiter issue is detected
- **THEN** the diagnostic message states: "Inline comment extends to end of line. Move closing delimiter to next line."
- **AND** the severity is `Warning`
- **AND** the source is `twig-sense`

#### Scenario: Valid inline comment (no warning)

- **WHEN** an inline comment exists
- **AND** the closing delimiter appears on a subsequent line
- **THEN** no diagnostic is generated
- **AND** the inline comment is considered valid

#### Scenario: Multi-line expression with inline comments

- **WHEN** an expression spans multiple lines
- **AND** inline comments appear on some lines
- **AND** each line with inline comment has no delimiter on same line
- **THEN** no diagnostic warnings are generated

#### Scenario: Invalid multi-line expression

- **WHEN** a multi-line expression has an inline comment on the last line
- **AND** the closing delimiter appears on the same line as that inline comment
- **THEN** a diagnostic warning is generated for that line

#### Scenario: False positive prevention (string content)

- **WHEN** a string literal contains `}}` or `%}` characters
- **AND** an inline comment exists in the expression
- **THEN** the validator checks only actual delimiter tokens from syntax tree
- **AND** string content nodes are not considered as delimiters
- **AND** no false positive diagnostic is generated

#### Scenario: False positive prevention (comment text)

- **WHEN** inline comment text contains `}}` or `%}` characters
- **AND** the actual closing delimiter is on a subsequent line
- **THEN** the comment text is ignored when checking for delimiters
- **AND** no diagnostic is generated
- **AND** the inline comment is considered valid

#### Scenario: Configuration check

- **WHEN** `twig-sense.diagnostics.enabled` setting is `false`
- **THEN** inline comment validation is skipped
- **AND** no diagnostics are generated

#### Scenario: Diagnostic position accuracy

- **WHEN** a diagnostic is generated for invalid inline comment
- **THEN** the diagnostic range starts at the `#` character
- **AND** extends to the end of the comment text
- **AND** highlights the problematic inline comment

#### Scenario: Performance on large files

- **WHEN** validating a document with more than 1000 lines
- **AND** the document contains multiple inline comments
- **THEN** validation completes within 100ms
- **AND** only changed regions are re-validated when possible

#### Scenario: Diagnostic lifecycle

- **WHEN** user fixes invalid inline comment by moving delimiter to next line
- **THEN** the diagnostic is removed on next validation pass
- **AND** the document shows no warnings for that inline comment
