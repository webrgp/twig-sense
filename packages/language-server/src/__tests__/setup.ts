import { beforeAll } from "vitest";
import { initTestParser } from "./utils";

/**
 * Global test setup for Vitest.
 * Initializes the tree-sitter parser before all tests run.
 */
beforeAll(async () => {
  await initTestParser();
});
