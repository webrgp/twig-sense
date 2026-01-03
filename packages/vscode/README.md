# Twig Sense

Intelligent Twig 3.x template support for Visual Studio Code.

## Features

### Syntax Highlighting

Two-layer highlighting with TextMate (immediate) and Semantic Tokens (context-aware).

Supports Twig 3.15+ inline comments:

```twig
{{ user.name|capitalize # display formatted username }}

{% for item in items # iterate over collection %}
    {{ item.value }}
{% endfor %}
```

### Code Snippets

Type a prefix and press Tab to insert a snippet. All snippets use natural Twig keywords as prefixes.

| Prefix        | Description                      |
| ------------- | -------------------------------- |
| `if`          | If block                         |
| `ifelse`      | If/else block                    |
| `ifelseif`    | If/elseif/else block             |
| `for`         | For loop                         |
| `forelse`     | For loop with else (empty check) |
| `extends`     | Extends with initial block       |
| `block`       | Block definition                 |
| `embed`       | Embed with block override        |
| `include`     | Include statement                |
| `includewith` | Include with variables           |
| `import`      | Import macros                    |
| `from`        | From import                      |
| `macro`       | Macro definition                 |
| `set`         | Set variable (inline)            |
| `setblock`    | Set variable (block)             |
| `autoescape`  | Autoescape block                 |
| `spaceless`   | Spaceless block (via apply)      |
| `verbatim`    | Verbatim block (no parsing)      |
| `apply`       | Apply filter block               |
| `cache`       | Cache block                      |
| `with`        | With block (scoped variables)    |
| `sandbox`     | Sandbox block (untrusted code)   |
| `do`          | Do expression (side effects)     |

### Supported File Extensions

- `.twig`

## Settings

| Setting                             | Default | Description                        |
| ----------------------------------- | ------- | ---------------------------------- |
| `twig-sense.semanticTokens.enabled` | `true`  | Enable semantic token highlighting |

## Requirements

- VSCode 1.100.0 or higher

## Release Notes

### 0.1.0

- Initial release
- Basic syntax highlighting
- Language server connection

## License

MIT
