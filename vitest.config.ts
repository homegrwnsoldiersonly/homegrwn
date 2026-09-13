import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/**
 * Mirrors tsconfig's `@/* → ./src/*` so modules that import through the
 * alias (src/lib/seo.ts → @/content/*) resolve under vitest too.
 */
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    include: ["src/**/*.test.ts"],
  },
});
