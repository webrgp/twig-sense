## 1. Create Types Directory

- [ ] 1.1 Create `src/types/` directory in language-server package
- [ ] 1.2 Create `src/types/index.ts` barrel export

## 2. Define Configuration Interface

- [ ] 2.1 Create `src/types/config.ts` with `TwigSenseConfig` interface
- [ ] 2.2 Include all current configuration properties:
  - `semanticTokens.enabled: boolean`
  - `diagnostics.enabled: boolean`
  - `diagnostics.inlineComments: boolean`
  - `completion.templateRoot: string`
  - `html.semanticHighlighting: boolean`
- [ ] 2.3 Export `DEFAULT_CONFIG` constant with sensible defaults

## 3. Implement Configuration Merger

- [ ] 3.1 Create `mergeWithDefaults(partial: Partial<TwigSenseConfig>): TwigSenseConfig`
- [ ] 3.2 Implement deep merge logic
- [ ] 3.3 Add unit tests for merge function

## 4. Update Configuration Access

- [ ] 4.1 Update server.ts to use typed configuration
- [ ] 4.2 Update semantic-tokens.ts to use typed configuration
- [ ] 4.3 Update any validators using configuration
- [ ] 4.4 Remove optional chaining from known properties

## 5. Synchronize with VSCode Package

- [ ] 5.1 Ensure `package.json` contributes match TypeScript interface
- [ ] 5.2 Document configuration options in README if needed

## 6. Verification

- [ ] 6.1 Run TypeScript compiler with strict mode
- [ ] 6.2 Run test suite to verify no regressions
- [ ] 6.3 Verify VSCode settings work correctly
