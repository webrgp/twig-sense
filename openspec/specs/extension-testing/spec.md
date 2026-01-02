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

