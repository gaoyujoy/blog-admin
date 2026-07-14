import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const apiProxy = { target: "http://localhost:3000", changeOrigin: true };

export default defineConfig({
  base: "/admin",
  plugins: [vue()],
  server: { proxy: { "/api": apiProxy } },
  preview: { proxy: { "/api": apiProxy } },
});
