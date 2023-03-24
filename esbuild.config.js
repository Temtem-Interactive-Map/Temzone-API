import { sentryEsbuildPlugin } from "@sentry/esbuild-plugin";
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
  plugins: [
    sentryEsbuildPlugin({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      include: "dist",
    }),
  ],
});
