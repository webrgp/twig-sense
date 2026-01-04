## 1. Extract Context Detection

- [ ] 1.1 Create `src/context/` directory
- [ ] 1.2 Create `src/context/twig-context.ts` with `TwigContext` type
- [ ] 1.3 Define `ContextInfo` interface with all context flags
- [ ] 1.4 Implement `detectContext(document, position)` function
- [ ] 1.5 Move context detection logic from completions.ts:
  - `detectContextType()` - output/block/filter/none
  - `isAfterIsKeyword()` - for test completions
  - `isAfterLoopDot()` - for loop variable completions
  - `isInBlockFunction()` - for block name completions
  - `isAfterBlockKeyword()` - for block name completions

## 2. Define Strategy Interface

- [ ] 2.1 Create `src/completions/strategies/` directory
- [ ] 2.2 Create `src/completions/strategies/base.ts` with `CompletionStrategy` interface
- [ ] 2.3 Define method signature: `getCompletions(document, tree, context, scope)`

## 3. Implement Block Context Strategy

- [ ] 3.1 Create `src/completions/strategies/block-context.ts`
- [ ] 3.2 Implement `BlockContextStrategy` class
- [ ] 3.3 Include: keywords, functions, variables, macros
- [ ] 3.4 Handle loop variable in for context
- [ ] 3.5 Prioritize parent() in block context

## 4. Implement Output Context Strategy

- [ ] 4.1 Create `src/completions/strategies/output-context.ts`
- [ ] 4.2 Implement `OutputContextStrategy` class
- [ ] 4.3 Include: functions, variables, macros (no keywords)

## 5. Implement Filter Context Strategy

- [ ] 5.1 Create `src/completions/strategies/filter-context.ts`
- [ ] 5.2 Implement `FilterContextStrategy` class
- [ ] 5.3 Return only filter completions

## 6. Extract Dynamic Completions

- [ ] 6.1 Create `src/completions/dynamic-completions.ts`
- [ ] 6.2 Move `getVariableCompletions()` from completions.ts
- [ ] 6.3 Move `getMacroCompletions()` from completions.ts
- [ ] 6.4 Move `getBlockNameCompletions()` from completions.ts

## 7. Refactor Completion Orchestration

- [ ] 7.1 Move completions.ts to `src/completions/index.ts`
- [ ] 7.2 Create strategy registry map
- [ ] 7.3 Handle special cases (loop dot, is keyword, block function)
- [ ] 7.4 Delegate to appropriate strategy based on context
- [ ] 7.5 Create `src/completions/utils.ts` for helpers

## 8. Verification

- [ ] 8.1 Run completion tests to verify no regressions
- [ ] 8.2 Test each context type manually in VSCode
- [ ] 8.3 Verify completions/index.ts is now ~200 lines
