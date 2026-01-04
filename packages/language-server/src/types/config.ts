/**
 * Configuration interface for Twig Sense language server.
 * This interface mirrors the configuration schema defined in packages/vscode/package.json.
 */

export interface TwigSenseConfig {
  semanticTokens: {
    enabled: boolean;
  };
  diagnostics: {
    enabled: boolean;
    inlineComments: boolean;
  };
  completion: {
    templateRoot: string;
  };
  html: {
    semanticHighlighting: boolean;
  };
}

/**
 * Default configuration values.
 * These defaults match the schema defaults in packages/vscode/package.json.
 */
export const DEFAULT_CONFIG: TwigSenseConfig = {
  semanticTokens: {
    enabled: true,
  },
  diagnostics: {
    enabled: true,
    inlineComments: true,
  },
  completion: {
    templateRoot: "templates",
  },
  html: {
    semanticHighlighting: true,
  },
};

/**
 * Deep merges a partial configuration with the default configuration.
 * Ensures all properties have values even when the user provides partial configuration.
 * Always returns a new object with new nested objects (no shared references).
 */
export function mergeWithDefaults(partial: Partial<TwigSenseConfig> | undefined): TwigSenseConfig {
  return {
    semanticTokens: {
      enabled: partial?.semanticTokens?.enabled ?? DEFAULT_CONFIG.semanticTokens.enabled,
    },
    diagnostics: {
      enabled: partial?.diagnostics?.enabled ?? DEFAULT_CONFIG.diagnostics.enabled,
      inlineComments:
        partial?.diagnostics?.inlineComments ?? DEFAULT_CONFIG.diagnostics.inlineComments,
    },
    completion: {
      templateRoot: partial?.completion?.templateRoot ?? DEFAULT_CONFIG.completion.templateRoot,
    },
    html: {
      semanticHighlighting:
        partial?.html?.semanticHighlighting ?? DEFAULT_CONFIG.html.semanticHighlighting,
    },
  };
}
