# Monorepository

## Different url per application under the same domain

When your applications are live under the same domain but at different URLs, for example https://website.com/home and https://website.com/blog, then you will have to use a reverse proxy at some point in your stack to be able to route the traffic to your different frontend applications. You can still use a monorepository to serve your different frontend applications.

In fact it presents many [advantages](https://www.simplefrontend.dev/blog/why-a-frontend-monorepo/).

In this example, we have 2 folders `homepage` and `blog` which you can see as 2 different applications you can host and deploy completely independently.

## When to use ?

You have distinct apps serving different purposes and you you want different applications and/or teams to align and share their development setup and practices to encourage reusability and reduce overall efforts on developer experience and dependencies management.

## Consequences of this setup:

Pros:

1. Streamlined development with shared opininated configurations (Typescript, formatting, linting etc.) that allow developers to focus on delivering business value.
1. You no longer have to synchronize shared dependencies releases and updates accross many scattered repositories.
1. Cross team contributions are much easier.
1. One (possibly virtual) team can focus on operational work (dependency management, security maitenance, local developer experience, CI/CD, devops, etc.), and all teams will benefit from it.

Cons:

1. You have to invest a bit more in the initial setup for example to setup monorepository tooling.
1. You have to invest into a collaboration model and a proper code architecture for the monorepository (which is a benefit in disguise).

## Setup

I am using the default workspace setup from pnpm with a `pnpm-workspace.yaml` configuration as follows:

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

`homepage` and `blog` folders under apps each contain a simple Typescript app built with Vite. They are both importing a local package `header` shared by both apps. The header app is a web component in this example but it could be anything.

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

This is following [Turbo's Just-in-Time Packages](https://turbo.build/repo/docs/core-concepts/internal-packages#just-in-time-packages) approach which works great with modern bundlers like Vite and completely eliminates the need for a specific build step for those packages (which is good for a demo like this one but not necessarily what you might want in a large monorepo setup if you want to cache build artefacts).

We also need to extend the default vite configuration to serve our apps at predefined ports for our reverse proxy, for example for the homepage app:

```javascript
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 3000,
  },
  base: "/home",
});
```

For the reverse proxy, as a demo, I am using nginx. We extend the default nginx configuration with a local `reverse-proxy.conf` file:

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

Note: you can use the reverse proxy of choice and it can be deployed where you want in your stack.

## Demo

1. [Install nginx](https://nginx.org/en/docs/install.html). On MacOS I would recommend installing it through brew:

```bash
brew install nginx
```

2. At the root of the repository, install dependencies:

```bash
pnpm install
```

3. Open 3 terminal windows to run the apps as well as nginx:

4. Homepage app:

```bash
cd ./apps/homepage && pnpm run dev
```

5. Blog app:

```bash
cd ./apps/blog && pnpm run dev
```

6. Start nginx:

```bash
[sudo] nginx -c %ABSOLUTE_PATH_TO_THIS_FOLDER%/reverse-proxy.conf
```

You can now navigate to http://localhost:8080/home and http://localhost:8080/blog to access your frontend applications. (Do not directly go to localhost:3000 or localhost:4000 otherwise navigation won't work.)

7. Stop nginx with

```bash
[sudo] nginx -c %ABSOLUTE_PATH_TO_THIS_FOLDER%/reverse-proxy.conf -s quit
```
