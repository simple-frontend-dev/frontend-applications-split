# Monorepository

### Different domain per application

When your applications are live under distinct domains, for example https://website-home.com and https://website-blog.com, you can still use a monorepository to serve your different frontend applications.

In fact it presents many [advantages](https://www.simplefrontend.dev/blog/why-a-frontend-monorepo/).

In this example, we have 2 folders `homepage` and `blog` which you can see as 2 different applications you can host and deploy completely independently.

## When to use?

You have distinct apps serving different purposes and you you want different applications and/or teams to align and share their development setup and practices to encourage reusability and reduce overall efforts on developer experience and dependencies management.

You also want to share runtime dependencies between your apps that you can update without redeploying your apps.

## Consequences of this setup:

Pros:

1. Streamlined development with shared opininated configurations (Typescript, formatting, linting etc.) that allow developers to focus on delivering business value.
1. You no longer have to synchronize shared dependencies releases and updates accross many scattered repositories.
1. Cross team contributions are much easier.
1. One (possibly virtual) team can focus on operational work (dependency management, security maitenance, local developer experience, CI/CD, devops, etc.), and all teams will benefit from it.
1. You can release hotfixes and new features for your runtime dependencies without having to syncrhonize and redeploy all your applications.

Cons:

1. You have to invest a bit more in the initial setup for example to setup monorepository tooling.
1. You have to invest into a collaboration model and a proper code architecture for the monorepository (which is a benefit in disguise).
1. You have to monitor your runtime dependencies as regular applications.

## Setup

I am using the default workspace setup from pnpm with a `pnpm-workspace.yaml` configuration as follows:

```yaml
packages:
  - "apps/*"
```

`homepage` and `blog` folders under apps each contain a simple Typescript app built with Vite.

`homepage` and `blog` apps are setup as module federation hosts. Example Vite configuration for homepage:

```typescript
import { defineConfig } from "vite";
import { federation } from "@module-federation/vite";

export default defineConfig({
  plugins: [
    federation({
      name: "homepage",
      remotes: {
        banner: {
          type: "module",
          name: "banner",
          entry: "http://localhost:2000/banner.js",
          entryGlobalName: "remote-banner",
        },
        "web-vitals-reporter": {
          type: "module",
          name: "web-vitals-reporter",
          entry: "http://localhost:2001/web-vitals-reporter.js",
          entryGlobalName: "remote-web-vitals-reporter",
        },
      },
    }),
  ],
});
```

`remote-banner` and `remote-web-vitals-reporter` simulate how shared runtime dependencies apps would run and be injected at runtime through module federation. They do not have to know anything about their host applications. Example Vite configuration for the banner:

```typescript
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
```

Finally, update your `tsconfig.json` configuration with the paths of the remote runtime dependencies:

```json
"paths": {
  "web-vitals-reporter": ["./apps/remote-web-vitals-reporter/src/main.ts"],
  "banner": ["./apps/remote-banner/src/main.ts"]
}
```

## Demo

1. At the root of the repository, install dependencies:

```bash
pnpm install
```

2. Open 4 terminal windows to run applications:

3. Homepage app:

```bash
cd ./apps/homepage && pnpm run dev
```

4. Blog app:

```bash
cd ./apps/blog && pnpm run dev
```

4. Shared remote banner app:

```bash
cd ./apps/remote-banner && pnpm run dev
```

4. Shared remote web-vitals-reporter app:

```bash
cd ./apps/remote-web-vitals-reporter && pnpm run dev
```

You can access both honmepage and blog applications under different domains (represented by different ports in this example). If you open the console and reload the page, you will see the web vitals reporting common from the remote module.
