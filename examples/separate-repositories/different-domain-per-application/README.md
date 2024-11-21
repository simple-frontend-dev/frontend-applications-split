# Separate Repositories

## Distinct domains per applications

When your applications are live under distinct domains, for example https://website-home.com and https://website-blog.com, then it is straightforward to use different repositories to serve your different frontend applications.

Here we have 2 folders `homepage` and `blog` which you can see as 2 different repositories you can host and deploy completely independently.

## When to use?

You have distinct apps serving different purposes which are managed by different large teams with good frontend expertise in each and you do not want them to share the same infrastructure.

## Consequences

Pros:

1. Teams will be able to operate in competely autonomy so they are able to choose different tech stacks and release at different paces.
1. Hosting and deployment of those different applications is simple as one repository maps to one domain.

Cons:

1. Teams will each have to dedicate time to develop and maintain duplicated infrastructure in terms of dependency management, security maitenance, local developer experience, CI/CD, devops, etc.
1. Cross team contributions will be more difficult if the tech stacks and code architecture start to diverge.
1. While possible, sharing dependencies between those teams (design system, common librairies) will not scale well with the number of dependencies and frontend applications.

## Setup

`homepage` and `blog` folders each contain a simple Typescript app built with Vite.

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
