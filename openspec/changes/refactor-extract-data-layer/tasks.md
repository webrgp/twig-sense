## 1. Create Data Directory Structure

- [ ] 1.1 Create `src/data/` directory in language-server package
- [ ] 1.2 Create `src/data/index.ts` barrel export file

## 2. Extract Keywords

- [ ] 2.1 Extract `TWIG_KEYWORDS` array from `completions.ts` to `src/data/keywords.ts`
- [ ] 2.2 Move keyword documentation from `completion-docs.ts` to `keywords.ts`
- [ ] 2.3 Export typed interface `{ items: CompletionItem[], docs: Record<string, MarkupContent> }`

## 3. Extract Filters

- [ ] 3.1 Extract `TWIG_FILTERS` array from `completions.ts` to `src/data/filters.ts`
- [ ] 3.2 Move filter documentation from `completion-docs.ts` to `filters.ts`
- [ ] 3.3 Export typed interface

## 4. Extract Functions

- [ ] 4.1 Extract `TWIG_FUNCTIONS` array from `completions.ts` to `src/data/functions.ts`
- [ ] 4.2 Move function documentation from `completion-docs.ts` to `functions.ts`
- [ ] 4.3 Export typed interface

## 5. Extract Tests

- [ ] 5.1 Extract `TWIG_TESTS` array from `completions.ts` to `src/data/tests.ts`
- [ ] 5.2 Move test documentation from `completion-docs.ts` to `tests.ts`
- [ ] 5.3 Export typed interface

## 6. Extract Loop Variables

- [ ] 6.1 Extract `LOOP_VARIABLE_COMPLETIONS` from `completions.ts` to `src/data/loop-variables.ts`
- [ ] 6.2 Move loop variable documentation to `loop-variables.ts`
- [ ] 6.3 Export typed interface

## 7. Update Imports

- [ ] 7.1 Update `completions.ts` to import from `src/data/`
- [ ] 7.2 Remove `completion-docs.ts` file
- [ ] 7.3 Update any other files importing from completion-docs

## 8. Verification

- [ ] 8.1 Run test suite to verify no regressions
- [ ] 8.2 Verify completions.ts is now ~400-500 lines
- [ ] 8.3 Verify each data file is ~300-500 lines
