# Design: Tree-sitter Semantic Tokens Integration

## Overview
This document describes the architecture for integrating web-tree-sitter into the language server to provide semantic tokens.

## Architecture

### Component Diagram
```
┌─────────────────────────────────────────────────────────────┐
│                    Language Server                          │
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌────────────────┐  │
│  │  Document   │───▶│   Parser    │───▶│ Semantic Token │  │
│  │   Store     │    │  (tree-     │    │   Provider     │  │
│  │             │    │   sitter)   │    │                │  │
│  └─────────────┘    └─────────────┘    └────────────────┘  │
│        │                  │                    │            │
│        │                  ▼                    │            │
│        │           ┌─────────────┐             │            │
│        └──────────▶│ Tree Cache  │◀────────────┘            │
│                    └─────────────┘                          │
└─────────────────────────────────────────────────────────────┘
```

### Key Components

#### 1. Parser Module (`src/parser.ts`)
Responsible for initializing web-tree-sitter and parsing documents.

```typescript
// Responsibilities:
// - Initialize web-tree-sitter with WASM
// - Load tree-sitter-twig.wasm
// - Parse document text into syntax trees
// - Support incremental parsing with edit ranges
```

**Design Decision**: Single parser instance shared across all documents. Tree-sitter parsers are stateless and thread-safe for parsing operations.

#### 2. Tree Cache (`src/tree-cache.ts`)
Stores parsed syntax trees keyed by document URI.

```typescript
// Responsibilities:
// - Store syntax trees per document URI
// - Invalidate on document close
// - Provide tree for semantic token generation
```

**Design Decision**: Simple Map-based cache. No LRU eviction needed initially since documents are managed by VSCode lifecycle (open/close events).

#### 3. Semantic Token Provider (`src/semantic-tokens.ts`)
Traverses syntax trees and generates LSP semantic tokens.

```typescript
// Responsibilities:
// - Walk syntax tree nodes
// - Map node types to LSP token types
// - Encode tokens in LSP format (delta-encoded integers)
```

## Node Type to Token Type Mapping

| Tree-sitter Node | LSP Token Type | LSP Token Modifier |
|------------------|----------------|-------------------|
| `identifier` (first in expression) | `variable` | - |
| `identifier` (in property_access) | `property` | - |
| `identifier` (in filter) | `function` | - |
| `keyword` | `keyword` | - |
| `operator` | `operator` | - |
| `string` | `string` | - |
| `number` | `number` | - |
| `comment_content` | `comment` | - |

### Context-Aware Mapping
The same `identifier` node type maps to different token types based on context:
- `{{ user }}` → `user` is `variable`
- `{{ user.name }}` → `user` is `variable`, `name` is `property`
- `{{ name|upper }}` → `name` is `variable`, `upper` is `function`

This requires examining parent/sibling nodes during traversal.

## WASM Loading Strategy

### Path Resolution
The WASM file must be resolved at runtime. Options considered:

1. **Bundled with language-server** (chosen)
   - Copy WASM to language-server dist during build
   - Resolve using `__dirname` relative path
   - Pros: Self-contained, no cross-package runtime resolution
   - Cons: Duplicates WASM file

2. **Reference from tree-sitter-twig package**
   - Resolve using require.resolve or package exports
   - Pros: Single source of truth
   - Cons: Complex path resolution in bundled ESM/CJS contexts

**Decision**: Bundle WASM with language-server for simplicity and reliability.

### Initialization Sequence
```
1. Server receives 'initialize' request
2. Async: Load web-tree-sitter WASM runtime
3. Async: Load tree-sitter-twig.wasm language
4. Create parser instance
5. Server sends 'initialized' notification
6. Ready to parse documents
```

**Design Decision**: Initialize parser lazily on first document open, not at server start. This avoids blocking the initialize handshake and handles the async nature of WASM loading.

## Incremental Parsing

Tree-sitter supports incremental parsing by providing edit information:

```typescript
tree.edit({
  startIndex,
  oldEndIndex,
  newEndIndex,
  startPosition,
  oldEndPosition,
  newEndPosition,
});
const newTree = parser.parse(newText, tree);
```

The `didChange` notification with `TextDocumentSyncKind.Incremental` provides content changes that can be mapped to tree-sitter edit format.

**Design Decision**: Implement incremental parsing from the start. The LSP already provides incremental changes, and tree-sitter is designed for this. Full re-parse on every keystroke would be wasteful.

## Client Configuration

The extension declares a `twig-sense.semanticTokens.enabled` setting. The language server should respect this setting:

