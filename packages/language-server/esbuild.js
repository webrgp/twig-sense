const esbuild = require("esbuild");
const fs = require("fs");
const path = require("path");

const watch = process.argv.includes("--watch");

function copyWasmFiles() {
  const distDir = path.join(__dirname, "dist");
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Copy tree-sitter.wasm from web-tree-sitter
  const treeSitterWasm = path.join(
    __dirname,
    "../../node_modules/web-tree-sitter/tree-sitter.wasm"
  );
  if (fs.existsSync(treeSitterWasm)) {
    fs.copyFileSync(treeSitterWasm, path.join(distDir, "tree-sitter.wasm"));
    console.log("Copied tree-sitter.wasm");
  } else {
    console.warn("Warning: tree-sitter.wasm not found at", treeSitterWasm);
  }

  // Copy tree-sitter-twig.wasm from tree-sitter-twig package
  const twigWasm = path.join(
    __dirname,
    "../tree-sitter-twig/tree-sitter-twig.wasm"
  );
  if (fs.existsSync(twigWasm)) {
    fs.copyFileSync(twigWasm, path.join(distDir, "tree-sitter-twig.wasm"));
    console.log("Copied tree-sitter-twig.wasm");
  } else {
    console.warn("Warning: tree-sitter-twig.wasm not found at", twigWasm);
  }
}

async function build() {
  copyWasmFiles();

  const ctx = await esbuild.context({
    entryPoints: ["src/index.ts"],
    bundle: true,
    outfile: "dist/index.js",
    platform: "node",
    target: "node18",
    format: "cjs",
    sourcemap: true,
    external: ["vscode"],
  });

  if (watch) {
    await ctx.watch();
    console.log("Watching for changes...");
  } else {
    await ctx.rebuild();
    await ctx.dispose();
    console.log("Build complete");
  }
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
