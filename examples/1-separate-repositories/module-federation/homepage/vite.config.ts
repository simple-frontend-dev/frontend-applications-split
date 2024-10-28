import { defineConfig } from "vite";
import { federation } from "@module-federation/vite";

export default defineConfig({
  plugins: [
    federation({
      name: "homepage",
      remotes: {
        "web-vitals-reporter": {
          type: "module",
          name: "web-vitals-reporter",
          entry: "http://localhost:2000/web-vitals-reporter.js",
          entryGlobalName: "remote-web-vitals-reporter",
        },
        banner: {
          type: "module",
          name: "banner",
          entry: "http://localhost:2001/banner.js",
          entryGlobalName: "remote-banner",
        },
      },
    }),
  ],
});
