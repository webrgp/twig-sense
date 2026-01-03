# language-server Specification

## Purpose

TBD - created by archiving change add-project-structure. Update Purpose after archive.

## Requirements

### Requirement: LSP Connection

The language server SHALL establish a connection with the VSCode client using JSON-RPC over stdio.

#### Scenario: Server startup

- **WHEN** the VSCode extension activates on a `.twig` file
- **THEN** the language server process is spawned
- **AND** the server sends `initialized` notification

#### Scenario: Server capabilities

- **WHEN** the server responds to `initialize` request
- **THEN** it declares support for `textDocumentSync`, `completionProvider`, and `semanticTokensProvider`

### Requirement: Document Synchronization

The language server SHALL track open documents and their changes using incremental sync.

#### Scenario: Document open

- **WHEN** a `.twig` file is opened in VSCode
- **THEN** the server receives `textDocument/didOpen` notification
- **AND** the document is added to the server's document cache

#### Scenario: Document change

- **WHEN** a `.twig` file is edited
- **THEN** the server receives `textDocument/didChange` notification
- **AND** the document cache is updated with the changes

#### Scenario: Document close

- **WHEN** a `.twig` file is closed
- **THEN** the server receives `textDocument/didClose` notification
- **AND** the document is removed from the cache

### Requirement: Semantic Tokens Provider

The language server SHALL provide semantic tokens for syntax highlighting using Tree-sitter parsing.

#### Scenario: Configuration check

- **WHEN** the client requests semantic tokens
- **AND** the `twig-sense.semanticTokens.enabled` setting is `false`
- **THEN** the server returns empty tokens `{ data: [] }`
- **AND** no parsing or token generation is performed

#### Scenario: Full document tokens

- **WHEN** the client requests `textDocument/semanticTokens/full`
- **THEN** the server retrieves the cached syntax tree for the document
- **AND** traverses all nodes to generate semantic tokens
- **AND** returns encoded semantic tokens in LSP format

#### Scenario: Variable tokens

- **WHEN** an `identifier` node appears as the first element in an expression
- **THEN** it is encoded with token type `variable`

#### Scenario: Property tokens

- **WHEN** an `identifier` node appears within a `property_access` node
- **THEN** it is encoded with token type `property`

#### Scenario: Filter tokens

- **WHEN** an `identifier` node appears within a `filter` node
- **THEN** it is encoded with token type `function`

#### Scenario: Keyword tokens

- **WHEN** a `keyword` node is encountered
- **THEN** it is encoded with token type `keyword`

#### Scenario: Operator tokens

- **WHEN** an `operator` node is encountered
- **THEN** it is encoded with token type `operator`

#### Scenario: Literal tokens

- **WHEN** `string` or `number` nodes are encountered
- **THEN** they are encoded with token types `string` or `number` respectively

#### Scenario: Comment tokens

- **WHEN** a `comment_content` node is encountered
- **THEN** it is encoded with token type `comment`

#### Scenario: Token types

- **WHEN** semantic tokens are generated
- **THEN** they use standard LSP token types: `variable`, `property`, `function`, `keyword`, `operator`, `string`, `number`, `comment`

### Requirement: Tree-sitter Integration

The language server SHALL use web-tree-sitter to parse Twig templates into syntax trees.

#### Scenario: Parser initialization

- **WHEN** the language server starts
- **THEN** it loads the web-tree-sitter WASM runtime
- **AND** loads the tree-sitter-twig.wasm language module
- **AND** creates a parser instance ready to parse documents

#### Scenario: Document parsing

- **WHEN** a document is opened or changed
- **THEN** the document text is parsed into a syntax tree
- **AND** the tree is cached for the document URI

#### Scenario: Incremental parsing

- **WHEN** a document is edited with incremental changes
- **THEN** the cached tree is updated with edit information
- **AND** only the changed portion is re-parsed
- **AND** the new tree replaces the cached tree

#### Scenario: Parse error handling

- **WHEN** a document contains syntax errors
- **THEN** a partial syntax tree is still produced
- **AND** error nodes are marked but valid portions remain usable

#### Scenario: Tree cache cleanup

- **WHEN** a document is closed
- **THEN** the cached syntax tree is removed

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
