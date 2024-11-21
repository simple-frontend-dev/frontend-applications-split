# Monorepository

## Different url per application under the same domain

When your applications are live under the same domain but at different URLs, for example https://website.com/home and https://website.com/blog, then you will have to use a reverse proxy at some point in your stack to be able to route the traffic to your different frontend applications. You can still use a monorepository to serve your different frontend applications.

In fact it presents many [advantages](https://www.simplefrontend.dev/blog/why-a-frontend-monorepo/).

In this example, we have 2 folders `homepage` and `blog` which you can see as 2 different applications you can host and deploy completely independently.

## When to use ?

You have distinct apps serving different purposes and you want different applications and/or teams to align and share their development setup and practices to encourage reusability and reduce overall efforts on developer experience and dependencies management.

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

`homepage` and `blog` apps are setup as module federation hosts and served at predefined ports for our reverse proxy. Example Vite configuration for homepage:

```typescript
import { defineConfig } from "vite";
import { federation } from "@module-federation/vite";

export default defineConfig({
  server: {
    port: 3000,
  },
  base: "/homepage",
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

Update your `tsconfig.json` configuration with the paths of the remote runtime dependencies:

```json
"paths": {
  "web-vitals-reporter": ["./apps/remote-web-vitals-reporter/src/main.ts"],
  "banner": ["./apps/remote-banner/src/main.ts"]
}
```

Finally, for the reverse proxy, as a demo, I am using nginx. We extend the default nginx configuration with a local `reverse-proxy.conf` file:

```
server {
    listen 8080;

      location /home {
        rewrite ^ /homepage break;
        proxy_pass http://localhost:3000;
    }

    location /homepage {
        proxy_pass http://localhost:3000;
    }

    location /blog {
        proxy_pass http://localhost:4000;
    }
}
```

I think I've hit a weird bug with Windows Subsystem for Linux and `/home` with Vite module federation so that's why in this example I am redirected /home to /homepage but it should not be necessary native unix systems.

Note: you can use the reverse proxy of choice and it can be deployed where you want in your stack.

## Demo

1. At the root of the repository, install dependencies:

```bash
pnpm install
```

2. Open 5 terminal windows to run the apps as well as nginx:

3. Homepage host app:

```bash
cd ./apps/homepage && pnpm run dev
```

4. Blog host app:

```bash
cd ./apps/blog && pnpm run dev
```

5. Shared remote banner app:

```bash
cd ./apps/remote-banner && pnpm run dev
```

6. Shared remote web-vitals-reporter app:

```bash
cd ./apps/remote-web-vitals-reporter && pnpm run dev
```

7. Start nginx:

```bash
[sudo] nginx -c %ABSOLUTE_PATH_TO_THIS_FOLDER%/reverse-proxy.conf
```

You can now navigate to http://localhost:8080/home and http://localhost:8080/blog to access your frontend applications. (Do not directly go to localhost:3000 or localhost:4000 otherwise navigation won't work.)

If you open the console and reload the page, you will see the web vitals reporting coming from the rremote web-vitals-reporter module.

8. Stop nginx with

```bash
[sudo] nginx -c %ABSOLUTE_PATH_TO_THIS_FOLDER%/reverse-proxy.conf -s quit
```
