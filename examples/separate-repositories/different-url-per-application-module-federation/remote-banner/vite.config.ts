import { defineConfig } from "vite";
import { federation } from "@module-federation/vite";

export default defineConfig({
  server: {
    origin: "http://localhost:2000",
    port: 2000,
  },
  base: "http://localhost:2000",
  plugins: [
    federation({
      name: "banner",
      filename: "banner.js",
      exposes: {
        ".": "./src/main.ts",
      },
    }),
  ],
});
