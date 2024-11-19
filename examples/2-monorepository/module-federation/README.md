# One Monorepository

## Reverse proxy split

When your applications are live under the same domain but different URLs, for example https://website.com/home and https://website.com/blog, then you will have to use a reverse proxy at some point in your stack to be able to serve the different frontend applications which can be apps in a monorepository.

A monorepository presents many [advantages](https://www.simplefrontend.dev/blog/why-a-frontend-monorepo/)!

Here we have 2 folders `homepage` and `blog` which you can see as 2 different applications you can host and deploy completely independently.

For the basic setup you can check [the reverse proxy split setup](../reverse-proxy-split/).

Here we will enhance the reverse proxy setup with shared runtime dependencies thanks to [Module Federation](https://module-federation.io/guide/start/index.html). Those dependencies are a banner simulating a shared UI dependency and a web vitals collector simulating a shared observability package.

The second version of Module Federation is supported by all major bundlers and allows you to share code and resources among multiple JavaScript application at runtime!

## When to use

When you have very distinct apps in terms of business logic and you want every team to align their development practices to encourage reusability, sharing dependencies and reduce the overall efforts on developer experience and dependencies management. You also want to have shared runtime dependencies for reusability and centralization of common concerns.

## Consequences:

There are many advantages to this setup:

1. Teams will be able to focus on delivering business value by mainly focusing on application code
2. Streamlined development with shared opininated configurations (Typescript, formatting, linting etc)
3. You no longer have to synchronize shared dependencies releases and updates accross many scattered repositories
4. One (possibly virtual) team can focus on operational work (dependency management, security maitenance, local developer experience, CI/CD, devops, etc.), and all teams will benefit
5. Cross team contributions will be much easier

There are a few disavantages:

1. You will have to invest a bit more in the initial setup for example to setup monorepository tooling
2. You will have to invest into a collaboration model and a proper code architecture for the monorepository (which is a benefit in disguise)

## Setup

I will skip the nginx setup that you can find [here](../reverse-proxy-split/).

`homepage` and `blog` folders each contain a simple vanilla Typescript app built with Vite and setup with module federation to host remote applications.

I am using the default workspace setup from pnpm with a `pnpm-workspace.yaml` configuration as follows:

```yaml
packages:
  - "apps/*"
```

`homepage` app is setup as module federation host with the following vite config (similar for blog):

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

`remote-banner` and `remote-web-vitals-reporter` simulate how shared runtime dependencies app would run and by injected at runtime thanks to module federation.

They are also in `apps` folder as they are also independant running applications

They do not have to know anything about their host applications and a sample vite config looks like this:

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

1. At the root of the repository, install dependencies:

```bash
pnpm install
```

2. Open 4 terminal windows to install dependencies and run applications:

3. Homepage app:

```bash
cd ./apps/homepage && pnpm run dev
```

4. Blog app:

```bash
cd ./apps/blog && pnpm run dev
```

5. Banner remote app:

```bash
cd ./apps/remote-banner && pnpm run dev
```

6. Web vitals reporter remote app:

```bash
cd ./apps/remote-web-vitals-reporter && pnpm run dev
```

You can now navigate to http://localhost:8080/home and http://localhost:8080/blog to access your frontend applications. (Do not directly access localhost:3000 or localhost:4000 otherwise navigation won't work.)

## Why runtime dependencies?

Runtime dependencies are much easier to synchronize accross apps as you can simply redeploy them for every apps to have their latest version, eliminating lots of tedious work. Of course that puts increase risks on those app deliveries so a good quality assurance process will be necessary.

The biggest advantage is that you can release hotfixes and new features without having to syncrhonize and redeploy all your applications.

## What's the difference with a script tag loading a remote script that can be updated?

There are 2 main advantages of using module federation:

1. You can declare **shared** packages dependencies between your host and remotes such as framework dependencies (React, Vue etc) to reduce the overall bundle size while allowing the flexibility of framework development.
2. Great developer experience and debuggigng tools. This is where v2 of module federation really shines in my opinion with debugging tools integration such as [Chrome DevTools](https://module-federation.io/guide/basic/chrome-devtool.html)
