# block-tag-diagnostics Specification

## Purpose

Detect structural errors in Twig block tag usage — unclosed blocks, orphan closing tags, cross-nesting anomalies, misplaced mid-block keywords, and inline vs block-form set disambiguation — and expose analysis data that the diagnostic provider converts to LSP diagnostics.

## Requirements

### Requirement: Unclosed Block Tag Detection

The language server SHALL detect block tags that are opened but never closed and produce analysis data identifying the unclosed opening tag.

#### Scenario: Simple unclosed if

- **WHEN** a document contains `{% if condition %}` with no corresponding `{% endif %}`
- **THEN** the analysis result includes the `{% if %}` statement in the `unclosed` array
- **AND** the tag location includes keyword text, line, character, endLine, endCharacter

#### Scenario: Simple unclosed for

- **WHEN** a document contains `{% for item in items %}` with no corresponding `{% endfor %}`
- **THEN** the analysis result includes the `{% for %}` statement in the `unclosed` array

#### Scenario: Multiple unclosed tags

- **WHEN** a document contains `{% if %}` and `{% for %}` both without closing tags
- **THEN** the `unclosed` array contains entries for both tags

#### Scenario: Properly closed tags produce no unclosed entry

- **WHEN** a document contains `{% if condition %}...{% endif %}`
- **THEN** the `unclosed` array does not contain an entry for that `{% if %}`

#### Scenario: All block types supported

- **WHEN** any of `if`, `for`, `block`, `macro`, `apply`, `autoescape`, `embed`, `sandbox`, `verbatim`, `cache`, `set` (block-form), or `with` is opened without a matching closing tag
- **THEN** it appears in the `unclosed` array

#### Scenario: with/endwith pairing

- **WHEN** a document contains `{% with %}...{% endwith %}`
- **THEN** no entry appears in the `unclosed` array for that pair

#### Scenario: Unclosed with block

- **WHEN** a document contains `{% with %}` with no corresponding `{% endwith %}`
- **THEN** the `unclosed` array includes the `{% with %}` statement

### Requirement: Orphan Closing Tag Detection

The language server SHALL detect closing tags that have no corresponding opening tag and produce analysis data identifying the orphan closer.

#### Scenario: Orphan endif

- **WHEN** a document contains `{% endif %}` with no preceding `{% if %}`
- **THEN** the analysis result includes the `{% endif %}` in the `orphanClosers` array

#### Scenario: Orphan endfor

- **WHEN** a document contains `{% endfor %}` with no preceding `{% for %}`
- **THEN** the analysis result includes the `{% endfor %}` in the `orphanClosers` array

#### Scenario: Extra closing tag after valid pair

- **WHEN** a document contains `{% if %}...{% endif %}{% endif %}`
- **THEN** only the second `{% endif %}` appears in the `orphanClosers` array

#### Scenario: Unknown end keyword ignored

- **WHEN** a document contains an `end*` closing keyword whose base keyword is NOT a known block type (e.g., `{% enddeprecated %}`)
- **THEN** no entry is added to `orphanClosers`
- **AND** the unknown closing keyword is silently ignored

### Requirement: Cross-Nesting Anomaly Detection

The language server SHALL detect when a closing tag matches an opener by skipping over intermediate unclosed blocks, indicating a nesting structure error.

#### Scenario: Forgot endif inside for

- **WHEN** a document contains:
  ```
  {% for item in items %}
    {% if item.active %}
      {{ item }}
  {% endfor %}
  ```
- **THEN** a nesting error is recorded for the unclosed `{% if %}` that was "crossed over" when `{% endfor %}` matched `{% for %}`
- **AND** the `{% for %}`/`{% endfor %}` pair is matched successfully

#### Scenario: Crossed block with swapped closers

- **WHEN** a document contains:
  ```
  {% if condition %}
    {% for item in items %}
      {{ item }}
    {% endif %}
  {% endfor %}
  ```
- **THEN** when `{% endif %}` matches `{% if %}` by splicing past `{% for %}`, a nesting error is recorded
- **AND** the nesting error includes the outer tag, the inner (crossed) tag, and the closer that caused the cross

### Requirement: Inline Set Detection

The language server SHALL distinguish between inline `{% set %}` assignments and block-form `{% set %}` captures to avoid false unclosed entries.

#### Scenario: Inline set not tracked

