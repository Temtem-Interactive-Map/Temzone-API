import { build } from "esbuild";

await build({
  bundle: true,
  minify: true,
  external: ["__STATIC_CONTENT_MANIFEST"],
  conditions: ["worker", "browser"],
  entryPoints: ["src/index.js"],
  outdir: "dist",
  outExtension: { ".js": ".mjs" },
  format: "esm",
  target: "esnext",
});
