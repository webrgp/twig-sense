## 1. Create Types Directory

- [x] 1.1 Create `src/types/` directory in language-server package
- [x] 1.2 Create `src/types/index.ts` barrel export

## 2. Define Configuration Interface

- [x] 2.1 Create `src/types/config.ts` with `TwigSenseConfig` interface
- [x] 2.2 Include all current configuration properties:
  - `semanticTokens.enabled: boolean`
  - `diagnostics.enabled: boolean`
  - `diagnostics.inlineComments: boolean`
  - `completion.templateRoot: string`
  - `html.semanticHighlighting: boolean`
- [x] 2.3 Export `DEFAULT_CONFIG` constant with sensible defaults

## 3. Implement Configuration Merger

- [x] 3.1 Create `mergeWithDefaults(partial: Partial<TwigSenseConfig>): TwigSenseConfig`
- [x] 3.2 Implement deep merge logic
- [x] 3.3 Add unit tests for merge function

## 4. Update Configuration Access

- [x] 4.1 Update server.ts to use typed configuration
- [x] 4.2 Update semantic-tokens.ts to use typed configuration (config check handled in server.ts)
- [x] 4.3 Update any validators using configuration (config check handled in server.ts)
- [x] 4.4 Remove optional chaining from known properties

## 5. Synchronize with VSCode Package

- [x] 5.1 Ensure `package.json` contributes match TypeScript interface
- [x] 5.2 Document configuration options in README if needed (diagnostics settings now documented in package.json)

## 6. Verification

- [x] 6.1 Run TypeScript compiler with strict mode
- [x] 6.2 Run test suite to verify no regressions
- [x] 6.3 Verify VSCode settings work correctly
