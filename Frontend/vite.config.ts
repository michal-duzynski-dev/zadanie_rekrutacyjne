import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy API requests to the backend server
      "/api": {
        target: "http://localhost:5093",
        changeOrigin: true,
        secure: false,
      },
    },
    cors: true,
  },
  build: {
    outDir: "dist",
  },
  base: "/",
});
