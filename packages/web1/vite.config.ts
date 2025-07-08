import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), reactRouter()],
  ssr: {
    noExternal: ["@clerk/clerk-react"]
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"]
  },
  resolve: {
    dedupe: ["react", "react-dom"]
  }
});