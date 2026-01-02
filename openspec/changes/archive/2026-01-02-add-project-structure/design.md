# Design: Project Structure

## Context
VSCode Twig Sense is a new extension providing language support for Twig 3.x templates. The architecture follows the Language Server Protocol (LSP) pattern, separating the language intelligence from the editor integration. A custom Tree-sitter grammar provides accurate parsing for context-aware features.

## Reference
Based on the official [vscode-generator-code](https://github.com/Microsoft/vscode-generator-code) templates, adapted for a monorepo setup with npm workspaces.

## Goals
- Clean separation between language server, parser, and VSCode client
- Share TypeScript configuration and tooling across packages
- Enable independent development and testing of each package
- Support both TextMate and Semantic Token highlighting

## Non-Goals
- Support for other editors (focus on VSCode first)
- Publishing packages to npm (internal workspace packages only)
- Monorepo tooling like Turborepo or Nx (keep it simple with npm workspaces)

## Decisions

### npm workspaces over pnpm
**Decision**: Use npm workspaces instead of pnpm
**Rationale**: tree-sitter-cli cannot install its platform-specific binary with pnpm's nested node_modules structure. npm workspaces use hoisted node_modules which resolves this compatibility issue.

### Three-package structure
**Decision**: Separate into `@twig-sense/language-server`, `@twig-sense/tree-sitter-twig`, and `@twig-sense/vscode`
**Rationale**:
- Language server can potentially be used with other editors
- Tree-sitter grammar is independently testable
- VSCode extension stays thin (primarily LSP client)

### Two-layer syntax highlighting
**Decision**: Use both TextMate grammar and LSP Semantic Tokens
**Rationale**:
- TextMate provides immediate highlighting on file open (before LSP ready)
- Semantic Tokens from LSP provide context-aware highlighting powered by Tree-sitter
- VSCode overlays semantic tokens on TextMate, giving best of both worlds

### esbuild for bundling
**Decision**: Use esbuild for bundling TypeScript (following official generator pattern)
**Rationale**: 10-100x faster than webpack/rollup, minimal configuration, officially supported by VSCode generator.

### Standard VSCode extension conventions
**Decision**: Follow patterns from vscode-generator-code:
- Output to `out/` directory (unbundled) or `dist/` (bundled)
- Use `@vscode/test-cli` and `@vscode/test-electron` for testing
- Include `.vscodeignore` for package exclusions
- Use `eslint.config.mjs` (flat config format)
- TypeScript: `module: "Node16"`, `target: "ES2022"`, `strict: true`

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    VSCode Extension                      │
│                 (@twig-sense/vscode)                     │
│  ┌─────────────────────────────────────────────────┐   │
│  │ extension.ts - Starts server, handles UI events │   │
│  └──────────────────────┬──────────────────────────┘   │
└─────────────────────────┼───────────────────────────────┘
                          │ JSON-RPC (stdio)
┌─────────────────────────▼───────────────────────────────┐
│                   Language Server                        │
│            (@twig-sense/language-server)                 │
│  ┌──────────────────────────────────────────────────┐  │
│  │ server.ts - Handles LSP requests                  │  │
│  │   ├── completions/     → textDocument/completion  │  │
│  │   ├── semantic-tokens/ → textDocument/semanticTok │  │
│  │   ├── hovers/          → textDocument/hover       │  │
│  │   └── ...                                         │  │
│  └──────────────────────┬───────────────────────────┘  │
└─────────────────────────┼───────────────────────────────┘
                          │ uses
┌─────────────────────────▼───────────────────────────────┐
│                  Tree-sitter Parser                      │
│            (@twig-sense/tree-sitter-twig)                │
│  ┌──────────────────────────────────────────────────┐  │
│  │ grammar.js → Parses Twig into syntax trees        │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Tree-sitter grammar complexity | Start minimal, add constructs incrementally |
| LSP startup latency | TextMate provides immediate highlighting while server starts |
| npm workspace hoisting issues | Use explicit dependencies, avoid version conflicts |

## Resolved Decisions

### File extension support
**Decision**: Register only `.twig` under the `twig` language ID
**Rationale**: Simplicity and user familiarity. Additional extensions (like `.html.twig`) can be added later through user settings if needed.

### VSCode version target
**Decision**: Target VSCode `^1.100.0`
**Rationale**: Ensures compatibility with latest APIs and features.

### Extension publisher ID
**Decision**: Use `twig-sense` as the publisher ID
**Rationale**: Reflects the project name and maintains consistency across platforms.

### Semantic tokens default
**Decision**: Enable semantic tokens by default, with opt-out setting
**Rationale**: Provides best experience out of the box while allowing users who prefer TextMate-only highlighting to disable it.

### Tree-sitter grammar scope
**Decision**: Start with minimal grammar focusing on delimiters
**Rationale**: Incremental approach - full Twig syntax support will be added later.

### License
**Decision**: MIT License
**Rationale**: Standard permissive license, common for VSCode extensions.

### Extension activation
**Decision**: Use `onLanguage:twig` activation event
**Rationale**: Lazy activation - extension only loads when a `.twig` file is opened, reducing VSCode startup time.

### Tree-sitter WASM bundling
**Decision**: Bundle WASM into the extension
**Rationale**: Simpler distribution, no runtime loading complexity. Size trade-off acceptable for reliability.

## README Content

### Root README.md

```markdown
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
```

### packages/vscode/README.md (Marketplace)

```markdown
# Twig Sense

Intelligent Twig 3.x template support for Visual Studio Code.

## Features

### Syntax Highlighting
Two-layer highlighting with TextMate (immediate) and Semantic Tokens (context-aware).

![Syntax Highlighting](images/highlighting.png)

### Supported File Extensions
- `.twig`

## Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `twig-sense.semanticTokens.enabled` | `true` | Enable semantic token highlighting |

## Requirements

- VSCode 1.100.0 or higher

## Release Notes

### 0.1.0
- Initial release
- Basic syntax highlighting
- Language server connection

## License

MIT
```

## Deferred (Future Work)
- Marketplace publisher registration (required before first publish)
- Pre-commit hooks with husky + lint-staged
- CONTRIBUTING.md documentation
- CI/CD GitHub Actions workflow
