## Context

The current `server.ts` directly registers all LSP handlers and manages document lifecycle, making it a monolithic file that grows with each new feature. This makes it difficult to:

- Add new features without understanding the entire file
- Test features in isolation
- Maintain separation of concerns

## Goals / Non-Goals

**Goals:**

- Establish a clear pattern for adding new LSP features
- Enable isolated testing of individual providers
- Reduce server.ts to pure orchestration (~100 lines)
- Make feature dependencies explicit through ProviderContext

**Non-Goals:**

- Plugin/extension system for third-party providers
- Hot-reloading of providers
- Complex dependency injection framework

## Decisions

### Decision: Use FeatureProvider interface with registry pattern

Each LSP feature implements a common interface, and the registry aggregates capabilities and routes initialization.

**Alternatives considered:**

- Functional composition: Less discoverable, harder to type
- Event-based architecture: Overkill for current needs
- Decorator pattern: TypeScript decorator limitations

### Decision: Extract DocumentManager as separate class

Document lifecycle (open/change/close) and parsing are cross-cutting concerns used by all providers.

**Alternatives considered:**

- Keep in server.ts: Maintains coupling
- Per-provider document access: Duplication

### Decision: ProviderContext passed to register()

Providers receive context at registration time rather than constructor, allowing deferred initialization.

**Alternatives considered:**

- Constructor injection: Requires factory pattern
- Global singletons: Testing nightmare

## Risks / Trade-offs

- **Risk**: Slight indirection overhead
  - **Mitigation**: Registry is simple Map lookup, negligible performance impact

- **Risk**: Learning curve for new pattern
  - **Mitigation**: Clear examples and CONTRIBUTING.md documentation

## Migration Plan

1. Create provider infrastructure alongside existing code
2. Convert one feature at a time (start with completions)
3. Once all features converted, remove old code from server.ts
4. No breaking changes to LSP behavior

## Open Questions

- Should providers be lazy-loaded based on client capabilities?
- Should we add provider health checks for debugging?
