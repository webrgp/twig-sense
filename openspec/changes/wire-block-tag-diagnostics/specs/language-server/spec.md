## MODIFIED Requirements

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

### Requirement: Inline Comment Validation

The language server SHALL validate inline comment usage and warn when closing delimiters appear on the same line as an inline comment.

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
