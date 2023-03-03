import { build } from "esbuild";

try {
  await build({
    bundle: true,
    sourcemap: true,
    minify: true,
    external: ["__STATIC_CONTENT_MANIFEST"],
    conditions: ["worker", "browser"],
    entryPoints: ["src/index.js"],
    outdir: "dist",
    outExtension: { ".js": ".mjs" },
    format: "esm",
    target: "esnext",
  });
} catch {
  process.exitCode = 1;
}
