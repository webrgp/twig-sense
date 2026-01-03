# Capability: Snippets

Provides code snippets for common Twig structures through both VS Code native snippets and LSP completions.

## ADDED Requirements

### Requirement: VS Code native snippets MUST be registered

The extension SHALL contribute a snippets file for the Twig language via `package.json`.

#### Scenario: Snippets file is registered in package.json

- Given the extension's `package.json`
- Then `contributes.snippets` contains an entry for language `twig`
- And the entry points to `./snippets/twig.json`

#### Scenario: Snippets file exists and is valid JSON

- Given the snippets file at `packages/vscode/snippets/twig.json`
- Then the file is valid JSON
- And each snippet has `prefix`, `body`, and `description` properties

---

### Requirement: Control structure snippets MUST be available

The extension SHALL provide snippets for Twig control flow structures.

#### Scenario: If block snippet

- Given the user types `if` in a Twig file
- When they trigger snippet completion
- Then a snippet is inserted with the structure:
  ```
  {% if ${1:condition} %}
      $0
  {% endif %}
  ```

#### Scenario: If/else block snippet

- Given the user types `ifelse` in a Twig file
- When they trigger snippet completion
- Then a snippet is inserted with the structure:
  ```
  {% if ${1:condition} %}
      $2
  {% else %}
      $0
  {% endif %}
  ```

#### Scenario: If/elseif/else block snippet

- Given the user types `ifelseif` in a Twig file
- When they trigger snippet completion
- Then a snippet is inserted with the structure:
  ```
  {% if ${1:condition} %}
      $2
  {% elseif ${3:condition} %}
      $4
  {% else %}
      $0
  {% endif %}
  ```

#### Scenario: For loop snippet

- Given the user types `for` in a Twig file
- When they trigger snippet completion
- Then a snippet is inserted with the structure:
  ```
  {% for ${1:item} in ${2:items} %}
      $0
  {% endfor %}
  ```

#### Scenario: For/else loop snippet (empty collection)

- Given the user types `forelse` in a Twig file
- When they trigger snippet completion
- Then a snippet is inserted with the structure:
  ```
  {% for ${1:item} in ${2:items} %}
      $3
  {% else %}
      $0
  {% endfor %}
  ```

---

### Requirement: Template inheritance snippets MUST be available

The extension SHALL provide snippets for Twig template inheritance structures.

#### Scenario: Extends with block snippet

- Given the user types `extends` in a Twig file
- When they trigger snippet completion
- Then a snippet is inserted with the structure:

  ```
  {% extends '${1:base.twig}' %}

  {% block ${2:content} %}
      $0
  {% endblock %}
  ```

#### Scenario: Block snippet

- Given the user types `block` in a Twig file
- When they trigger snippet completion
- Then a snippet is inserted with the structure:
  ```
  {% block ${1:name} %}
      $0
  {% endblock %}
  ```

#### Scenario: Embed snippet

- Given the user types `embed` in a Twig file
- When they trigger snippet completion
- Then a snippet is inserted with the structure:
  ```
  {% embed '${1:template}' %}
      {% block ${2:name} %}
          $0
      {% endblock %}
  {% endembed %}
  ```

---

### Requirement: Include and import snippets MUST be available

The extension SHALL provide snippets for Twig include and import statements.

#### Scenario: Include snippet

- Given the user types `include` in a Twig file
- When they trigger snippet completion
- Then a snippet is inserted with:
  ```
  {% include '${1:template}' %}
  ```

#### Scenario: Include with variables snippet

- Given the user types `includewith` in a Twig file
- When they trigger snippet completion
- Then a snippet is inserted with:
  ```
  {% include '${1:template}' with { ${2:key}: ${3:value} } %}
  ```

#### Scenario: Import snippet

- Given the user types `import` in a Twig file
- When they trigger snippet completion
- Then a snippet is inserted with:
  ```
  {% import '${1:template}' as ${2:name} %}
  ```

#### Scenario: From import snippet

