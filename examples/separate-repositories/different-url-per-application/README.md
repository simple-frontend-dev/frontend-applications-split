# Separate Repositories

## Different url per application under the same domain

When your applications are live under the same domain but different URLs, for example https://website.com/home and https://website.com/blog, then you will have to use a reverse proxy at some point in your stack to be able to serve the different frontend applications mapped to different repositories.

The simplest setup you can use to map incoming requests is a dedicated reverse proxy such as [nginx](https://nginx.org/) but you can use any reverse proxy at any point in your stack.

In this example, we have 2 folders `homepage` and `blog` which you can see as 2 different repositories you can host and deploy completely independently and connect their exposed endpoint to your reverse proxy.

## When to use ?

You have distinct apps serving different purposes which are managed by different large teams with good frontend expertise in each and you do not want them to share the same infrastructure.

## Consequences of this setup:

Pros:

1. Teams will be able to operate in competely autonomy so they are able to choose different tech stacks and release at different paces.
1. Hosting and deployment of those different applications is simple as one repository maps to an URL subpath mapped to your reverse proxy.

Cons:

1. Teams will each have to dedicate time to develop and maintain duplicated infrastructure in terms of dependency management, security maitenance, local developer experience, CI/CD, devops, etc.
1. Cross team contributions will be more difficult if the tech stacks and code architecture start to diverge.
1. While possible, sharing packaged dependencies between those teams (design system, common librairies) will not scale well with the number of dependencies and frontend applications.

## Setup

`homepage` and `blog` folders each contain a simple Typescript app built with Vite.

Each application is served under a different distinct port and declares a base path, example vite config for blog:

```javascript
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 4000,
  },
  base: "/blog",
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

2. Open 3 terminal windows to install dependencies and run applications as well as nginx:

3. On first window, run:

```bash
cd ./homepage && pnpm install && pnpm run dev
```

4. On second window, run:

```bash
cd ./blog && pnpm install && pnpm run dev
```

5. on third window, run:

```bash
[sudo] nginx -c %ABSOLUTE_PATH_TO_THIS_FOLDER%/reverse-proxy.conf
```

You can now navigate to http://localhost:8080/home and http://localhost:8080/blog to access your frontend applications. (Do not directly go to localhost:3000 or localhost:4000 otherwise navigation won't work.)

6. Stop nginx with

```bash
[sudo] nginx -c %ABSOLUTE_PATH_TO_THIS_FOLDER%/reverse-proxy.conf -s quit
```
