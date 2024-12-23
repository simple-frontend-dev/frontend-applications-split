# Monorepository

### Different domain per application

When your applications are live under different domains, for example https://website-home.com and https://website-blog.com, you can still use a monorepository to serve your different frontend applications.

In fact it presents many [advantages](https://www.simplefrontend.dev/blog/why-a-frontend-monorepo/).

In this example, we have 2 folders `homepage` and `blog` under `apps` which you can see as 2 different applications you can host and deploy completely independently.

## When to use?

You have distinct apps serving different purposes and you want different applications and/or teams to align and share their development setup and practices to encourage reusability and reduce overall efforts on developer experience and dependencies management.

## Consequences of this setup:

Pros:

1. Streamlined development with shared opininated configurations (Typescript, formatting, linting etc.) that allow developers to focus on delivering business value.
1. You no longer have to synchronize shared dependencies releases and updates accross many scattered repositories.
1. Cross team contributions are much easier.
1. One (possibly virtual) team can focus on operational work (dependency management, security maitenance, local developer experience, CI/CD, devops, etc.), and all teams will benefit from it.

Cons:

1. You have to invest in the initial setup for example to setup monorepository tooling.
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

## Demo

1. At the base folder, install dependencies:

```bash
pnpm install
```

2. Open 2 terminal windows to install dependencies and run applications:

3. Homepage app:

```bash
cd ./apps/homepage && pnpm run dev
```

4. Blog app:

```bash
cd ./apps/blog && pnpm run dev
```

You can access both applications under different domains (represented by different ports in this example)
