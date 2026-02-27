# Project Context

## Purpose

VSCode Twig Sense is a comprehensive Visual Studio Code extension providing first-class language support for Twig 3.x templates. The goal is to make writing Twig templates as productive as writing JavaScript or TypeScript, with intelligent code completion, hover documentation, syntax highlighting, and support for embedded languages (HTML, CSS, JavaScript).

## Tech Stack

- **Language**: TypeScript
- **Runtime**: Node.js
- **Extension Framework**: VSCode Extension API
- **Parser**: Tree-sitter (tree-sitter-twig grammar)
- **Protocol**: Language Server Protocol (LSP)
- **Package Manager**: pnpm (monorepo)
- **Build Tool**: esbuild or tsup (for bundling)
- **Testing**: Vitest

## Project Structure

Monorepo with three packages:

- `packages/language-server` - LSP implementation providing core language features
- `packages/tree-sitter-twig` - Tree-sitter grammar for Twig template parsing
- `packages/vscode` - VSCode extension package (client)

## Project Conventions

### Code Style

- TypeScript strict mode enabled
- ESLint with recommended rules
- Prettier for formatting
- Prefer functional patterns where appropriate
- Use explicit types for public APIs, infer types for internal code
- Naming: camelCase for variables/functions, PascalCase for types/classes

### Testing Strategy

- Unit tests for parsing and completion logic
- Integration tests for LSP communication
- End-to-end tests for VSCode extension features
- Test coverage for all Twig built-ins (tags, filters, functions, tests)

## Important Constraints

### Performance

- Must remain responsive in files up to 10,000 lines
- Completions should appear within 100ms
- Memory footprint should stay under 100MB

### Compatibility

- Support Twig 3.x as primary, graceful degradation for Twig 2.x
- VSCode version: 1.75.0 minimum
- Node.js: 18.x minimum

### Design Principles

1. **Zero Configuration**: Works immediately after installation
2. **Progressive Enhancement**: Core features first, advanced features incrementally
3. **Graceful Degradation**: Continue providing features even with syntax errors
4. **Developer-Centric**: Optimize for common workflows

## External Dependencies

## Out of Scope

- Debugging Twig template execution (use Xdebug)
- Template rendering or preview (use browser)
- PHP language support (use separate PHP extensions)
- Database query tools
- Deployment or build tools

## Landing the Plane (Session Completion)

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   bd sync
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**

- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds
