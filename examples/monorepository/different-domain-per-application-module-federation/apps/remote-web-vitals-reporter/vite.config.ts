import { defineConfig } from "vite";
import { federation } from "@module-federation/vite";

export default defineConfig({
  server: {
    origin: "http://localhost:2001",
    port: 2000,
  },
  base: "http://localhost:2001",
  plugins: [
    federation({
      name: "web-vitals-reporter",
      filename: "web-vitals-reporter.js",
      exposes: {
        ".": "./src/main.ts",
      },
    }),
  ],
});
