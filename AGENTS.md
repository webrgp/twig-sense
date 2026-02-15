# Project Context

## Purpose

VSCode Twig Sense is a comprehensive Visual Studio Code extension providing first-class language support for Twig 3.x templates. The goal is to make writing Twig templates as productive as writing JavaScript or TypeScript, with intelligent code completion, hover documentation, syntax highlighting, and support for embedded languages (HTML, CSS, JavaScript).

### Target Audience

- **Primary**: Developers working with Craft CMS, Symfony, or other PHP frameworks using Twig
- **Secondary**: Frontend developers who need to edit Twig templates occasionally
- **Tertiary**: Teams wanting to standardize on Twig tooling

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

### Architecture Patterns

- **Language Server Protocol**: Separate server and client for better isolation
- **Tree-sitter**: Use for parsing instead of regex-based parsing
- **Lazy Loading**: Heavy components loaded on demand
- **Incremental Parsing**: Parse only changed portions when possible
- **Aggressive Caching**: Cache with smart invalidation

### Testing Strategy

- Unit tests for parsing and completion logic
- Integration tests for LSP communication
- End-to-end tests for VSCode extension features
- Test coverage for all Twig built-ins (tags, filters, functions, tests)

### Git Workflow

- Main branch: `main`
- Feature branches: `feature/<description>`
- Conventional commits: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`
- Pull requests required for all changes

## Domain Context

### Twig Template Language

- Twig is a PHP templating engine (similar to Jinja2 for Python)
- Three delimiter types: `{{ }}` (output), `{% %}` (tags), `{# #}` (comments)
- Key constructs: tags, filters, functions, tests, operators
- Supports template inheritance (`extends`, `block`), includes, macros
- String interpolation with `#{}`

### Twig 3.x Built-ins

- **Tags**: `if`, `for`, `set`, `block`, `extends`, `include`, `macro`, `import`, `embed`, `with`, etc.
- **Filters**: `upper`, `lower`, `date`, `join`, `split`, `trim`, `escape`, `raw`, etc.
- **Functions**: `range`, `cycle`, `dump`, `date`, `include`, `source`, etc.
- **Tests**: `defined`, `empty`, `even`, `odd`, `iterable`, `same as`, etc.

### Framework Integrations

- **Craft CMS**: Custom tags (`{% css %}`, `{% js %}`), element types, entry fields
- **Symfony**: Twig extensions, form theming, asset management

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

### Reference Projects

- [twiggy](https://github.com/moetelo/twiggy) - Similar VSCode extension
- [twig-language-server](https://github.com/kaermorchen/twig-language-server) - LSP implementation
- [tree-sitter-twig](https://github.com/gbprod/tree-sitter-twig) - Existing grammar

### Key NPM Packages (Planned)

- `vscode-languageserver` / `vscode-languageclient` - LSP implementation
- `tree-sitter` / `web-tree-sitter` - Parser runtime
- `vscode-languageserver-textdocument` - Document handling

## Out of Scope

- Debugging Twig template execution (use Xdebug)
- Template rendering or preview (use browser)
- PHP language support (use separate PHP extensions)
- Database query tools
- Deployment or build tools
