## ADDED Requirements

### Requirement: HTML Language Participation
The extension SHALL register the `twig` language as an HTML language participant to receive HTML Language Server features.

#### Scenario: HTML completions in Twig files
- **WHEN** user types `<di` in a `.twig` file
- **THEN** HTML tag completions appear (e.g., `<div>`)

#### Scenario: HTML hover information
- **WHEN** user hovers over an HTML tag like `<section>` in a `.twig` file
- **THEN** MDN documentation for the tag is displayed

#### Scenario: HTML formatting
- **WHEN** user triggers format document in a `.twig` file
- **THEN** HTML structure is properly formatted

### Requirement: CSS IntelliSense
The extension SHALL enable CSS IntelliSense within `<style>` tags in Twig files.

#### Scenario: CSS property completions
- **WHEN** user types `col` inside a `<style>` tag in a `.twig` file
- **THEN** CSS property completions appear (e.g., `color`, `column-count`)

#### Scenario: CSS value completions
- **WHEN** user types `display: ` inside a `<style>` tag
- **THEN** CSS value completions appear (e.g., `flex`, `block`, `grid`)

### Requirement: JavaScript IntelliSense
The extension SHALL enable JavaScript IntelliSense within `<script>` tags in Twig files.

#### Scenario: JavaScript completions
- **WHEN** user types `document.get` inside a `<script>` tag in a `.twig` file
- **THEN** JavaScript method completions appear (e.g., `getElementById`)

### Requirement: Emmet Support
The extension SHALL enable Emmet abbreviation expansion in Twig files.

#### Scenario: Emmet HTML expansion
- **WHEN** user types `ul>li*3` and presses Tab in a `.twig` file
- **THEN** the abbreviation expands to `<ul><li></li><li></li><li></li></ul>`

#### Scenario: Emmet CSS expansion
- **WHEN** user types `m10` inside a `<style>` tag and presses Tab
- **THEN** the abbreviation expands to `margin: 10px;`

### Requirement: Twig Completions
The language server SHALL provide context-aware completions for Twig keywords, filters, and functions.

#### Scenario: Tag keyword completions
- **WHEN** user types `{% ` in a Twig file
- **THEN** Twig tag keywords appear (e.g., `if`, `for`, `block`, `extends`)

#### Scenario: Filter completions
- **WHEN** user types `{{ variable|` in a Twig file
- **THEN** Twig filter completions appear (e.g., `upper`, `lower`, `date`)

#### Scenario: Function completions
- **WHEN** user types `{{ ` in a Twig file
- **THEN** Twig function completions appear (e.g., `range`, `dump`, `date`)

### Requirement: Twig Injection into HTML Files
The extension SHALL inject Twig syntax highlighting into plain HTML files.

#### Scenario: Twig highlighting in HTML
- **WHEN** a `.html` file contains `{{ variable }}`
- **THEN** the Twig syntax is highlighted with Twig token colors

#### Scenario: Twig tags in HTML
- **WHEN** a `.html` file contains `{% if condition %}...{% endif %}`
- **THEN** the Twig tags are highlighted as keywords

### Requirement: HTML Semantic Highlighting Configuration
The extension SHALL provide a setting to control HTML semantic highlighting in Twig files.

#### Scenario: Default enabled
- **WHEN** the extension is installed with default settings
- **THEN** HTML semantic highlighting is enabled in Twig files

#### Scenario: User disables HTML semantic highlighting
- **WHEN** user sets `twig-sense.html.semanticHighlighting` to `false`
- **THEN** HTML semantic highlighting is disabled for Twig files
- **AND** only TextMate grammar highlighting is used for HTML content
