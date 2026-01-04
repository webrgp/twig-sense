## 1. Create Test Utilities Directory

- [x] 1.1 Create `src/__tests__/utils/` directory
- [x] 1.2 Create `src/__tests__/utils/index.ts` barrel export

## 2. Create Parser Setup Utility

- [x] 2.1 Create `src/__tests__/utils/parser-setup.ts`
- [x] 2.2 Implement `getTestParser()` singleton function
- [x] 2.3 Implement `parseTestDocument(text)` helper
- [x] 2.4 Handle async parser initialization

## 3. Create Document Factory

- [x] 3.1 Create `src/__tests__/utils/document-factory.ts`
- [x] 3.2 Implement `createTestDocument(content, languageId?)` function
- [x] 3.3 Auto-increment document URIs for uniqueness

## 4. Create Global Setup File

- [x] 4.1 Create `src/__tests__/setup.ts`
- [x] 4.2 Add `beforeAll` hook for parser initialization
- [x] 4.3 Update `vitest.config.ts` to reference setup file

## 5. Update Existing Tests

- [x] 5.1 Identify all test files with parser initialization
- [x] 5.2 Replace duplicated parser setup with `getTestParser()` import
- [x] 5.3 Replace test document creation with `createTestDocument()`
- [x] 5.4 Remove redundant beforeAll hooks

## 6. Add Provider Tests

- [x] 6.1 Create `src/__tests__/providers/` directory
- [x] 6.2 Create `completion-provider.test.ts`
- [x] 6.3 Create `semantic-tokens-provider.test.ts`
- [x] 6.4 Create `diagnostics-provider.test.ts`

## 7. Verification

- [x] 7.1 Run full test suite
- [x] 7.2 Verify test execution time improvement
- [x] 7.3 Verify no parser initialization duplication