- **WHEN** a document contains `{% set x = 1 %}`
- **THEN** the `set` keyword is NOT pushed to the pairing stack
- **AND** no entry appears in the `unclosed` array

#### Scenario: Block-form set without endset is tracked

- **WHEN** a document contains `{% set content %}` with no corresponding `{% endset %}`
- **THEN** the `unclosed` array includes the `{% set %}` statement

#### Scenario: Block-form set with endset is valid

- **WHEN** a document contains `{% set content %}...{% endset %}`
- **THEN** no entry appears in the `unclosed` array for that pair

#### Scenario: Inline set heuristic

- **WHEN** a `{% set %}` statement_block's named children contain an `operator` node with text `=`
- **THEN** it is treated as inline set and NOT pushed to the pairing stack

### Requirement: Mid-Block Keyword Validation

The language server SHALL validate that `else` and `elseif` keywords appear only inside their valid parent block contexts, checking only the innermost (stack top) open block.

#### Scenario: else inside if is valid

- **WHEN** a document contains `{% if condition %}...{% else %}...{% endif %}`
- **THEN** no entry appears in `misplacedKeywords` for the `{% else %}`

#### Scenario: else inside for is valid

- **WHEN** a document contains `{% for item in items %}...{% else %}...{% endfor %}`
- **THEN** no entry appears in `misplacedKeywords` for the `{% else %}` (this is Twig's for-else construct)

#### Scenario: else inside for with properly-closed nested block

- **WHEN** a document contains:
  ```
  {% for item in items %}
    {% if item.active %}
      {{ item }}
    {% endif %}
  {% else %}
    No items found.
  {% endfor %}
  ```
- **THEN** no entry appears in `misplacedKeywords` for the `{% else %}` because the innermost open block is `for` (the `if` was properly closed before the `else`)

#### Scenario: else outside any block

- **WHEN** a document contains `{% else %}` at the top level (not inside any block)
- **THEN** the `misplacedKeywords` array includes the `{% else %}` with valid parents `["if", "for"]`

#### Scenario: else inside non-if/for block

- **WHEN** a document contains:
  ```
  {% block content %}
    {% else %}
  {% endblock %}
  ```
- **THEN** the `misplacedKeywords` array includes the `{% else %}` with valid parents `["if", "for"]`

#### Scenario: elseif inside if is valid

- **WHEN** a document contains `{% if a %}...{% elseif b %}...{% endif %}`
- **THEN** no entry appears in `misplacedKeywords` for the `{% elseif %}`

#### Scenario: elseif inside for is invalid

- **WHEN** a document contains `{% for item in items %}...{% elseif condition %}...{% endfor %}`
- **THEN** the `misplacedKeywords` array includes the `{% elseif %}` with valid parents `["if"]`

#### Scenario: elseif outside any block

- **WHEN** a document contains `{% elseif condition %}` at the top level
- **THEN** the `misplacedKeywords` array includes the `{% elseif %}` with valid parents `["if"]`

#### Scenario: Strict innermost block check

- **WHEN** a document contains:
  ```
  {% for item in items %}
    {% block content %}
      {% else %}
    {% endblock %}
  {% endfor %}
  ```
- **THEN** the `misplacedKeywords` array includes the `{% else %}` because the innermost open block is `block`, not `for`

### Requirement: Backward-Compatible Scope Detection

The refactored `extractScopedBlocks()` SHALL maintain backward compatibility for `getScopeAtPosition()` and all existing scope-dependent features.

#### Scenario: scopedBlocks array unchanged

- **WHEN** `extractScopedBlocks()` is called
- **THEN** the `scopedBlocks` property of the returned `TagAnalysisResult` contains the same `ScopedBlockInfo[]` data as the previous implementation

#### Scenario: getScopeAtPosition works unchanged

- **WHEN** `getScopeAtPosition()` is called after the refactor
- **THEN** it returns identical scope information as before the refactor
- **AND** all existing scope-detection and completion tests pass

### Requirement: Clean Template Produces No Analysis Errors

#### Scenario: Clean template

- **WHEN** a template has all block tags properly paired and nested
- **THEN** the `unclosed`, `orphanClosers`, `nestingErrors`, and `misplacedKeywords` arrays are all empty

#### Scenario: Named endblock produces no errors

- **WHEN** a document contains `{% block header %}...{% endblock header %}`
- **THEN** no entries appear in any error arrays (the name after `endblock` is ignored for pairing purposes)
