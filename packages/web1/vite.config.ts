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
    alias: {
      "@moneyworks/data": resolve(__dirname, "../data/src/index.ts"),
      "@moneyworks/canonical": resolve(__dirname, "../canonical/src/index.ts"),
      "@moneyworks/utilities": resolve(__dirname, "../utilities/src/index.ts")
    }
  }
});