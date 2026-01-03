# Phase 1: VS Code Native Snippets

## 1. Create Snippets File

- [ ] 1.1 Create `packages/vscode/snippets/twig.json` with control structure snippets:
  - `if` - If block
  - `ifelse` - If/else block
  - `ifelseif` - If/elseif/else block
  - `for` - For loop
  - `forelse` - For/else loop (empty collection)

- [ ] 1.2 Add template inheritance snippets:
  - `extends` - Extends with initial block
  - `block` - Block definition
  - `embed` - Embed with block

- [ ] 1.3 Add include/import snippets:
  - `include` - Basic include
  - `includewith` - Include with variables
  - `import` - Import macros
  - `from` - From import

- [ ] 1.4 Add definition snippets:
  - `macro` - Macro definition
  - `set` - Inline set
  - `setblock` - Block set

- [ ] 1.5 Add utility block snippets:
  - `autoescape` - Autoescape block
  - `spaceless` - Spaceless block (via apply)
  - `verbatim` - Verbatim block
  - `apply` - Apply filter block
  - `cache` - Cache block
  - `with` - With block
  - `sandbox` - Sandbox block
  - `do` - Do expression

## 2. Register Snippets

- [ ] 2.1 Add `contributes.snippets` entry to `packages/vscode/package.json`
- [ ] 2.2 Verify snippets load in VS Code (manual test)

# Phase 2: Enhanced LSP Completions

## 3. Multi-line LSP Snippets

- [ ] 3.1 Update `if` keyword completion to multi-line snippet with `{% endif %}`
- [ ] 3.2 Update `for` keyword completion to multi-line snippet with `{% endfor %}`
- [ ] 3.3 Update `block` keyword completion to multi-line snippet with `{% endblock %}`
- [ ] 3.4 Update `macro` keyword completion to multi-line snippet with `{% endmacro %}`
- [ ] 3.5 Update remaining block keywords (`autoescape`, `verbatim`, `apply`, `embed`, `cache`, `sandbox`) to multi-line snippets

## 4. Testing

- [ ] 4.1 Add unit tests for multi-line LSP snippet completions
- [ ] 4.2 Add integration test verifying snippet insertion works end-to-end

# Phase 3: Documentation

## 5. Documentation

- [ ] 5.1 Update README with snippets documentation (list of available snippets)
