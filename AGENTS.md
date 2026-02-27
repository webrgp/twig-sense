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

<!-- BEGIN BEADS INTEGRATION -->
## Task Tracking (Beads)

This project uses [Beads](https://github.com/steveyegge/beads) (`bd`) for persistent, git-backed task tracking. Use `bd` for ALL task tracking instead of markdown files or in-memory lists.

### Core Rules

- **Default**: Use beads for all task tracking (`bd create`, `bd ready`, `bd close`)
- **Workflow**: Create a beads issue BEFORE writing code, mark `in_progress` when starting
- **WARNING**: Do NOT use `bd edit` - it opens `$EDITOR` which blocks agents. Use `bd update` with flags instead.

### Essential Commands

| Command                                                                              | Action                             |
| ------------------------------------------------------------------------------------ | ---------------------------------- |
| `bd ready`                                                                           | List tasks with no open blockers   |
| `bd list --status=open`                                                              | All open issues                    |
| `bd list --status=in_progress`                                                       | Active work                        |
| `bd show <id>`                                                                       | View task details and dependencies |
| `bd create --title="..." --description="..." --type=task\|bug\|feature --priority=2` | Create a new issue                 |
| `bd update <id> --status=in_progress`                                                | Claim work                         |
| `bd close <id>`                                                                      | Mark complete                      |
| `bd close <id1> <id2> ...`                                                           | Close multiple issues at once      |
| `bd dep add <issue> <depends-on>`                                                    | Add dependency                     |
| `bd sync`                                                                            | Sync with git remote               |
| `bd stats`                                                                           | Project statistics                 |

Priority values: 0-4 (0=critical, 2=medium, 4=backlog). Do NOT use "high"/"medium"/"low".

### Typical Workflow

```bash
bd ready                              # Find available work
bd show <id>                          # Review issue details
bd update <id> --status=in_progress   # Claim it
# ... do the work ...
bd close <id> --reason="Completed"    # Close when done
bd sync                               # Push to remote
```

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
<!-- END BEADS INTEGRATION -->
