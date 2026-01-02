# Tasks: Add VS Code Extension Testing

## Task List

### 1. Update test configuration
- [x] Update `.vscode-test.mjs` with mocha options and workspace folder
- [x] Verify `extensionDevelopmentPath` resolves correctly for monorepo

### 2. Create test TypeScript configuration
- [x] Create `tsconfig.test.json` extending base config
- [x] Configure `outDir` to `./out` and include test files
- [x] Ensure test types are available (@types/mocha)

### 3. Create test directory structure
- [x] Create `packages/vscode/test/` directory
- [x] Create `packages/vscode/test/suite/` for test files
- [x] Create `packages/vscode/test/fixtures/` for sample .twig files

### 4. Create test fixtures
- [x] Add `sample.twig` with representative Twig syntax
- [x] Include output tags, block tags, comments, filters

### 5. Create extension test file
- [x] Create `test/suite/extension.test.ts`
- [x] Add test for extension presence in registry
- [x] Add test for extension activation on .twig files
- [x] Add test for language server client starting

### 6. Update package.json scripts
- [x] Add `pretest` script to compile tests with tsc
- [x] Verify `test` script runs `vscode-test`
- [x] Add `@types/mocha` to devDependencies

### 7. Fix debug launch configuration
- [x] Update `extensionTestsPath` to match @vscode/test-cli convention
- [x] Ensure preLaunchTask compiles tests

### 8. Verify test execution
- [x] Run `npm run test` and confirm tests execute
- [x] Verify F5 debugging works with "Extension Tests" config
- [x] Confirm tests pass in VS Code Extension Host

## Dependencies
- Tasks 1-3 can be done in parallel
- Tasks 4-5 depend on task 3 (directory structure)
- Task 6 can be done in parallel with 4-5
- Task 7 can be done in parallel with 4-6
- Task 8 depends on all previous tasks
