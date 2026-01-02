# Change: Add Initial Project Structure

## Why
The VSCode Twig Sense extension needs a foundational project structure to support development of language features. A well-organized monorepo with npm workspaces enables clean separation between the language server, parser, and VSCode client while sharing tooling and types.

## What Changes
- Initialize npm workspaces monorepo with three packages
- Set up TypeScript, ESLint, and Prettier configuration
- Configure esbuild for bundling
- Create VSCode extension scaffolding with language registration
- Create language server scaffolding with LSP connection
- Create tree-sitter-twig package for custom grammar development
- Set up two-layer syntax highlighting (TextMate + Semantic Tokens)

## Impact
- Affected specs: project-structure (new), syntax-highlighting (new), language-server (new)
- Affected code: All files (greenfield project)
- Dependencies: Node.js 18+, npm 9+, tree-sitter-cli

## Success Criteria
- `npm install` completes without errors
- `npm run build` produces bundled outputs
- Extension loads in VSCode Extension Development Host
- Language server starts and establishes connection
- `.twig` files get basic syntax highlighting
