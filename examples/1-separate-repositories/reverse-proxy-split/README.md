# Separate Repositories

## Reverse proxy split

When your applications are live under the same domain but different URLS, for example https://website.com/home and https://website.com/blog, then you will have to use a reverse proxy at some point in your stack to be able to serve the different frontend applications mapped to different repositories.

The simplest setup you can use for that is a dedicated reverse proxy such as [nginx](https://nginx.org/) for incoming requests to https://website.com

## When to use

When you have very distinct apps in terms of business logic which are managed by a very small number of teams (2 to 3 maximum) and each team has good frontend expertise, this setup makes sense.

## Consequences

There are 2 main advantages to this setup:

1. Teams will be able to operate in competely autonomy to one another so they are able to choose different tech stacks and release at different paces
2. Hosting and deployment of those different applications is simple as one repository maps to one domain

There are multiple disavantages which can build up over time:

1. Teams will each have to dedicate time to develop and maintain duplicated infrastructure in terms of dependency management, security maitenance, local developer experience, CI/CD, devops, etc.
2. Cross team contributions will be more difficult if the tech stacks and code architecture starts to diverge
3. While possible, sharing dependencies between those teams (design system, common librairies) will not scale well with the number of dependencies

## Setup

`homepage` and `blog` folders each contain a simple vanilla Typescript app built with Vite.

Each application is served under a different distinct port and declares a base path, example for blog:

```javascript
defineConfig({
  server: {
    port: 4000,
  },
  base: "/blog",
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

2. Open 3 terminal windows

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
[sudo] -c %ABSOLUTE_PATH_TO_THIS_FOLDER%/reverse-proxy.conf
```

You can now navigate to http://localhost:8080/home and http://localhost:8080/blog to access your frontend applications
