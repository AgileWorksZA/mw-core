import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { resolve } from "path";

export default defineConfig({
  plugins: [tsconfigPaths(), reactRouter()],
  ssr: {
    noExternal: [
      "@clerk/clerk-react",
      "@moneyworks/data",
      "@moneyworks/canonical",
      "@moneyworks/utilities"
    ]
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"]
  },
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: [
      // Main package exports
      { find: /^@moneyworks\/data$/, replacement: resolve(__dirname, "../data/src/index.ts") },
      { find: /^@moneyworks\/canonical$/, replacement: resolve(__dirname, "../canonical/src/index.ts") },
      { find: /^@moneyworks\/utilities$/, replacement: resolve(__dirname, "../utilities/src/index.ts") },
      // Subpath exports
      { find: /^@moneyworks\/canonical\/(.+)$/, replacement: resolve(__dirname, "../canonical/src/entities/$1/index.ts") },
      { find: /^@moneyworks\/data\/(.+)$/, replacement: resolve(__dirname, "../data/src/$1.ts") },
      { find: /^@moneyworks\/utilities\/(.+)$/, replacement: resolve(__dirname, "../utilities/src/$1.ts") }
    ]
  }
});