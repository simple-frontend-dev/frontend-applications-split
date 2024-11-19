# Separate Repositories

## Module Federation

When your applications are live under the same domain but different URLs, for example https://website.com/home and https://website.com/blog

For the basic setup you can check [the reverse proxy split setup](../reverse-proxy-split/).

Here we will enhance the reverse proxy setup with shared runtime dependencies thanks to [Module Federation](https://module-federation.io/guide/start/index.html). Those dependencies are a banner simulating a shared UI dependency and a web vitals collector simulating a shared observability package.

The second version of Module Federation is supported by all major bundlers and allows you to share code and resources among multiple JavaScript application at runtime!

## When to use?

When you have very distinct apps in terms of business logic which are managed by a very small number of teams (2 to 3 maximum) and each team has good frontend expertise and you want to have shared runtime dependencies for reusability and centralization of common concerns.

There are 3 main advantages to this setup:

1. Teams will be able to operate in competely autonomy to one another so they are able to choose different tech stacks and release at different paces.
2. Hosting and deployment of those different applications is simple as one repository maps to one domain
3. You are able to centralize some of your cross cutting concerns such as observability and A/B testing

There are multiple disavantages which can build up over time:

1. Teams will each have to dedicate time to develop and maintain duplicated infrastructure in terms of dependency management, security maitenance, local developer experience, CI/CD, devops, etc.
2. Cross team contributions will be more difficult if the tech stacks and code architecture starts to diverge

## Setup

I will skip the nginx setup that you can find [here](../reverse-proxy-split/).

`homepage` and `blog` folders each contain a simple vanilla Typescript app built with Vite and setup with module federation to host remote applications, for example for hothe homepage app:

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

`remote-banner` and `remote-web-vitals-reporter` simulate how shared runtime dependencies app would run and by injected at runtime thanks to module federation. They do not have to know anything about their host applications and a sample vite config looks like this:

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

## Demo

1. Open 4 terminal windows to install dependencies and run applications:

2. Homepage host app:

```bash
cd ./homepage && pnpm install && pnpm run dev
```

2. Blog host app:

```bash
cd ./blog && pnpm install && pnpm run dev
```

2. Banner remote app:

```bash
cd ./remote-banner && pnpm install && pnpm run dev
```

2. Web vitals reporter remote app:

```bash
cd ./remote-web-vitals-reporter && pnpm install && pnpm run dev
```

## Why runtime dependencies?

Runtime dependencies are much easier to synchronize accross apps as you can simply redeploy them for every apps to have their latest version, eliminating lots of tedious work. Of course that puts increase risks on those app deliveries so a good quality assurance process will be necessary.

The biggest advantage is that you can release hotfixes and new features without having to syncrhonize and redeploy all your applications.

## What's the difference with a script tag loading a remote script that can be updated?

There are 2 main advantages of using module federation:

1. You can declare **shared** packages dependencies between your host and remotes such as framework dependencies (React, Vue etc) to reduce the overall bundle size while allowing the flexibility of framework development.
2. Great developer experience and debuggigng tools. This is where v2 of module federation really shines in my opinion with debugging tools integration such as [Chrome DevTools](https://module-federation.io/guide/basic/chrome-devtool.html)
