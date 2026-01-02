# Twig Sense

A Visual Studio Code extension providing intelligent language support for Twig 3.x templates.

## Features

- **Syntax Highlighting** - Accurate tokenization with TextMate and Semantic Tokens
- **Code Completion** - Tags, filters, functions, and tests (coming soon)
- **Hover Documentation** - Inline docs for Twig built-ins (coming soon)

## Installation

Search for "Twig Sense" in the VSCode Extensions marketplace, or install from the command line:

```bash
code --install-extension twig-sense.twig-sense
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
