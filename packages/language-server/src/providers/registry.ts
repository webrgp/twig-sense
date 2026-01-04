import { ServerCapabilities } from "vscode-languageserver/node";
import type { FeatureProvider, ProviderContext } from "./types";

/**
 * Registry for managing LSP feature providers.
 * Handles provider registration, capability aggregation, and lifecycle management.
 */
export class ProviderRegistry {
  private providers: Map<string, FeatureProvider> = new Map();

  /**
   * Register a provider with the registry.
   * @param provider The provider to register
   * @throws Error if a provider with the same id is already registered
   */
  register(provider: FeatureProvider): void {
    if (this.providers.has(provider.id)) {
      throw new Error(`Provider with id '${provider.id}' is already registered`);
    }
    this.providers.set(provider.id, provider);
  }

  /**
   * Aggregate capabilities from all registered providers.
   * Called during onInitialize to build the full server capabilities.
   */
  getCapabilities(): ServerCapabilities {
    const capabilities: ServerCapabilities = {};

    for (const provider of this.providers.values()) {
      const providerCapabilities = provider.getCapabilities();
      Object.assign(capabilities, providerCapabilities);
    }

    return capabilities;
  }

  /**
   * Initialize all providers with the shared context.
   * Called after server initialization to register handlers.
   */
  initializeAll(context: ProviderContext): void {
    for (const provider of this.providers.values()) {
      provider.register(context);
    }
  }

  /**
   * Get a provider by its id with type safety.
   * @param id The provider id
   * @returns The provider if found, undefined otherwise
   */
  get<T extends FeatureProvider>(id: string): T | undefined {
    return this.providers.get(id) as T | undefined;
  }

  /**
   * Dispose all providers and clear the registry.
   * Called during server shutdown.
   */
  dispose(): void {
    for (const provider of this.providers.values()) {
      provider.dispose?.();
    }
    this.providers.clear();
  }
}
