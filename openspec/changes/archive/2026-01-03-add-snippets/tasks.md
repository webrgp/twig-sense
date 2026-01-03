# Phase 1: VS Code Native Snippets

## 1. Create Snippets File

- [x] 1.1 Create `packages/vscode/snippets/twig.json` with control structure snippets:
  - `if` - If block
  - `ifelse` - If/else block
  - `ifelseif` - If/elseif/else block
  - `for` - For loop
  - `forelse` - For/else loop (empty collection)

- [x] 1.2 Add template inheritance snippets:
  - `extends` - Extends with initial block
  - `block` - Block definition
  - `embed` - Embed with block

- [x] 1.3 Add include/import snippets:
  - `include` - Basic include
  - `includewith` - Include with variables
  - `import` - Import macros
  - `from` - From import

- [x] 1.4 Add definition snippets:
  - `macro` - Macro definition
  - `set` - Inline set
  - `setblock` - Block set

- [x] 1.5 Add utility block snippets:
  - `autoescape` - Autoescape block
  - `spaceless` - Spaceless block (via apply)
  - `verbatim` - Verbatim block
  - `apply` - Apply filter block
  - `cache` - Cache block
  - `with` - With block
  - `sandbox` - Sandbox block
  - `do` - Do expression

## 2. Register Snippets

- [x] 2.1 Add `contributes.snippets` entry to `packages/vscode/package.json`
- [x] 2.2 Verify snippets load in VS Code (manual test)

# Phase 2: Enhanced LSP Completions

## 3. Multi-line LSP Snippets

- [x] 3.1 Update `if` keyword completion to multi-line snippet with `{% endif %}`
- [x] 3.2 Update `for` keyword completion to multi-line snippet with `{% endfor %}`
- [x] 3.3 Update `block` keyword completion to multi-line snippet with `{% endblock %}`
- [x] 3.4 Update `macro` keyword completion to multi-line snippet with `{% endmacro %}`
- [x] 3.5 Update remaining block keywords (`autoescape`, `verbatim`, `apply`, `embed`, `cache`, `sandbox`) to multi-line snippets

## 4. Testing

- [x] 4.1 Add unit tests for multi-line LSP snippet completions
- [x] 4.2 Add integration test verifying snippet insertion works end-to-end

# Phase 3: Documentation

## 5. Documentation

- [x] 5.1 Update README with snippets documentation (list of available snippets)
