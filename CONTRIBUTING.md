# Contributing to Twig Sense

Thank you for your interest in contributing to Twig Sense! This guide will help you get started.

## Quick Start

### Prerequisites

- Node.js 18+
- npm 9+

### Setup

```bash
# Clone the repository
git clone https://github.com/your-username/twig-sense.git
cd twig-sense

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

## Project Structure

```
packages/
├── language-server/    # LSP server implementation
├── tree-sitter-twig/   # Tree-sitter grammar for Twig
└── vscode/             # VSCode extension client
```

For detailed architecture documentation, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Testing

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

### Testing Requirements for New Features

When adding new features:

1. Add unit tests covering the core logic
2. Add integration tests if the feature involves VSCode extension behavior
3. Ensure all existing tests pass before submitting

## Code Quality

Pre-commit hooks automatically run on staged files:

| File Type                     | Checks                                 |
| ----------------------------- | -------------------------------------- |
| `*.ts`                        | TypeScript typecheck, ESLint, Prettier |
| `*.json, *.md, *.yml, *.yaml` | Prettier                               |

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

## Code Style Guidelines

- Use TypeScript for all source code
- Follow the existing code patterns in the codebase
- Use meaningful variable and function names
- Keep functions focused and small
- Add JSDoc comments for public APIs
- Prefer `const` over `let` when variables aren't reassigned
- Use early returns to reduce nesting

## Git Workflow

### Branch Naming

Use descriptive branch names:

- `feat/add-hover-support` - New features
- `fix/completion-in-macros` - Bug fixes
- `docs/update-architecture` - Documentation changes
- `refactor/extract-parser` - Code refactoring

### Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]
```

**Types:**

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation only
- `style` - Formatting, no code change
- `refactor` - Code change that neither fixes a bug nor adds a feature
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

**Examples:**

```
feat(completion): add support for macro parameters
fix(parser): handle unclosed tags gracefully
docs: update architecture diagram
```

### Pull Request Process

1. Create a branch from `main`
2. Make your changes with clear, focused commits
3. Ensure all tests pass (`npm test`)
4. Ensure code quality checks pass (`npm run typecheck && npm run lint`)
5. Push your branch and open a pull request
6. Describe what your PR does and why
7. Link any related issues

## Adding New LSP Features

See the [Adding a New LSP Feature](docs/ARCHITECTURE.md#adding-a-new-lsp-feature) section in the architecture documentation for a step-by-step guide.

## License

By contributing to Twig Sense, you agree that your contributions will be licensed under the MIT License.
