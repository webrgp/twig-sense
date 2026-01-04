## ADDED Requirements

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
