## ADDED Requirements

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
