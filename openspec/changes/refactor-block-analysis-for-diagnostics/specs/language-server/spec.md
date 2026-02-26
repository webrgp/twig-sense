## MODIFIED Requirements

### Requirement: Block Type Registry

The language server SHALL maintain a `BlockType` union type and `BLOCK_PAIRS` map that includes all supported Twig block tag types.

#### Scenario: BlockType includes with

- **WHEN** the `BlockType` union and `BLOCK_PAIRS` map are defined
- **THEN** `"with"` is included as a block type with `"endwith"` as its closer
- **AND** the tree-sitter grammar's keyword list includes both `"with"` and `"endwith"`
