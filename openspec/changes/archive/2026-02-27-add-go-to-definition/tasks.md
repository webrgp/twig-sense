## 1. Configuration Migration

- [x] 1.1 Rename `completion.templateRoot` to `templates.root` in `TwigSenseConfig` interface and add `templates.fileExtension` property (`packages/language-server/src/types/config.ts`)
- [x] 1.2 Update default values and `mergeWithDefaults()` to use `templates.root` (default: `"templates"`) and `templates.fileExtension` (default: `".twig"`)
- [x] 1.3 Update `packages/vscode/package.json` configuration schema: remove `twig-sense.completion.templateRoot`, add `twig-sense.templates.root` and `twig-sense.templates.fileExtension`
- [x] 1.4 Update any existing references to `completion.templateRoot` across the codebase (completion provider, tests)

## 2. Widen ProviderContext

- [x] 2.1 Add `workspaceFolders: WorkspaceFolder[]` to the `ProviderContext` interface in `packages/language-server/src/providers/types.ts`
- [x] 2.2 Capture `params.workspaceFolders` in `server.ts` `onInitialize` handler with `rootUri` fallback, and pass it through `ProviderContext` in `onInitialized`

## 3. Definition Provider Core

- [x] 3.1 Create `packages/language-server/src/providers/definition-provider.ts` implementing `FeatureProvider` with id `"definition"` and `getCapabilities()` returning `{ definitionProvider: true }`
- [x] 3.2 Implement `register()`: wire `connection.onDefinition()` handler that gets document and tree from `documents`
- [x] 3.3 Implement AST traversal: find deepest node at cursor, check if it is a `string` node inside a `statement_block` whose `keyword` child text is `include`
- [x] 3.4 Implement path resolution: strip quotes from string node, resolve against each workspace folder using `templates.root`, try exact path then append `templates.fileExtension` if not already present
- [x] 3.5 Return `Location` pointing to line 0, column 0 of the resolved file, or `null` if no match

## 4. Server Integration

- [x] 4.1 Register `DefinitionProvider` in `server.ts` alongside existing providers
- [x] 4.2 Verify `definitionProvider` appears in aggregated server capabilities from `registry.getCapabilities()`

## 5. Tests

- [x] 5.1 Add unit tests for `DefinitionProvider` capabilities and id (Pattern A)
- [x] 5.2 Add tests for include detection: string inside include `statement_block` recognized, string in non-include context rejected, cursor on keyword returns null
- [x] 5.3 Add tests for path resolution: exact path match, extension-appended match, single-quoted strings, missing file returns null, extension not double-appended
- [x] 5.4 Add tests for workspace folder resolution: single folder, multiple folders (first match wins), rootUri fallback
- [x] 5.5 Update existing config tests for the `templates.root` / `templates.fileExtension` shape and removal of `completion.templateRoot`

## 6. Validation

- [x] 6.1 Run full test suite and fix any failures
- [x] 6.2 Run build and fix any type errors
