# project-structure Specification

## Purpose

TBD - created by archiving change add-project-structure. Update Purpose after archive.

## Requirements

### Requirement: npm Workspaces Monorepo

The project SHALL be organized as an npm workspaces monorepo with a root `package.json` containing the `workspaces` field pointing to `packages/*`.

#### Scenario: Workspace packages discovered

- **WHEN** `npm install` is run in the root directory
- **THEN** all packages under `packages/` are linked and dependencies installed

#### Scenario: Cross-package dependencies resolved

- **WHEN** `@twig-sense/vscode` depends on `@twig-sense/language-server`
- **THEN** the dependency resolves to the local workspace package

### Requirement: Three-Package Architecture

The monorepo SHALL contain exactly three packages:

- `@twig-sense/language-server` - LSP server implementation
- `@twig-sense/tree-sitter-twig` - Tree-sitter grammar for Twig
- `@twig-sense/vscode` - VSCode extension client

#### Scenario: Package independence

- **WHEN** each package is examined
- **THEN** it has its own `package.json`, `tsconfig.json`, and source directory

### Requirement: Shared TypeScript Configuration

The project SHALL have a `tsconfig.base.json` at the root that all packages extend.

#### Scenario: Consistent compiler options

- **WHEN** any package's `tsconfig.json` is examined
- **THEN** it extends `../../tsconfig.base.json`
- **AND** inherits strict mode, ES2022 target, and NodeNext module resolution

### Requirement: Build Tooling

Each package SHALL be bundled with esbuild producing a single output file.

#### Scenario: Language server build

- **WHEN** `npm run build` is run in `packages/language-server`
- **THEN** `dist/index.js` is produced as a CommonJS bundle

#### Scenario: Extension build

- **WHEN** `npm run build` is run in `packages/vscode`
- **THEN** `dist/extension.js` is produced as a CommonJS bundle

### Requirement: Architecture Documentation

The project SHALL maintain architecture documentation explaining the codebase structure and patterns.

#### Scenario: Architecture overview

- **WHEN** a new contributor reads `docs/ARCHITECTURE.md`
- **THEN** they can understand the package structure, core components, and data flow

#### Scenario: Feature addition guide

- **WHEN** a developer wants to add a new LSP feature
- **THEN** the architecture document provides step-by-step instructions

### Requirement: Contributing Guide

The project SHALL maintain a contributing guide for new contributors.

#### Scenario: Quick start

- **WHEN** a new contributor reads `CONTRIBUTING.md`
- **THEN** they can set up the development environment and run the extension

#### Scenario: Code standards

- **WHEN** a contributor submits code
- **THEN** they can reference the contributing guide for style and testing requirements
