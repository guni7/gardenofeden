import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: true,
    cors: {
      origin: "*",
      credentials: false,
    },
    proxy: {
      "/tiles": {
        target: "https://alpha.dustproject.org",
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(/^\/tiles/, "/api/assets/map/surface"),
      },
    },
  },
});
