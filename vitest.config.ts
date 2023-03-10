import jsconfigPaths from "vite-jsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [jsconfigPaths()],
  test: {
    watch: false,
  },
});