```typescript
// On semantic tokens request:
const config = await connection.workspace.getConfiguration('twig-sense');
if (!config.semanticTokens?.enabled) {
  return { data: [] };
}
// ... generate tokens
```

**Design Decision**: Check configuration on each semantic tokens request rather than caching. This allows users to toggle the setting without restarting the server.

## Grammar Naming

The tree-sitter grammar uses `html_content` for non-Twig portions. This name is misleading since the content could be HTML, JavaScript, CSS, or any other text.

**Design Decision**: Rename `html_content` to `raw_content` in the grammar to accurately reflect that it represents unparsed content regardless of type. This is a minor grammar change included in this proposal.

## Error Handling

### Parse Errors
Tree-sitter produces partial trees even with syntax errors. Nodes are marked with `hasError()` or `isMissing()`.

**Design Decision**: Generate tokens for valid portions of the tree. Skip error nodes. This provides graceful degradation - users still get highlighting for correct syntax.

### WASM Load Failures
If WASM fails to load, the server should:
1. Log the error
2. Continue operating without semantic tokens
3. Return empty token arrays

**Design Decision**: Semantic tokens are optional enhancement. Server must remain functional without them.

## File Changes

| File | Change Type | Description |
|------|-------------|-------------|
| `packages/language-server/package.json` | Modified | Add `web-tree-sitter` dependency |
| `packages/language-server/esbuild.js` | Modified | Copy WASM to dist |
| `packages/language-server/src/parser.ts` | New | Tree-sitter initialization and parsing |
| `packages/language-server/src/tree-cache.ts` | New | Syntax tree storage |
| `packages/language-server/src/semantic-tokens.ts` | New | Token generation from trees |
| `packages/language-server/src/server.ts` | Modified | Wire up components |

## Future Consideration: Context-Aware Highlighting

### Problem Statement
Twig templates mix Twig syntax with HTML, JavaScript, and other content. The current approach highlights all Twig delimiters (`{{ }}`, `{% %}`) uniformly regardless of their surrounding context. However, there's a nuance in how content BETWEEN Twig tags should be treated:

**Inside HTML attributes:**
```html
<div data-info="{% if condition %}Some text with <b>HTML</b> and {{ variable }}{% endif %}">
```
- `{% if %}`, `{% endif %}`, `{{ variable }}` → should highlight as Twig
- `<b>HTML</b>` → should be raw text (NOT highlighted as HTML tags, since we're inside a string attribute)

**Outside HTML attributes:**
```html
{% if user.isLoggedIn %}
    <div>Welcome, {{ user.name }}!</div>
{% endif %}
```
- `{% if %}`, `{% endif %}`, `{{ user.name }}` → should highlight as Twig
- `<div>` → should highlight as HTML tags

### Why This Is Complex
Achieving this context-awareness requires understanding HTML structure - specifically, whether we're inside an attribute value. This is "embedded language" support, which requires one of:

1. **Embed Twig inside HTML grammar** - parse HTML first, then parse Twig within specific contexts
2. **Multi-layer parsing** - coordinate HTML and Twig parsers with shared context
3. **Grammar injection** - use tree-sitter's injection queries to embed Twig in HTML

### Current Approach
For this proposal, we keep it simple:
- Tree-sitter parses all Twig syntax (`{{ }}`, `{% %}`, `{# #}`)
- Semantic tokens are generated for all parsed Twig nodes
- Everything else is `raw_content` (no tokens generated)
- HTML highlighting is delegated to TextMate grammar

### Future Enhancement
When demand warrants, a separate proposal should address embedded language support:
- Investigate tree-sitter-html with Twig injection
- Define context rules for when content should be HTML vs raw
- Consider performance implications of multi-grammar parsing
- Evaluate VSCode's embedded language capabilities

## Alternatives Considered

### 1. Use tree-sitter Node bindings instead of WASM
- Pros: Potentially faster, native integration
- Cons: Requires native compilation, platform-specific binaries, complex distribution
- **Rejected**: WASM is portable and sufficient for our performance needs

### 2. Generate tokens during parsing (single pass)
- Pros: Slightly more efficient
- Cons: Couples parsing and token generation, harder to test separately
- **Rejected**: Separation of concerns is more valuable than micro-optimization

### 3. Use existing tree-sitter-twig from npm
- Pros: Less maintenance
- Cons: May not match our grammar needs, less control
- **Rejected**: We need control over the grammar for Twig 3.x and potential Craft CMS extensions
