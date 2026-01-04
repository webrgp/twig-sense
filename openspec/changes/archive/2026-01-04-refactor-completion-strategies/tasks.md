## 1. Extract Context Detection

- [x] 1.1 Create `src/context/` directory
- [x] 1.2 Create `src/context/twig-context.ts` with `TwigContext` type
- [x] 1.3 Define `ContextInfo` interface with all context flags
- [x] 1.4 Implement `detectContext(document, position)` function
- [x] 1.5 Move context detection logic from completions.ts:
  - `detectContextType()` - output/block/filter/none
  - `isAfterIsKeyword()` - for test completions
  - `isAfterLoopDot()` - for loop variable completions
  - `isInBlockFunction()` - for block name completions
  - `isAfterBlockKeyword()` - for block name completions

## 2. Define Strategy Interface

- [x] 2.1 Create `src/completions/strategies/` directory
- [x] 2.2 Create `src/completions/strategies/base.ts` with `CompletionStrategy` interface
- [x] 2.3 Define method signature: `getCompletions(document, tree, context, scope)`

## 3. Implement Block Context Strategy

- [x] 3.1 Create `src/completions/strategies/block-context.ts`
- [x] 3.2 Implement `BlockContextStrategy` class
- [x] 3.3 Include: keywords, functions, variables, macros
- [x] 3.4 Handle loop variable in for context
- [x] 3.5 Prioritize parent() in block context

## 4. Implement Output Context Strategy

- [x] 4.1 Create `src/completions/strategies/output-context.ts`
- [x] 4.2 Implement `OutputContextStrategy` class
- [x] 4.3 Include: functions, variables, macros (no keywords)

## 5. Implement Filter Context Strategy

- [x] 5.1 Create `src/completions/strategies/filter-context.ts`
- [x] 5.2 Implement `FilterContextStrategy` class
- [x] 5.3 Return only filter completions

## 6. Extract Dynamic Completions

- [x] 6.1 Create `src/completions/dynamic-completions.ts`
- [x] 6.2 Move `getVariableCompletions()` from completions.ts
- [x] 6.3 Move `getMacroCompletions()` from completions.ts
- [x] 6.4 Move `getBlockNameCompletions()` from completions.ts

## 7. Refactor Completion Orchestration

- [x] 7.1 Move completions.ts to `src/completions/index.ts`
- [x] 7.2 Create strategy registry map
- [x] 7.3 Handle special cases (loop dot, is keyword, block function)
- [x] 7.4 Delegate to appropriate strategy based on context
- [x] 7.5 Create `src/completions/utils.ts` for helpers

## 8. Verification

- [x] 8.1 Run completion tests to verify no regressions
- [x] 8.2 Test each context type manually in VSCode
- [x] 8.3 Verify completions/index.ts is now ~200 lines
