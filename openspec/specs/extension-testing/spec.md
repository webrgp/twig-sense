# extension-testing Specification

## Purpose

TBD - created by archiving change add-vscode-extension-testing. Update Purpose after archive.

## Requirements

### Requirement: Test Runner Configuration

The extension SHALL use `@vscode/test-cli` configured via `.vscode-test.mjs` to run tests in a VS Code Extension Host.

#### Scenario: Test command execution

- **WHEN** `npm run test` is run in `packages/vscode`
- **THEN** the `vscode-test` CLI is invoked
- **AND** tests are executed in a VS Code Extension Host environment

#### Scenario: Test file discovery

- **WHEN** the test runner starts
- **THEN** it discovers test files matching `out/test/**/*.test.js`

#### Scenario: Mocha configuration

- **WHEN** tests are executed
- **THEN** Mocha is configured with a timeout suitable for extension initialization (minimum 20 seconds)

### Requirement: Test Compilation

Tests SHALL be compiled separately from the production bundle using a dedicated TypeScript configuration.

#### Scenario: Test TypeScript configuration

- **WHEN** `tsconfig.test.json` is examined
- **THEN** it extends the package's base `tsconfig.json`
- **AND** outputs to `./out` directory
- **AND** includes both `src/**/*` and `test/**/*`

#### Scenario: Test precompilation

- **WHEN** `npm run test` is executed
- **THEN** `pretest` script compiles TypeScript tests before running

### Requirement: Test Directory Structure

Tests SHALL be organized in a `test/` directory with subdirectories for test suites and fixtures.

#### Scenario: Test suite location

- **WHEN** the test directory is examined
- **THEN** `test/suite/` contains `.test.ts` files

#### Scenario: Test fixtures location

- **WHEN** the test directory is examined
- **THEN** `test/fixtures/` contains sample `.twig` files for testing

### Requirement: Extension Activation Tests

The test suite SHALL verify extension activation and basic functionality.

#### Scenario: Extension registered

- **GIVEN** the extension is installed in the test host
- **WHEN** extensions are queried
- **THEN** the extension is found in the extension registry

#### Scenario: Extension activates on Twig files

- **GIVEN** the extension is installed in the test host
- **WHEN** a `.twig` file is opened
- **THEN** the extension activates successfully

#### Scenario: Language client starts

- **GIVEN** the extension has activated
- **WHEN** the extension state is examined
- **THEN** the language server client has started

### Requirement: Debug Configuration

The VS Code launch configuration SHALL support debugging extension tests.

#### Scenario: Extension Tests debug config

- **WHEN** the "Extension Tests" launch configuration is used
- **THEN** tests run in a debuggable Extension Host
- **AND** breakpoints in test files are hit

### Requirement: Test Isolation

Tests SHALL run in isolation without interference from other installed extensions.

#### Scenario: Clean test environment

- **WHEN** tests are executed via CLI
- **THEN** other user extensions are not loaded in the test host

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

### Requirement: Shared Parser Setup

The test infrastructure SHALL provide a singleton parser setup utility for all test files.

#### Scenario: Parser singleton access

- **WHEN** `getTestParser()` is called from any test file
- **THEN** it returns the same initialized Parser instance

#### Scenario: Parse helper function

- **WHEN** `parseTestDocument(text)` is called
- **THEN** it parses the text using the shared parser and returns the tree

### Requirement: Test Document Factory

The test infrastructure SHALL provide a factory function for creating test documents.

#### Scenario: Document creation

- **WHEN** `createTestDocument(content)` is called
- **THEN** it returns a TextDocument with unique URI and version 1

#### Scenario: Optional language ID

- **WHEN** `createTestDocument(content, "html")` is called
- **THEN** it creates a document with the specified language ID

### Requirement: Global Test Setup

The test infrastructure SHALL use a global setup file for common initialization.

#### Scenario: Parser initialization

- **WHEN** any test suite runs
- **THEN** the parser is initialized once before all tests via setupFiles

#### Scenario: Setup file configuration

- **WHEN** vitest.config.ts is loaded
- **THEN** it references `src/__tests__/setup.ts` in setupFiles
