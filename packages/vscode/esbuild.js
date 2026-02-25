const esbuild = require("esbuild");
const fs = require("fs");
const path = require("path");

const watch = process.argv.includes("--watch");

/**
 * Copy the language-server dist files into dist/server/ so the VSIX
 * package is self-contained and doesn't need to reference sibling packages.
 */
function copyLanguageServerDist() {
  const serverSrcDir = path.resolve(__dirname, "..", "language-server", "dist");
  const serverDestDir = path.resolve(__dirname, "dist", "server");

  fs.mkdirSync(serverDestDir, { recursive: true });

  const files = fs.readdirSync(serverSrcDir);
  for (const file of files) {
    fs.copyFileSync(path.join(serverSrcDir, file), path.join(serverDestDir, file));
  }
  console.log(`Copied ${files.length} language-server files to dist/server/`);
}

async function build() {
  const ctx = await esbuild.context({
    entryPoints: ["src/extension.ts"],
    bundle: true,
    outfile: "dist/extension.js",
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

  copyLanguageServerDist();
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
