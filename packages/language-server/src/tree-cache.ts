import { Tree } from "web-tree-sitter";

class TreeCache {
  private cache: Map<string, Tree> = new Map();

  get(uri: string): Tree | undefined {
    return this.cache.get(uri);
  }

  set(uri: string, tree: Tree): void {
    // Delete old tree if exists to free memory
    const oldTree = this.cache.get(uri);
    if (oldTree) {
      oldTree.delete();
    }
    this.cache.set(uri, tree);
  }

  delete(uri: string): void {
    const tree = this.cache.get(uri);
    if (tree) {
      tree.delete();
      this.cache.delete(uri);
    }
  }

  clear(): void {
    for (const tree of this.cache.values()) {
      tree.delete();
    }
    this.cache.clear();
  }
}

export const treeCache = new TreeCache();
