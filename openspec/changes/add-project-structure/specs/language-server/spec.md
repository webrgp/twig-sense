# Capability: Language Server

## ADDED Requirements

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

#### Scenario: Full document tokens
- **WHEN** the client requests `textDocument/semanticTokens/full`
- **THEN** the server parses the document with Tree-sitter
- **AND** returns encoded semantic tokens for all recognized elements

#### Scenario: Token types
- **WHEN** semantic tokens are generated
- **THEN** they use standard LSP token types: `variable`, `function`, `keyword`, `operator`, `string`, `number`, `comment`

### Requirement: Tree-sitter Integration
The language server SHALL use web-tree-sitter to parse Twig templates into syntax trees.

#### Scenario: Parser initialization
- **WHEN** the language server starts
- **THEN** it loads the tree-sitter-twig WASM module
- **AND** creates a parser instance

#### Scenario: Incremental parsing
- **WHEN** a document is edited
- **THEN** only the changed portion is re-parsed
- **AND** the syntax tree is updated efficiently
