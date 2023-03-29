import { build } from "esbuild";

await build({
  bundle: true,
  minify: true,
  sourcemap: true,
  external: ["__STATIC_CONTENT_MANIFEST"],
  entryPoints: ["src/index.ts"],
  outdir: "dist",
  outExtension: { ".js": ".mjs" },
  format: "esm",
  target: "esnext",
});
