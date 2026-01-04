## 1. Create Test Utilities Directory

- [ ] 1.1 Create `src/__tests__/utils/` directory
- [ ] 1.2 Create `src/__tests__/utils/index.ts` barrel export

## 2. Create Parser Setup Utility

- [ ] 2.1 Create `src/__tests__/utils/parser-setup.ts`
- [ ] 2.2 Implement `getTestParser()` singleton function
- [ ] 2.3 Implement `parseTestDocument(text)` helper
- [ ] 2.4 Handle async parser initialization

## 3. Create Document Factory

- [ ] 3.1 Create `src/__tests__/utils/document-factory.ts`
- [ ] 3.2 Implement `createTestDocument(content, languageId?)` function
- [ ] 3.3 Auto-increment document URIs for uniqueness

## 4. Create Global Setup File

- [ ] 4.1 Create `src/__tests__/setup.ts`
- [ ] 4.2 Add `beforeAll` hook for parser initialization
- [ ] 4.3 Update `vitest.config.ts` to reference setup file

## 5. Update Existing Tests

- [ ] 5.1 Identify all test files with parser initialization
- [ ] 5.2 Replace duplicated parser setup with `getTestParser()` import
- [ ] 5.3 Replace test document creation with `createTestDocument()`
- [ ] 5.4 Remove redundant beforeAll hooks

## 6. Add Provider Tests

- [ ] 6.1 Create `src/__tests__/providers/` directory
- [ ] 6.2 Create `completion-provider.test.ts`
- [ ] 6.3 Create `semantic-tokens-provider.test.ts`
- [ ] 6.4 Create `diagnostics-provider.test.ts`

## 7. Verification

- [ ] 7.1 Run full test suite
- [ ] 7.2 Verify test execution time improvement
- [ ] 7.3 Verify no parser initialization duplication
