## ADDED Requirements

### Requirement: Typed Configuration Interface

The language server SHALL define a TypeScript interface for all configuration options with explicit types and default values.

#### Scenario: Configuration type safety

- **WHEN** code accesses configuration properties
- **THEN** TypeScript provides type checking and autocompletion for all configuration paths

#### Scenario: Default values applied

- **WHEN** user has partial or no configuration
- **THEN** sensible defaults are applied via `mergeWithDefaults()` function

#### Scenario: Configuration schema consistency

- **WHEN** the TwigSenseConfig interface is compared to package.json contributes
- **THEN** all properties match in name and type
