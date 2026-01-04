# Architecture

This document describes the architecture of Twig Sense, a Language Server Protocol (LSP) implementation for Twig templates.

## Package Structure

The project is organized as an npm workspaces monorepo with three packages:

```
packages/
├── language-server/    # LSP server implementation
├── tree-sitter-twig/   # Tree-sitter grammar for Twig
└── vscode/             # VSCode extension client
```

### @twig-sense/tree-sitter-twig

Provides the Tree-sitter grammar that parses Twig templates into concrete syntax trees (CST). The grammar is compiled to a WASM binary (`tree-sitter-twig.wasm`) used by the language server.

### @twig-sense/language-server

The LSP server implementation. Provides language intelligence features:

- Completions (keywords, filters, functions, variables, macros)
- Semantic token highlighting
- Diagnostics

**Entry point:** `src/index.ts`

### twig-sense (VSCode Extension)

The VSCode extension client. Registers the Twig language, provides TextMate syntax highlighting, and spawns the language server process.

**Entry point:** `src/extension.ts`

## Core Components

### DocumentManager

**Location:** `packages/language-server/src/document-manager.ts`

Manages the document lifecycle and parsing:

- Stores `TextDocument` objects indexed by URI
- Lazily initializes the Tree-sitter parser on first document open
- Parses documents and maintains the parse tree cache
- Uses incremental parsing for document changes (performance optimization)
- Provides event-driven architecture via `onDidParse()` handlers

**Key methods:**

- `getDocument(uri)` - Returns TextDocument by URI
- `getTree(uri)` - Returns parsed Tree by URI
- `register()` - Registers document lifecycle handlers with the LSP connection

### ProviderRegistry

**Location:** `packages/language-server/src/providers/registry.ts`

Central registry for all LSP feature providers:

- Manages provider registration with duplicate detection
- Aggregates server capabilities from all providers during initialization
- Initializes all providers with shared context
- Handles cleanup on server shutdown

**Key methods:**

- `register(provider)` - Adds a provider to the registry
- `getCapabilities()` - Collects capabilities from all providers
- `initializeAll(context)` - Initializes providers with connection and document manager

### Feature Providers

All providers implement the `FeatureProvider` interface (`src/providers/types.ts`):

```typescript
interface FeatureProvider {
  readonly id: string;
  getCapabilities(): ServerCapabilities;
  register(context: ProviderContext): void;
  dispose?(): void;
}
```

**CompletionProvider** (`src/providers/completion-provider.ts`)

- Handles `textDocument/completion` requests
- Delegates to completion strategies based on cursor context

**SemanticTokensProvider** (`src/providers/semantic-tokens-provider.ts`)

- Provides semantic token highlighting
- Supports 8 token types and 3 modifiers
- Respects user configuration to enable/disable

**DiagnosticsProvider** (`src/providers/diagnostics-provider.ts`)

- Pushes diagnostics on document parse events
- Validates inline comments if enabled

