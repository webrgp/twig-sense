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

| Setting                                | Default     | Description                                                              |
| -------------------------------------- | ----------- | ------------------------------------------------------------------------ |
| `twig-sense.semanticTokens.enabled`    | `true`      | Enable semantic token highlighting powered by Tree-sitter                |
| `twig-sense.html.semanticHighlighting` | `true`      | Enable HTML semantic highlighting. Disable if experiencing conflicts     |
| `twig-sense.completion.templateRoot`   | `templates` | Root directory for templates, relative to workspace. For path resolution |

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

### Testing

```bash
# Run all tests
npm test

# Run language server unit tests only
npm test --workspace=@twig-sense/language-server

# Run VS Code extension integration tests only
npm test --workspace=twig-sense

# Run language server tests in watch mode
npm run test:watch --workspace=@twig-sense/language-server
```

**Test Structure:**

- `packages/language-server/src/__tests__/` - Unit tests (Vitest)
  - `completions.test.ts` - Completion provider tests
  - `semantic-tokens.test.ts` - Semantic highlighting tests
  - `parser.test.ts` - Tree-sitter parser tests
- `packages/vscode/test/` - Integration tests (@vscode/test-cli)
  - `suite/extension.test.ts` - Extension activation and feature tests

### Code Quality

Pre-commit hooks automatically run on staged files:

| File Type                     | Checks                                   |
| ----------------------------- | ---------------------------------------- |
| `*.ts`                        | TypeScript typecheck → ESLint → Prettier |
| `*.json, *.md, *.yml, *.yaml` | Prettier                                 |

**Manual commands:**

```bash
# Type checking
npm run typecheck

# Linting
npm run lint          # Check for issues
npm run lint:fix      # Auto-fix issues

# Formatting
npm run format        # Format all files
npm run format:check  # Check formatting
```

### Project Structure

```
packages/
├── language-server/    # LSP server implementation
├── tree-sitter-twig/   # Tree-sitter grammar for Twig
└── vscode/             # VSCode extension client
```

## License

MIT
