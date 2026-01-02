# Tasks: Integrate Tree-sitter Semantic Tokens

## Phase 1: Dependencies and Build Setup

### 1.1 Add web-tree-sitter dependency
- [ ] Add `web-tree-sitter` to `packages/language-server/package.json` dependencies
- [ ] Run `npm install` to update lockfile

### 1.2 Configure WASM bundling
- [ ] Update `packages/language-server/esbuild.js` to copy `tree-sitter-twig.wasm` to dist
- [ ] Verify WASM file is present in dist after build

### 1.3 Rename grammar node type
- [ ] Rename `html_content` to `raw_content` in `packages/tree-sitter-twig/grammar.js`
- [ ] Update corpus test file to reflect new node name
- [ ] Run `npm run build` in tree-sitter-twig to regenerate parser and WASM

## Phase 2: Parser Module

### 2.1 Create parser initialization
- [ ] Create `packages/language-server/src/parser.ts`
- [ ] Implement `initializeParser()` async function to load WASM
- [ ] Export `parseDocument(text: string): Tree` function
- [ ] Export `parseDocumentIncremental(text: string, oldTree: Tree, changes: TextDocumentContentChangeEvent[]): Tree` function

### 2.2 Handle WASM path resolution
- [ ] Resolve WASM path relative to `__dirname`
- [ ] Handle case where WASM file is missing (log error, continue without parsing)

## Phase 3: Tree Cache

### 3.1 Create tree cache module
- [ ] Create `packages/language-server/src/tree-cache.ts`
- [ ] Implement `TreeCache` class with `get(uri)`, `set(uri, tree)`, `delete(uri)` methods
- [ ] Export singleton instance

## Phase 4: Semantic Token Generation

### 4.1 Create semantic tokens module
- [ ] Create `packages/language-server/src/semantic-tokens.ts`
- [ ] Implement `generateSemanticTokens(tree: Tree): number[]` function
- [ ] Implement tree traversal using tree-sitter cursor API

### 4.2 Implement node type mapping
- [ ] Map `identifier` nodes based on parent context (variable, property, function)
- [ ] Map `keyword` nodes to keyword token type
- [ ] Map `operator` nodes to operator token type
- [ ] Map `string` and `number` nodes to respective token types
- [ ] Map `comment_content` nodes to comment token type

### 4.3 Implement LSP token encoding
- [ ] Convert absolute positions to delta-encoded format
- [ ] Return properly formatted `number[]` array for LSP

## Phase 5: Server Integration

### 5.1 Initialize parser on server start
- [ ] Call `initializeParser()` in `onInitialize` or lazily on first document
- [ ] Store parser ready state

### 5.2 Parse documents on open/change
- [ ] In `onDidOpenTextDocument`, parse document and cache tree
- [ ] In `onDidChangeTextDocument`, use incremental parsing and update cache
- [ ] In `onDidCloseTextDocument`, remove tree from cache

### 5.3 Return semantic tokens
- [ ] Update `connection.languages.semanticTokens.on` handler
- [ ] Check `twig-sense.semanticTokens.enabled` setting; return empty tokens if disabled
- [ ] Retrieve cached tree for document
- [ ] Generate and return semantic tokens

## Phase 6: Validation

### 6.1 Build verification
- [ ] Run `npm run build` - all packages should build successfully
- [ ] Verify WASM file is in `packages/language-server/dist/`

### 6.2 Manual testing
- [ ] Start extension in VSCode Extension Development Host
- [ ] Open a `.twig` file
- [ ] Verify semantic highlighting appears (variables, keywords, filters have distinct colors)
- [ ] Edit the file and verify highlighting updates
- [ ] Toggle `twig-sense.semanticTokens.enabled` to false and verify highlighting falls back to TextMate

### 6.3 Tree-sitter tests
- [ ] Run `npm run test` in `packages/tree-sitter-twig`
- [ ] All existing grammar tests should pass

## Dependencies
- Phase 2 depends on Phase 1 (web-tree-sitter must be installed)
- Phase 4 depends on Phase 2 (needs parser to generate trees)
- Phase 5 depends on Phases 2, 3, and 4 (integrates all components)
- Phase 6 depends on Phase 5 (tests the integration)

## Parallelizable Work
- Tasks 2.1 and 3.1 can be done in parallel (parser and cache are independent)
- Task 4.1-4.3 can start once parser is available
