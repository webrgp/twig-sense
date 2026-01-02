# Twig Sense

A Visual Studio Code extension providing intelligent language support for Twig 3.x templates.

## Features

- **Syntax Highlighting** - Accurate tokenization with TextMate and Semantic Tokens
- **HTML/CSS/JS IntelliSense** - Full HTML Language Server features in `.twig` files
- **Emmet Support** - Expand abbreviations directly in Twig templates
- **Twig Completions** - Keywords, filters, functions, and tests with snippets
- **Twig in HTML** - Syntax highlighting for Twig in plain `.html` files
- **Hover Documentation** - Inline docs for Twig built-ins (coming soon)

## Installation

Search for "Twig Sense" in the VSCode Extensions marketplace, or install from the command line:

```bash
code --install-extension twig-sense.twig-sense
```

## Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| `twig-sense.semanticTokens.enabled` | `true` | Enable semantic token highlighting powered by Tree-sitter |
| `twig-sense.html.semanticHighlighting` | `true` | Enable HTML semantic highlighting. Disable if experiencing conflicts |

### Emmet Configuration

Emmet works out of the box in `.twig` files. To customize Emmet behavior, add to your `settings.json`:

```json
{
  "emmet.includeLanguages": {
    "twig": "html"
  }
}
```

## Development

### Prerequisites

- Node.js 18+
- npm 9+

### Setup

```bash
# Install dependencies
npm install

# Build all packages
npm run build

# Watch mode (development)
npm run dev
```

### Debugging

1. Open the project in VSCode
2. Press F5 to launch Extension Development Host
3. Open a `.twig` file to test

### Project Structure

```
packages/
├── language-server/    # LSP server implementation
├── tree-sitter-twig/   # Tree-sitter grammar for Twig
└── vscode/             # VSCode extension client
```

## License

MIT
