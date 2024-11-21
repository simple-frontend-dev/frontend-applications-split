# Separate Repositories

## Different url per application under the same domain

When your applications are live under the same domain but different URLs, for example https://website.com/home and https://website.com/blog, then you will have to use a reverse proxy at some point in your stack to be able to serve the different frontend applications mapped to different repositories.

The simplest setup you can use to map incoming requests is a dedicated reverse proxy such as [nginx](https://nginx.org/) but you can use any reverse proxy at any point in your stack.

In this example, we have 2 folders `homepage` and `blog` which you can see as 2 different repositories you can host and deploy completely independently and connect their exposed endpoint to your reverse proxy.

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

`homepage` and `blog` apps are setup as module federation hosts and served at predefined ports for our reverse proxy. Example Vite configuration for homepage:

```typescript
import { defineConfig } from "vite";
import { federation } from "@module-federation/vite";

export default defineConfig({
  server: {
    port: 3000,
  },
  base: "/home",
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
  "web-vitals-reporter": ["../remote-web-vitals-reporter/src/main.ts"],
  "banner": ["../remote-banner/src/main.ts"]
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

I think I've hit a weird bug with Windows Subsystem for Linux and `/home` with Vite module federation so that's why in this example I am redirecting /home to /homepage but it should not be necessary with a native unix systems.

Note: you can use the reverse proxy of choice and it can be deployed where you want in your stack.

## Demo

1. Open 5 terminal windows to install dependencies and run applications as well as nginx:

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

6. Start nginx:

```bash
[sudo] nginx -c %ABSOLUTE_PATH_TO_THIS_FOLDER%/reverse-proxy.conf
```

You can now navigate to http://localhost:8080/home and http://localhost:8080/blog to access your frontend applications. (Do not directly go to localhost:3000 or localhost:4000 otherwise navigation won't work.)

If you open the console and reload the page, you will see the web vitals reporting coming from the rremote web-vitals-reporter module.

7. Stop nginx with

```bash
[sudo] nginx -c %ABSOLUTE_PATH_TO_THIS_FOLDER%/reverse-proxy.conf -s quit
```
