## 1. Define Provider Interface

- [x] 1.1 Create `src/providers/` directory
- [x] 1.2 Create `src/providers/types.ts` with `ProviderContext` and `FeatureProvider` interfaces
- [x] 1.3 Define provider contract: `id`, `getCapabilities()`, `register()`, `dispose()`

## 2. Create Provider Registry

- [x] 2.1 Create `src/providers/registry.ts` with `ProviderRegistry` class
- [x] 2.2 Implement `register(provider)` method
- [x] 2.3 Implement `getCapabilities()` aggregation
- [x] 2.4 Implement `initializeAll(context)` method
- [x] 2.5 Implement `get<T>(id)` for typed provider access
- [x] 2.6 Implement `dispose()` cleanup method

## 3. Extract Document Manager

- [x] 3.1 Create `src/document-manager.ts`
- [x] 3.2 Move document open/change/close handlers from server.ts
- [x] 3.3 Move tree parsing and caching logic
- [x] 3.4 Implement `onDidParse` event emitter
- [x] 3.5 Implement `getDocument()`, `getTree()`, `getConfig()` methods

## 4. Create Completion Provider

- [x] 4.1 Create `src/providers/completion-provider.ts`
- [x] 4.2 Implement `FeatureProvider` interface
- [x] 4.3 Return completion capabilities in `getCapabilities()`
- [x] 4.4 Register `onCompletion` handler in `register()`

## 5. Create Semantic Tokens Provider

- [x] 5.1 Create `src/providers/semantic-tokens-provider.ts`
- [x] 5.2 Implement `FeatureProvider` interface
- [x] 5.3 Return semantic tokens capabilities with legend
- [x] 5.4 Register semantic tokens handler with config check

## 6. Create Diagnostics Provider

- [x] 6.1 Create `src/providers/diagnostics-provider.ts`
- [x] 6.2 Implement `FeatureProvider` interface
- [x] 6.3 Implement `validate(uri)` method
- [x] 6.4 Integrate with document manager's parse events

## 7. Refactor Server

- [x] 7.1 Update `server.ts` to use `ProviderRegistry`
- [x] 7.2 Update `server.ts` to use `DocumentManager`
- [x] 7.3 Register all providers in server initialization
- [x] 7.4 Remove direct feature handler registrations
- [x] 7.5 Create `src/providers/index.ts` barrel export

## 8. Verification

- [x] 8.1 Run test suite to verify no regressions
- [x] 8.2 Verify server.ts is now ~100 lines (actual: 49 lines)
- [x] 8.3 Test adding a mock provider to verify pattern works
- [x] 8.4 Verify all LSP features still work in VSCode
