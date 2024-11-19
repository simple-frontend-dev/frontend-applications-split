# One Monorepository

## Distinct domains per applications

When your applications are live under distinct domains, for example https://website-home.com and https://website-blog.com, you can use a monorepository to serve your different frontend applications.

In fact it presents many [advantages](https://www.simplefrontend.dev/blog/why-a-frontend-monorepo/)!

Here we have 2 folders `homepage` and `blog` which you can see as 2 different applications you can host and deploy completely independently.

## When to use?

When you have very distinct apps in terms of business logic and you want every team to align their development practicse to encourage reusability, sharing dependencies and reduce the overall efforts on developer experience and dependencies management.

## Consequences:

There are 4 main advantages to this setup:

1. Teams will be able to focus on delivering business value by mainly focusing on application code
2. Streamlined development with shared opininated configurations (Typescript, formatting, linting etc)
3. You no longer have to synchronize shared dependencies releases and updates accross many scattered repositories
4. One (possibly virtual) team can focus on operational work (dependency management, security maitenance, local developer experience, CI/CD, devops, etc.), and all teams will benefit
5. Cross team contributions will be much easier

There are a few disavantages:

1. You will have to invest a bit more in the initial setup for example to setup monorepository tooling
2. You will have to invest into a collaboration model and a proper code architecture for the monorepository (which is a benefit in disguise)

## Setup

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

## Demo

1. At the root of the repository, install dependencies:

```bash
pnpm install
```

2. Open 2 terminal windows to install dependencies and run applications:

3. Homepage app:

```bash
cd ./homepage && pnpm run dev
```

4. Blog app:

```bash
cd ./blog && pnpm run dev
```
