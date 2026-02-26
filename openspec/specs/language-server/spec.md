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
- **AND** block tag validation is also skipped

#### Scenario: Master switch overrides individual toggles

- **WHEN** `twig-sense.diagnostics.enabled` is `false`
- **AND** `twig-sense.diagnostics.blockTags` is `true`
- **AND** `twig-sense.diagnostics.inlineComments` is `true`
- **THEN** zero diagnostics of any kind are produced

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

### Requirement: Block Tag Diagnostics Configuration

The language server SHALL provide a configuration toggle for block tag diagnostics.

#### Scenario: Default enabled

- **WHEN** user has not configured `twig-sense.diagnostics.blockTags`
- **THEN** block tag validation is enabled by default

#### Scenario: Disabled by configuration

- **WHEN** `twig-sense.diagnostics.blockTags` is set to `false`
- **THEN** no block tag diagnostics are produced

#### Scenario: Master diagnostics switch

- **WHEN** `twig-sense.diagnostics.enabled` is set to `false`
- **THEN** block tag diagnostics are not produced (regardless of `blockTags` setting)

### Requirement: Block Tag Diagnostic Properties

All block tag diagnostics SHALL use consistent properties.

#### Scenario: Warning severity

- **WHEN** any block tag diagnostic is produced
- **THEN** the severity is `DiagnosticSeverity.Warning`

#### Scenario: Source attribution

- **WHEN** any block tag diagnostic is produced
- **THEN** the source is `"twig-sense"`

#### Scenario: Diagnostic range accuracy

- **WHEN** an unclosed tag diagnostic is produced
- **THEN** the diagnostic range covers the entire `statement_block` node of the opening tag
- **WHEN** an orphan closer diagnostic is produced
- **THEN** the diagnostic range covers the entire `statement_block` node of the closing tag

#### Scenario: Unclosed tag message format

- **WHEN** an unclosed `{% TAG %}` is detected
- **THEN** the diagnostic message states `Unclosed {% TAG %} — expected {% endTAG %}`

#### Scenario: Orphan closer message format

- **WHEN** an orphan `{% endTAG %}` is detected
- **THEN** the diagnostic message states `Unexpected {% endTAG %} — no matching {% TAG %}`

#### Scenario: Nesting error message format

- **WHEN** a nesting error is detected
- **THEN** the diagnostic message states `{% TAG %} at line N was closed while {% INNER %} at line M was still open`
- **AND** the diagnostic range covers the closing tag that caused the cross

#### Scenario: Misplaced keyword message format

- **WHEN** a misplaced `{% KEYWORD %}` is detected
- **THEN** the diagnostic message states `{% KEYWORD %} is only valid inside {% VALID_PARENTS %}`

### Requirement: Diagnostic Lifecycle

#### Scenario: Clean template

- **WHEN** a template has all block tags properly paired and nested
- **THEN** zero block tag diagnostics are produced

#### Scenario: Multiple errors in one document

- **WHEN** a document contains multiple block tag errors
- **THEN** each error produces its own diagnostic

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

### Requirement: Typed Configuration Interface

The language server SHALL define a TypeScript interface for all configuration options with explicit types and default values.

#### Scenario: Configuration type safety

- **WHEN** code accesses configuration properties
- **THEN** TypeScript provides type checking and autocompletion for all configuration paths
- **AND** this includes the `diagnostics.blockTags` property

#### Scenario: Default values applied

- **WHEN** user has partial or no configuration
- **THEN** sensible defaults are applied via `mergeWithDefaults()` function
- **AND** `diagnostics.blockTags` defaults to `true`

#### Scenario: Configuration schema consistency

- **WHEN** the TwigSenseConfig interface is compared to package.json contributes
- **THEN** all properties match in name and type
- **AND** `twig-sense.diagnostics.blockTags` is present in both

### Requirement: Feature Provider Interface

The language server SHALL define a `FeatureProvider` interface that all LSP feature implementations must implement.

#### Scenario: Provider contract

- **WHEN** a new LSP feature is implemented
- **THEN** it implements `FeatureProvider` with `id`, `getCapabilities()`, `register()`, and optional `dispose()`

#### Scenario: Capability declaration

- **WHEN** `getCapabilities()` is called on a provider
- **THEN** it returns the LSP capability object for that feature

### Requirement: Provider Registry

The language server SHALL use a `ProviderRegistry` to manage all feature providers.

#### Scenario: Provider registration

- **WHEN** a provider is registered with the registry
- **THEN** it is stored and available for capability aggregation and initialization

#### Scenario: Capability aggregation

- **WHEN** `getCapabilities()` is called on the registry
- **THEN** it returns merged capabilities from all registered providers

#### Scenario: Provider initialization

- **WHEN** `initializeAll(context)` is called on the registry
- **THEN** each provider's `register()` method is called with the shared context

### Requirement: Document Manager

The language server SHALL use a `DocumentManager` class to handle document lifecycle and parsing.

#### Scenario: Document open handling

- **WHEN** a document is opened
- **THEN** DocumentManager creates TextDocument, parses it, caches the tree, and emits parse event

#### Scenario: Document change handling

- **WHEN** a document is changed
- **THEN** DocumentManager updates TextDocument, performs incremental parse, and emits parse event

#### Scenario: Document close handling

- **WHEN** a document is closed
- **THEN** DocumentManager removes document and tree from cache, clears diagnostics

#### Scenario: Parse event subscription

- **WHEN** a component calls `onDidParse(callback)`
- **THEN** the callback is invoked after each successful parse with the document URI

### Requirement: Context Detection Module

The language server SHALL have a dedicated context detection module that determines the current Twig editing context.

#### Scenario: Context type detection

- **WHEN** `detectContext(document, position)` is called
- **THEN** it returns a `ContextInfo` object with context type (output/block/filter/none) and relevant flags

#### Scenario: Context flags

- **WHEN** editing after `is` keyword
- **THEN** `ContextInfo.isAfterIs` is true

#### Scenario: Loop context detection

- **WHEN** editing after `loop.`
- **THEN** `ContextInfo.isAfterLoopDot` is true

### Requirement: Completion Strategy Pattern

The language server SHALL use strategy pattern for context-specific completion logic.

#### Scenario: Block context completions

- **WHEN** cursor is inside `{% %}` block tag
- **THEN** `BlockContextStrategy` provides keywords, functions, variables, and macros

#### Scenario: Output context completions

- **WHEN** cursor is inside `{{ }}` output tag
- **THEN** `OutputContextStrategy` provides functions, variables, and macros (no keywords)

#### Scenario: Filter context completions

- **WHEN** cursor is after `|` pipe character
- **THEN** `FilterContextStrategy` provides only filter completions

### Requirement: Dynamic Completion Extraction

The language server SHALL provide dynamic completions (variables, macros, block names) through a dedicated module.

#### Scenario: Variable completions

- **WHEN** `getVariableCompletions(tree, scope)` is called
- **THEN** it returns completions for all variables defined in the current scope

#### Scenario: Macro completions

- **WHEN** `getMacroCompletions(tree)` is called
- **THEN** it returns completions for all macros imported or defined in the document

### Requirement: Block Type Registry

The language server SHALL maintain a `BlockType` union type and `BLOCK_PAIRS` map that includes all supported Twig block tag types.

#### Scenario: BlockType includes with

- **WHEN** the `BlockType` union and `BLOCK_PAIRS` map are defined
- **THEN** `"with"` is included as a block type with `"endwith"` as its closer
- **AND** the tree-sitter grammar's keyword list includes both `"with"` and `"endwith"`
