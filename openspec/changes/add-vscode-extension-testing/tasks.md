# Tasks: Add VS Code Extension Testing

## Task List

### 1. Update test configuration
- [ ] Update `.vscode-test.mjs` with mocha options and workspace folder
- [ ] Verify `extensionDevelopmentPath` resolves correctly for monorepo

### 2. Create test TypeScript configuration
- [ ] Create `tsconfig.test.json` extending base config
- [ ] Configure `outDir` to `./out` and include test files
- [ ] Ensure test types are available (@types/mocha)

### 3. Create test directory structure
- [ ] Create `packages/vscode/test/` directory
- [ ] Create `packages/vscode/test/suite/` for test files
- [ ] Create `packages/vscode/test/fixtures/` for sample .twig files

### 4. Create test fixtures
- [ ] Add `sample.twig` with representative Twig syntax
- [ ] Include output tags, block tags, comments, filters

### 5. Create extension test file
- [ ] Create `test/suite/extension.test.ts`
- [ ] Add test for extension presence in registry
- [ ] Add test for extension activation on .twig files
- [ ] Add test for language server client starting

### 6. Update package.json scripts
- [ ] Add `pretest` script to compile tests with tsc
- [ ] Verify `test` script runs `vscode-test`
- [ ] Add `@types/mocha` to devDependencies

### 7. Fix debug launch configuration
- [ ] Update `extensionTestsPath` to match @vscode/test-cli convention
- [ ] Ensure preLaunchTask compiles tests

### 8. Verify test execution
- [ ] Run `npm run test` and confirm tests execute
- [ ] Verify F5 debugging works with "Extension Tests" config
- [ ] Confirm tests pass in VS Code Extension Host

## Dependencies
- Tasks 1-3 can be done in parallel
- Tasks 4-5 depend on task 3 (directory structure)
- Task 6 can be done in parallel with 4-5
- Task 7 can be done in parallel with 4-6
- Task 8 depends on all previous tasks
