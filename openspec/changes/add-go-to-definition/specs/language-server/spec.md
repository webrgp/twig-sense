## MODIFIED Requirements

### Requirement: Template Root Configuration

The extension SHALL provide configuration settings for template path resolution under the `twig-sense.templates` namespace.

#### Scenario: Default template root

- **WHEN** user has not configured `twig-sense.templates.root`
- **THEN** the default value is `templates` relative to workspace root

#### Scenario: Custom template root

- **WHEN** user sets `twig-sense.templates.root` to `views`
- **THEN** template path resolution uses `views` as the root directory

#### Scenario: Default file extension

- **WHEN** user has not configured `twig-sense.templates.fileExtension`
- **THEN** the default value is `.twig`

#### Scenario: Custom file extension

- **WHEN** user sets `twig-sense.templates.fileExtension` to `.html.twig`
- **THEN** template path resolution appends `.html.twig` to extensionless paths

### Requirement: Typed Configuration Interface

The language server SHALL define a TypeScript interface for all configuration options with explicit types and default values.

#### Scenario: Configuration type safety

- **WHEN** code accesses configuration properties
- **THEN** TypeScript provides type checking and autocompletion for all configuration paths
- **AND** this includes the `diagnostics.blockTags` property
- **AND** this includes the `templates.root` and `templates.fileExtension` properties

#### Scenario: Default values applied

- **WHEN** user has partial or no configuration
- **THEN** sensible defaults are applied via `mergeWithDefaults()` function
- **AND** `diagnostics.blockTags` defaults to `true`
- **AND** `templates.root` defaults to `"templates"`
- **AND** `templates.fileExtension` defaults to `".twig"`

#### Scenario: Configuration schema consistency

- **WHEN** the TwigSenseConfig interface is compared to package.json contributes
- **THEN** all properties match in name and type
- **AND** `twig-sense.templates.root` is present in both
- **AND** `twig-sense.templates.fileExtension` is present in both

### Requirement: Server capabilities

The language server SHALL declare all registered provider capabilities during initialization.

#### Scenario: Server capabilities

- **WHEN** the server responds to `initialize` request
- **THEN** it declares support for `textDocumentSync`, `completionProvider`, `semanticTokensProvider`, and `definitionProvider`

## ADDED Requirements

### Requirement: Provider Context Workspace Access

The `ProviderContext` SHALL include workspace folder information so providers can resolve workspace-relative paths.

#### Scenario: Workspace folders available to providers

- **WHEN** a provider's `register()` method is called with `ProviderContext`
- **THEN** the context includes a `workspaceFolders` property containing the client's workspace folders

#### Scenario: Fallback from rootUri

- **WHEN** the client's `InitializeParams` does not include `workspaceFolders`
- **AND** the client provides `rootUri`
- **THEN** `ProviderContext.workspaceFolders` contains a single entry derived from `rootUri`

## REMOVED Requirements

### Requirement: completion.templateRoot configuration path

**Reason**: The `twig-sense.completion.templateRoot` configuration path is replaced by `twig-sense.templates.root` as part of moving template-related configuration to a dedicated namespace.

**Migration**: Change `twig-sense.completion.templateRoot` to `twig-sense.templates.root` in settings. The default value (`"templates"`) is unchanged.
