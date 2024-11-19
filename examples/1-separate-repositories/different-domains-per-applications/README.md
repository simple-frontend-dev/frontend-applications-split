# Separate Repositories

## Distinct domains per applications

When your applications are live under distinct domains, for example https://website-home.com and https://website-blog.com, then it is straightforward to use different repositories to serve your different frontend applications.

Here we have 2 folders `homepage` and `blog` which you can see as 2 different repositories you can host and deploy completely independently.

## When to use

When you have very distinct apps in terms of business logic which are managed by a very small number of teams (2 to 3 maximum) and each team has good frontend expertise, this setup makes sense.

## Consequences

There are 2 main advantages to this setup:

1. Teams will be able to operate in competely autonomy to one another so they are able to choose different tech stacks and release at different paces
2. Hosting and deployment of those different applications is simple as one repository maps to one domain

There are multiple disavantages which can build up over time:

1. Teams will each have to dedicate time to develop and maintain duplicated infrastructure in terms of dependency management, security maitenance, local developer experience, CI/CD, devops, etc.
2. Cross team contributions will be more difficult if the tech stacks and code architecture starts to diverge
3. While possible, sharing dependencies between those teams (design system, common librairies) will not scale well with the number of dependencies and frontend applications

## Setup

`homepage` and `blog` folders each contain a simple vanilla Typescript app built with default Vite configuration.

## Demo

1. Open 2 terminal windows to install dependencies and run applications:

2. On first window, run:

```bash
cd ./homepage && pnpm install && pnpm run dev
```

3. On second window, run:

```bash
cd ./blog && pnpm install && pnpm run dev
```

You can access both applications under different domains (represented by different ports in this example)
