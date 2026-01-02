# Tasks: Integrate Tree-sitter Semantic Tokens

## Phase 1: Dependencies and Build Setup

### 1.1 Add web-tree-sitter dependency
- [x] Add `web-tree-sitter` to `packages/language-server/package.json` dependencies
- [x] Run `npm install` to update lockfile

### 1.2 Configure WASM bundling
- [x] Update `packages/language-server/esbuild.js` to copy `tree-sitter-twig.wasm` to dist
- [x] Verify WASM file is present in dist after build

### 1.3 Rename grammar node type
- [x] Rename `html_content` to `raw_content` in `packages/tree-sitter-twig/grammar.js`
- [x] Update corpus test file to reflect new node name (no changes needed - tests don't reference html_content)
- [x] Run `npm run build` in tree-sitter-twig to regenerate parser and WASM

## Phase 2: Parser Module

### 2.1 Create parser initialization
- [x] Create `packages/language-server/src/parser.ts`
- [x] Implement `initializeParser()` async function to load WASM
- [x] Export `parseDocument(text: string): Tree` function
- [x] Export `parseDocumentIncremental(text: string, oldTree: Tree, changes: TextDocumentContentChangeEvent[]): Tree` function

### 2.2 Handle WASM path resolution
- [x] Resolve WASM path relative to `__dirname`
- [x] Handle case where WASM file is missing (log error, continue without parsing)

## Phase 3: Tree Cache

### 3.1 Create tree cache module
- [x] Create `packages/language-server/src/tree-cache.ts`
- [x] Implement `TreeCache` class with `get(uri)`, `set(uri, tree)`, `delete(uri)` methods
- [x] Export singleton instance

## Phase 4: Semantic Token Generation

### 4.1 Create semantic tokens module
- [x] Create `packages/language-server/src/semantic-tokens.ts`
- [x] Implement `generateSemanticTokens(tree: Tree): number[]` function
- [x] Implement tree traversal using tree-sitter cursor API

### 4.2 Implement node type mapping
- [x] Map `identifier` nodes based on parent context (variable, property, function)
- [x] Map `keyword` nodes to keyword token type
- [x] Map `operator` nodes to operator token type
- [x] Map `string` and `number` nodes to respective token types
- [x] Map `comment_content` nodes to comment token type

### 4.3 Implement LSP token encoding
- [x] Convert absolute positions to delta-encoded format
- [x] Return properly formatted `number[]` array for LSP

## Phase 5: Server Integration

### 5.1 Initialize parser on server start
- [x] Call `initializeParser()` in `onInitialize` or lazily on first document
- [x] Store parser ready state

### 5.2 Parse documents on open/change
- [x] In `onDidOpenTextDocument`, parse document and cache tree
- [x] In `onDidChangeTextDocument`, use incremental parsing and update cache
- [x] In `onDidCloseTextDocument`, remove tree from cache

### 5.3 Return semantic tokens
- [x] Update `connection.languages.semanticTokens.on` handler
- [x] Check `twig-sense.semanticTokens.enabled` setting; return empty tokens if disabled
- [x] Retrieve cached tree for document
- [x] Generate and return semantic tokens

## Phase 6: Validation

### 6.1 Build verification
- [x] Run `npm run build` - all packages should build successfully
- [x] Verify WASM file is in `packages/language-server/dist/`

### 6.2 Manual testing
- [x] Start extension in VSCode Extension Development Host
- [x] Open a `.twig` file
- [x] Verify semantic highlighting appears (variables, keywords, filters have distinct colors)
- [x] Edit the file and verify highlighting updates
- [x] Toggle `twig-sense.semanticTokens.enabled` to false and verify highlighting falls back to TextMate

### 6.3 Tree-sitter tests
- [x] Run `npm run test` in `packages/tree-sitter-twig`
- [x] All existing grammar tests should pass

## Dependencies
- Phase 2 depends on Phase 1 (web-tree-sitter must be installed)
- Phase 4 depends on Phase 2 (needs parser to generate trees)
- Phase 5 depends on Phases 2, 3, and 4 (integrates all components)
- Phase 6 depends on Phase 5 (tests the integration)

## Parallelizable Work
- Tasks 2.1 and 3.1 can be done in parallel (parser and cache are independent)
- Task 4.1-4.3 can start once parser is available
