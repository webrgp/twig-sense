## 1. Define Provider Interface

- [ ] 1.1 Create `src/providers/` directory
- [ ] 1.2 Create `src/providers/types.ts` with `ProviderContext` and `FeatureProvider` interfaces
- [ ] 1.3 Define provider contract: `id`, `getCapabilities()`, `register()`, `dispose()`

## 2. Create Provider Registry

- [ ] 2.1 Create `src/providers/registry.ts` with `ProviderRegistry` class
- [ ] 2.2 Implement `register(provider)` method
- [ ] 2.3 Implement `getCapabilities()` aggregation
- [ ] 2.4 Implement `initializeAll(context)` method
- [ ] 2.5 Implement `get<T>(id)` for typed provider access
- [ ] 2.6 Implement `dispose()` cleanup method

## 3. Extract Document Manager

- [ ] 3.1 Create `src/document-manager.ts`
- [ ] 3.2 Move document open/change/close handlers from server.ts
- [ ] 3.3 Move tree parsing and caching logic
- [ ] 3.4 Implement `onDidParse` event emitter
- [ ] 3.5 Implement `getDocument()`, `getTree()`, `getConfig()` methods

## 4. Create Completion Provider

- [ ] 4.1 Create `src/providers/completion-provider.ts`
- [ ] 4.2 Implement `FeatureProvider` interface
- [ ] 4.3 Return completion capabilities in `getCapabilities()`
- [ ] 4.4 Register `onCompletion` handler in `register()`

## 5. Create Semantic Tokens Provider

- [ ] 5.1 Create `src/providers/semantic-tokens-provider.ts`
- [ ] 5.2 Implement `FeatureProvider` interface
- [ ] 5.3 Return semantic tokens capabilities with legend
- [ ] 5.4 Register semantic tokens handler with config check

## 6. Create Diagnostics Provider

- [ ] 6.1 Create `src/providers/diagnostics-provider.ts`
- [ ] 6.2 Implement `FeatureProvider` interface
- [ ] 6.3 Implement `validate(uri)` method
- [ ] 6.4 Integrate with document manager's parse events

## 7. Refactor Server

- [ ] 7.1 Update `server.ts` to use `ProviderRegistry`
- [ ] 7.2 Update `server.ts` to use `DocumentManager`
- [ ] 7.3 Register all providers in server initialization
- [ ] 7.4 Remove direct feature handler registrations
- [ ] 7.5 Create `src/providers/index.ts` barrel export

## 8. Verification

- [ ] 8.1 Run test suite to verify no regressions
- [ ] 8.2 Verify server.ts is now ~100 lines
- [ ] 8.3 Test adding a mock provider to verify pattern works
- [ ] 8.4 Verify all LSP features still work in VSCode
