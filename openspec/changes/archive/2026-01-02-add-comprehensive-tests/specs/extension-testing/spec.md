## ADDED Requirements

### Requirement: Language Server Unit Test Framework
The language server package SHALL use Vitest as the unit testing framework for testing core functionality.

#### Scenario: Vitest configuration
- **WHEN** the language-server package is examined
- **THEN** it contains a `vitest.config.ts` configuration file
- **AND** the `package.json` includes a `test` script that runs Vitest

#### Scenario: Test execution
- **WHEN** `npm run test` is run in `packages/language-server`
- **THEN** Vitest discovers and executes test files matching `src/__tests__/**/*.test.ts`

### Requirement: Completion Context Detection Tests
The test suite SHALL verify that Twig context detection correctly identifies the cursor position context.

#### Scenario: Output context detection
- **GIVEN** a Twig template with `{{ variable }}`
- **WHEN** the cursor is positioned after `{{`
- **THEN** `detectContext` returns `"output"`

#### Scenario: Block context detection
- **GIVEN** a Twig template with `{% if condition %}`
- **WHEN** the cursor is positioned after `{% `
- **THEN** `detectContext` returns `"block"`

#### Scenario: Filter context detection
- **GIVEN** a Twig template with `{{ name| }}`
- **WHEN** the cursor is positioned after `|`
- **THEN** `detectContext` returns `"filter"`

#### Scenario: None context detection
- **GIVEN** a Twig template with `<div>content</div>`
- **WHEN** the cursor is positioned in HTML content
- **THEN** `detectContext` returns `"none"`

### Requirement: Completion Generation Tests
The test suite SHALL verify that completions are generated correctly for each Twig context.

#### Scenario: Block context completions
- **GIVEN** a cursor in block context (`{% `)
- **WHEN** `getCompletions` is called
- **THEN** the result includes Twig keywords (`if`, `for`, `block`, `extends`)
- **AND** the result includes Twig functions (`dump`, `range`)

#### Scenario: Output context completions
- **GIVEN** a cursor in output context (`{{ `)
- **WHEN** `getCompletions` is called
- **THEN** the result includes Twig functions
- **AND** the result does NOT include block-only keywords like `endif`

#### Scenario: Filter context completions
- **GIVEN** a cursor after pipe character (`{{ value| `)
- **WHEN** `getCompletions` is called
- **THEN** the result includes Twig filters (`upper`, `lower`, `date`, `join`)

#### Scenario: Test completions after is keyword
- **GIVEN** a cursor after `is ` in a Twig expression
- **WHEN** `getCompletions` is called
- **THEN** the result includes Twig tests (`defined`, `empty`, `even`, `odd`)

### Requirement: Semantic Token Generation Tests
The test suite SHALL verify that semantic tokens are correctly generated from parsed Twig templates.

#### Scenario: Variable token generation
- **GIVEN** a Twig template with `{{ user }}`
- **WHEN** semantic tokens are generated
- **THEN** `user` receives token type `variable`

#### Scenario: Property token generation
- **GIVEN** a Twig template with `{{ user.name }}`
- **WHEN** semantic tokens are generated
- **THEN** `name` receives token type `property`

#### Scenario: Filter function token generation
- **GIVEN** a Twig template with `{{ name|upper }}`
- **WHEN** semantic tokens are generated
- **THEN** `upper` receives token type `function`

#### Scenario: Keyword token generation
- **GIVEN** a Twig template with `{% if condition %}`
- **WHEN** semantic tokens are generated
- **THEN** `if` receives token type `keyword`

#### Scenario: Comment token generation
- **GIVEN** a Twig template with `{# comment #}`
- **WHEN** semantic tokens are generated
- **THEN** the comment content receives token type `comment`

#### Scenario: Tokens restricted to Twig constructs
- **GIVEN** a Twig template with `<div>{{ var }}</div>`
- **WHEN** semantic tokens are generated
- **THEN** tokens are only produced for content inside `{{ }}`
- **AND** the HTML content does NOT receive Twig semantic tokens

### Requirement: Parser Utility Tests
The test suite SHALL verify Tree-sitter parser initialization and document parsing.

#### Scenario: Parser initialization
- **WHEN** `initializeParser` is called
- **THEN** the parser is ready to parse documents
- **AND** `isParserReady` returns `true`

#### Scenario: Document parsing
- **GIVEN** a valid Twig template string
- **WHEN** `parseDocument` is called
- **THEN** a syntax tree is returned
- **AND** the tree's root node has children representing Twig constructs

#### Scenario: Syntax error handling
- **GIVEN** a Twig template with unclosed delimiters `{{ variable`
- **WHEN** `parseDocument` is called
- **THEN** a partial syntax tree is still returned
- **AND** the tree contains error nodes
