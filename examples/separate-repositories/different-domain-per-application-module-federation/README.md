# Separate Repositories

### Different domain per application with module federation

When your applications are live under different domains, for example https://website-home.com and https://website-blog.com, then it is straightforward to use different repositories to serve your different frontend applications.

In this example, 2 folders `homepage` and `blog` which you can see as 2 different repositories you can host and deploy completely independently.

## When to use?

You have distinct apps serving different purposes which are managed by different large teams with good frontend expertise in each and you do not want them to share the same infrastructure.

You also want to share runtime dependencies between your apps that you can update without redeploying your apps.

## Consequences of this setup:

Pros:

1. Teams will be able to operate in competely autonomy so they are able to choose different tech stacks and release at different paces.
1. Hosting and deployment of those different applications is simple as one repository maps to one domain.
1. You can release hotfixes and new features for your runtime dependencies without having to synchronize and redeploy all your applications.

Cons:

1. Teams will each have to dedicate time to develop and maintain duplicated infrastructure in terms of dependency management, security maitenance, local developer experience, CI/CD, devops, etc.
1. Cross team contributions will be more difficult if the tech stacks and code architecture start to diverge.
1. While possible, sharing static dependencies between those teams (design system, common librairies) will not scale well with the number of dependencies and frontend applications.
1. You have to monitor your runtime dependencies like you would for regular applications.

## Setup

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
  "web-vitals-reporter": ["../remote-web-vitals-reporter/src/main.ts"],
  "banner": ["../remote-banner/src/main.ts"]
}
```

## Demo

1. Open 4 terminal windows to install dependencies and run applications:

2. Homepage host app:

```bash
cd ./homepage && pnpm install && pnpm run dev
```

3. Blog host app:

```bash
cd ./blog && pnpm install && pnpm run dev
```

4. Shared remote banner app:

```bash
cd ./remote-banner && pnpm install && pnpm run dev
```

5. Shared remote web-vitals-reporter app:

```bash
cd ./remote-web-vitals-reporter && pnpm install && pnpm run dev
```

You can access both honmepage and blog applications under different domains (represented by different ports in this example). If you open the console and reload the page, you will see the web vitals reporting coming from the remote web-vitals-reporter module.
