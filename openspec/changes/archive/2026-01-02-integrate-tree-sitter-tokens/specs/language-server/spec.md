# language-server Specification Delta

## MODIFIED Requirements

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
