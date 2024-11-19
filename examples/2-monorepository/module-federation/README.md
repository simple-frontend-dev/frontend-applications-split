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

`homepage` and `blog` app folders each contain a simple vanilla Typescript app built with default Vite configuration. They are both importing a local package `header` to reuse seamlessly on both apps, even during development. The header app is a web component in this example but it could be anything.

I am using the default workspace setup from pnpm with a `pnpm-workspace.yaml` configuration as follows:

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

`header` package is configured to export all its main module this in package.json

```json
"exports": {
  ".": "./src/main.ts"
}
```

`homepage` and `blog` can then refer to the local package within their package.json file:

```json
"dependencies": {
    "header": "workspace:*"
}
```

and then just use a normal import:

```typescript
import { Header } from "@common/header";
```

This is following [Turbo's Just-in-Time Packages](https://turbo.build/repo/docs/core-concepts/internal-packages#just-in-time-packages) approach which works great with modern bundlers like Vite and completely eliminates the need for a specific build steps for those packages (which is good for a demo like this one but not necessarily what you might one in a large monorepo setup).

We also need to extend the default vite configuration to serve our apps at predefined ports, for example for the homepage app:

```javascript
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 3000,
  },
  base: "/home",
});
```

We extend the default nginx configuration with:

```
server {
    listen 8080;

    location /home {
        proxy_pass http://localhost:3000;
    }

    location /blog {
        proxy_pass http://localhost:4000;
    }
}
```

## Demo

1. [Install nginx](https://nginx.org/en/docs/install.html). On MacOS I would recommend installing it through brew:

```bash
brew install nginx
```

2. At the root of the repository, install dependencies:

```bash
pnpm install
```

3. Open 3 terminal windows to install dependencies and run applications:

4. Homepage app:

```bash
cd ./homepage && pnpm run dev
```

5. Blog app:

```bash
cd ./blog && pnpm run dev
```

6. nginx:

```bash
[sudo] nginx -c %ABSOLUTE_PATH_TO_THIS_FOLDER%/reverse-proxy.conf
```

7. Stop nginx with

```bash
[sudo] nginx -c %ABSOLUTE_PATH_TO_THIS_FOLDER%/reverse-proxy.conf -s quit
```

You can now navigate to http://localhost:8080/home and http://localhost:8080/blog to access your frontend applications. (Do not directly access localhost:3000 or localhost:4000 otherwise navigation won't work.)
