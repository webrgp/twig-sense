# go-to-definition Specification

## Purpose

Provide LSP Go to Definition support for template path references in Twig `{% include %}` tags, allowing users to navigate directly to the referenced template file.

## Requirements

### Requirement: Include Tag Definition Resolution

The language server SHALL resolve template path strings in `{% include %}` tags to file locations on disk.

#### Scenario: Static string path with extension

- **WHEN** user triggers Go to Definition on the string `"partials/header.twig"` in `{% include "partials/header.twig" %}`
- **AND** the file `{workspaceRoot}/{templates.root}/partials/header.twig` exists
- **THEN** the server returns a `Location` pointing to line 0, column 0 of that file

#### Scenario: Static string path without extension

- **WHEN** user triggers Go to Definition on the string `"partials/header"` in `{% include "partials/header" %}`
- **AND** the file `{workspaceRoot}/{templates.root}/partials/header` does not exist
- **AND** the file `{workspaceRoot}/{templates.root}/partials/header.twig` exists
- **THEN** the server returns a `Location` pointing to line 0, column 0 of the file with the appended extension

#### Scenario: Exact path takes priority over extension-appended path

- **WHEN** user triggers Go to Definition on a path string
- **THEN** the server SHALL try the exact path first
- **AND** only try appending the configured file extension if the exact path does not exist
- **AND** skip appending if the path already ends with the configured extension

#### Scenario: Single-quoted string

- **WHEN** user triggers Go to Definition on `'partials/header.twig'` (single quotes) in `{% include 'partials/header.twig' %}`
- **THEN** the server resolves the path identically to double-quoted strings

#### Scenario: File does not exist

- **WHEN** user triggers Go to Definition on a template path string
- **AND** neither the exact path nor the extension-appended path exists on disk
- **THEN** the server returns `null` (no definition found)

#### Scenario: Cursor not on string node

- **WHEN** user triggers Go to Definition on the `include` keyword itself
- **THEN** the server returns `null`

#### Scenario: String in non-include context

- **WHEN** user triggers Go to Definition on a string inside `{% set name = "hello" %}`
- **THEN** the server returns `null`

### Requirement: AST-Based Include Detection

The language server SHALL use the tree-sitter syntax tree to identify include tag contexts.

#### Scenario: Identify include statement_block

- **WHEN** the cursor is on a `string` node
- **AND** the `string` node's parent is a `statement_block`
- **AND** the `statement_block` has a `keyword` child with text `include`
- **THEN** the node is recognized as an include template path

#### Scenario: Non-include statement_block

- **WHEN** the cursor is on a `string` node inside a `statement_block`
- **AND** the `keyword` child text is not `include`
- **THEN** the node is NOT recognized as an include template path

#### Scenario: No tree available

- **WHEN** the document has no parsed tree (parser failed to initialize)
- **THEN** the server returns `null`

### Requirement: Workspace-Relative Path Resolution

The language server SHALL resolve template paths relative to workspace folders using the configured template root.

#### Scenario: Default template root

- **WHEN** user has not configured `twig-sense.templates.root`
- **THEN** template paths are resolved relative to `{workspaceRoot}/templates/`

#### Scenario: Custom template root

- **WHEN** user sets `twig-sense.templates.root` to `views`
- **THEN** template paths are resolved relative to `{workspaceRoot}/views/`

#### Scenario: Multiple workspace folders

- **WHEN** the client provides multiple workspace folders
- **THEN** the server tries each workspace folder in order
- **AND** returns the first match found

#### Scenario: Fallback to rootUri

- **WHEN** the client does not provide `workspaceFolders` in `InitializeParams`
- **AND** the client provides `rootUri`
- **THEN** the server uses `rootUri` as the single workspace folder

### Requirement: Template File Extension Configuration

The language server SHALL support a configurable file extension for template path resolution.

#### Scenario: Default file extension

- **WHEN** user has not configured `twig-sense.templates.fileExtension`
- **THEN** the default file extension is `.twig`

#### Scenario: Custom file extension

- **WHEN** user sets `twig-sense.templates.fileExtension` to `.html.twig`
- **THEN** extensionless paths are resolved by appending `.html.twig`

#### Scenario: Extension not appended when already present

- **WHEN** the template path already ends with the configured file extension
- **THEN** the extension is NOT appended again

### Requirement: Definition Provider Capability

The language server SHALL declare `definitionProvider` capability during LSP initialization.

#### Scenario: Capability declaration

- **WHEN** the server responds to `initialize` request
- **THEN** the returned capabilities include `definitionProvider: true`

#### Scenario: Provider registration

- **WHEN** the language server starts
- **THEN** a `DefinitionProvider` implementing `FeatureProvider` is registered with the `ProviderRegistry`