## Data Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         VSCode Extension                            │
│  ┌───────────────┐                                                  │
│  │ LanguageClient│◄──────── STDIO ────────►┌──────────────────────┐│
│  └───────────────┘                         │   Language Server    ││
│                                            │                      ││
│                                            │  ┌────────────────┐  ││
│                                            │  │ProviderRegistry│  ││
│                                            │  └───────┬────────┘  ││
│                                            │          │           ││
│                                            │  ┌───────▼────────┐  ││
│                                            │  │DocumentManager │  ││
│                                            │  └───────┬────────┘  ││
│                                            │          │           ││
│                                            │  ┌───────▼────────┐  ││
│                                            │  │  Tree-sitter   │  ││
│                                            │  │    Parser      │  ││
│                                            │  └────────────────┘  ││
│                                            └──────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
```

### Request Flow: Completion Example

1. **User types** in a `.twig` file, triggering completion
2. **VSCode** sends `textDocument/completion` request via STDIO
3. **CompletionProvider** receives the request:
   - Retrieves document and tree from DocumentManager
   - Detects context at cursor position (output, block, filter)
   - Delegates to appropriate completion strategy
4. **Completion Strategy** (e.g., `BlockContextStrategy`):
   - Filters keywords by current scope
   - Uses DocumentAnalyzer to extract variables and macros
   - Returns completion items
5. **Response** sent back to VSCode

### Document Lifecycle

1. **Open:** DocumentManager creates TextDocument, parses it, caches tree, emits parse event
2. **Change:** DocumentManager updates document, performs incremental parse, emits parse event
3. **Close:** DocumentManager removes document, deletes tree from cache

Parse events trigger DiagnosticsProvider to validate and push diagnostics.

## Completion System

### Context Detection

**Location:** `packages/language-server/src/context/twig-context.ts`

Analyzes cursor position to determine the Twig context:

- `"output"` - Inside `{{ ... }}`
- `"block"` - Inside `{% ... %}`
- `"filter"` - After `|` character
- `"none"` - Not in Twig syntax

Additional detection for special cases:

- After `is` keyword (for test completions)
- After `loop.` (for loop variable completions)
- Inside `block('...')` function
- After `{% block ` keyword

### Completion Strategies

**Location:** `packages/language-server/src/completions/strategies/`

Each context has a dedicated strategy:

| Strategy                | Context     | Provides                                      |
| ----------------------- | ----------- | --------------------------------------------- |
| `BlockContextStrategy`  | `{% ... %}` | Keywords, functions, variables, macros, tests |
| `OutputContextStrategy` | `{{ ... }}` | Functions, variables, macros                  |
| `FilterContextStrategy` | After `\|`  | Filters only                                  |

### Document Analysis

**Location:** `packages/language-server/src/document-analyzer.ts`

Extracts semantic information from parsed trees:

- `extractSetVariables()` - Variables from `{% set %}`
- `extractForLoops()` - For loops and their variables
- `extractMacros()` - Macro definitions and parameters
- `extractBlocks()` - Block definitions
- `getScopeAtPosition()` - Determines scopes at cursor position
- `getAvailableVariables()` - Variables accessible at cursor

### Static Data

**Location:** `packages/language-server/src/data/`

Built-in Twig language data:

- `TWIG_KEYWORDS` - Control structure keywords
- `TWIG_FILTERS` - Built-in filters
- `TWIG_FUNCTIONS` - Built-in functions
- `TWIG_TESTS` - Tests (used with `is` keyword)
- `LOOP_VARIABLE_COMPLETIONS` - Loop variables (loop.index, etc.)

## Adding a New LSP Feature

To add a new feature (e.g., hover documentation):

### 1. Create the Provider

Create a new file in `packages/language-server/src/providers/`:

```typescript
// hover-provider.ts
import { ServerCapabilities } from "vscode-languageserver";
import { FeatureProvider, ProviderContext } from "./types";

export class HoverProvider implements FeatureProvider {
  readonly id = "hover";

  getCapabilities(): ServerCapabilities {
    return {
      hoverProvider: true,
    };
  }

  register(context: ProviderContext): void {
    const { connection, documents } = context;

    connection.onHover((params) => {
      const document = documents.getDocument(params.textDocument.uri);
      const tree = documents.getTree(params.textDocument.uri);
      if (!document || !tree) return null;

      // Implement hover logic here
      return {
        contents: { kind: "markdown", value: "Documentation here" },
      };
    });
  }
}
```

### 2. Register the Provider

Add to `packages/language-server/src/server.ts`:

```typescript
import { HoverProvider } from "./providers/hover-provider";

export function startServer(connection: Connection): void {
  // ... existing code ...

  registry.register(new CompletionProvider());
  registry.register(new SemanticTokensProvider());
  registry.register(new DiagnosticsProvider());
  registry.register(new HoverProvider()); // Add this line

  // ... rest of initialization ...
}
```

### 3. Add Tests

Create tests in `packages/language-server/src/__tests__/`:

```typescript
// hover.test.ts
import { describe, it, expect } from "vitest";
import { HoverProvider } from "../providers/hover-provider";

describe("HoverProvider", () => {
  it("provides hover for Twig filters", () => {
    // Test implementation
  });
});
```

### 4. Export (if needed)

If the provider needs to be accessed externally, add it to `packages/language-server/src/providers/index.ts`.

## Key Patterns

### Event-Driven Updates

Diagnostics update automatically via `documents.onDidParse()` events rather than request-based polling.

### Lazy Initialization

The Tree-sitter parser is initialized only when the first document opens, not at server startup.

### Incremental Parsing

Document changes use Tree-sitter's incremental parsing with the old tree for better performance.

### Strategy Pattern

Completions use a strategy pattern to handle different contexts (block, output, filter) with separate implementations.

### Provider Pattern

LSP features are implemented as independent providers that register with a central registry, keeping concerns separated.