- Given the user types `from` in a Twig file
- When they trigger snippet completion
- Then a snippet is inserted with:
  ```
  {% from '${1:template}' import ${2:macro} %}
  ```

---

### Requirement: Macro definition snippets MUST be available

The extension SHALL provide snippets for defining Twig macros.

#### Scenario: Macro snippet

- Given the user types `macro` in a Twig file
- When they trigger snippet completion
- Then a snippet is inserted with:
  ```
  {% macro ${1:name}(${2:args}) %}
      $0
  {% endmacro %}
  ```

---

### Requirement: Variable assignment snippets MUST be available

The extension SHALL provide snippets for Twig variable assignment.

#### Scenario: Set snippet (inline)

- Given the user types `set` in a Twig file
- When they trigger snippet completion
- Then a snippet is inserted with:
  ```
  {% set ${1:name} = ${2:value} %}
  ```

#### Scenario: Set block snippet (multi-line)

- Given the user types `setblock` in a Twig file
- When they trigger snippet completion
- Then a snippet is inserted with:
  ```
  {% set ${1:name} %}
      $0
  {% endset %}
  ```

---

### Requirement: Utility block snippets MUST be available

The extension SHALL provide snippets for Twig utility blocks.

#### Scenario: Autoescape snippet

- Given the user types `autoescape` in a Twig file
- When they trigger snippet completion
- Then a snippet is inserted with:
  ```
  {% autoescape '${1|html,js,css,url|}' %}
      $0
  {% endautoescape %}
  ```

#### Scenario: Spaceless snippet

- Given the user types `spaceless` in a Twig file
- When they trigger snippet completion
- Then a snippet is inserted with:
  ```
  {% apply spaceless %}
      $0
  {% endapply %}
  ```

#### Scenario: Verbatim snippet

- Given the user types `verbatim` in a Twig file
- When they trigger snippet completion
- Then a snippet is inserted with:
  ```
  {% verbatim %}
      $0
  {% endverbatim %}
  ```

#### Scenario: Apply filter snippet

- Given the user types `apply` in a Twig file
- When they trigger snippet completion
- Then a snippet is inserted with:
  ```
  {% apply ${1:filter} %}
      $0
  {% endapply %}
  ```

#### Scenario: Cache snippet

- Given the user types `cache` in a Twig file
- When they trigger snippet completion
- Then a snippet is inserted with:
  ```
  {% cache '${1:key}' %}
      $0
  {% endcache %}
  ```

#### Scenario: With snippet

- Given the user types `with` in a Twig file
- When they trigger snippet completion
- Then a snippet is inserted with:
  ```
  {% with { ${1:key}: ${2:value} } %}
      $0
  {% endwith %}
  ```

#### Scenario: Sandbox snippet

- Given the user types `sandbox` in a Twig file
- When they trigger snippet completion
- Then a snippet is inserted with:
  ```
  {% sandbox %}
      $0
  {% endsandbox %}
  ```

#### Scenario: Do snippet

- Given the user types `do` in a Twig file
- When they trigger snippet completion
- Then a snippet is inserted with:
  ```
  {% do ${1:expression} %}
  ```

---

### Requirement: LSP completions MUST provide multi-line snippet alternatives

The language server SHALL provide multi-line snippet variants for block structures.

#### Scenario: LSP provides multi-line if completion

- Given a Twig document with `{% |` (cursor after opening)
- When completions are requested
- Then the `if` completion has a multi-line `insertText` with `{% if %}...{% endif %}`
- And `insertTextFormat` is set to `Snippet`

#### Scenario: LSP provides multi-line for completion

- Given a Twig document with `{% |` (cursor after opening)
- When completions are requested
- Then the `for` completion has a multi-line `insertText` with `{% for %}...{% endfor %}`
- And `insertTextFormat` is set to `Snippet`

#### Scenario: LSP provides multi-line block completion

- Given a Twig document with `{% |` (cursor after opening)
- When completions are requested
- Then the `block` completion has a multi-line `insertText` with `{% block %}...{% endblock %}`
- And `insertTextFormat` is set to `Snippet`
