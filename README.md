# How to organize and split your frontend applications - showcase of 8 different setups with complete code examples

## A Monorepository

### Why?

This is the default setup I would recommend for most frontend teams. I have covered some of the advantages [here](https://www.simplefrontend.dev/blog/why-a-frontend-monorepo/), the biggest ones between simplification, consistency and easier cross-team contributions through a centralized and opinionated setup.

### Different domains per applications

When your applications are live under distinct domains, for example https://website-home.com and https://website-blog.com, you can use a monorepository to serve your different frontend applications.

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

#### [Example setup](./examples/monorepository/different-domains-per-applications/)

#### Sharing package dependencies

This setup makes it super simple to share local package dependencies between apps, these can be for examples UI modules but not only.

#### Sharing runtime dependencies - See [Why runtime dependencies?](#Why-runtime-dependencies)

This is where [Module Federation](https://module-federation.io/guide/start/index.html) come in handy. The second version of Module Federation is supported by all major bundlers and allows you to share code and resources among multiple JavaScript application at runtime!

#### [Example setup](./examples/monorepository/module-federation/)

### One domain for all applications which are split by URLs

When your applications are live under the same domain but different URLs, for example https://website.com/home and https://website.com/blog, then you will have to use a reverse proxy at some point in your stack to be able to serve the different frontend applications which can be apps in a monorepository.

## When to use ?

When you have very distinct apps in terms of business logic and you want every team to align their development practices to encourage reusability, sharing dependencies and reduce the overall efforts on developer experience and dependencies management.

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

#### [Example setup](./examples/monorepository/reverse-proxy-split/)

## Why runtime dependencies?

Runtime dependencies are much easier to synchronize accross apps as you can simply redeploy them for every apps to have their latest version, eliminating lots of tedious work. Of course that puts increase risks on those app deliveries so a good quality assurance process will be necessary.

The biggest advantage is that you can release hotfixes and new features without having to syncrhonize and redeploy all your applications.

### What's the difference with a script tag loading a remote script that can be updated?

There are 2 main advantages of using module federation:

1. You can declare **shared** packages dependencies between your host and remotes such as framework dependencies (React, Vue etc) to reduce the overall bundle size while allowing the flexibility of framework development.
2. Great developer experience and debuggigng tools. This is where v2 of module federation really shines in my opinion with debugging tools integration such as [Chrome DevTools](https://module-federation.io/guide/basic/chrome-devtool.html)

### Advantages

You will be able to centralize some of your cross cutting concerns such as observability and A/B testing.

## Seperate repositories

### Why?

There are use cases where seperate repositories per applications make sense. The most common ones are:

- Compliance reasons: payment applications to adhere to Payment Card Industry Data Security Standard ([PCI DSS](https://en.wikipedia.org/wiki/Payment_Card_Industry_Data_Security_Standard)) where you need stronger governance and audit trails
- High independance between teams: though there are negative consequences to this, you might want to prefer the trade off of highly siloed independant teams

### Different domains per applications

When your applications are live under distinct domains, for example https://website-home.com and https://website-blog.com, then it is straightforward to use different repositories to serve your different frontend applications.

#### When to use?

When you have very distinct apps in terms of business logic which are managed by a very small number of teams (2 to 3 maximum) and each team has good frontend expertise, this setup makes sense.

#### Consequences

There are 2 main advantages to this setup:

1. Teams will be able to operate in competely autonomy to one another so they are able to choose different tech stacks and release at different paces
2. Hosting and deployment of those different applications is simple as one repository maps to one domain

There are multiple disavantages which can build up over time:

1. Teams will each have to dedicate time to develop and maintain duplicated infrastructure in terms of dependency management, security maitenance, local developer experience, CI/CD, devops, etc.
2. Cross team contributions will be more difficult if the tech stacks and code architecture starts to diverge
3. While possible, sharing dependencies between those teams (design system, common librairies) will not scale well with the number of dependencies and frontend applications

#### [Example setup](./examples/separate-repositories/different-domains-per-applications/)

#### Sharing runtime dependencies - See [Why runtime dependencies?](#Why-runtime-dependencies)

While it is easy (though time-consuming) to share dependencies with published npm packages, what if you want to share runtime dependencies between the two applications?

This is where [Module Federation](https://module-federation.io/guide/start/index.html) come in handy. The second version of Module Federation is supported by all major bundlers and allows you to share code and resources among multiple JavaScript application at runtime!

#### [Example setup](./examples/separate-repositories/module-federation/)

### One domain for all applications which are split by URLs

When your applications are live under the same domain but different URLs, for example https://website.com/home and https://website.com/blog, then you will have to use a reverse proxy at some point in your stack to be able to serve the different frontend applications mapped to different repositories.

#### When to use ?

When you have very distinct apps in terms of business logic which are managed by a very small number of teams (2 to 3 maximum) and each team has good frontend expertise, this setup makes sense.

#### Consequences

There are 2 main advantages to this setup:

1. Teams will be able to operate in competely autonomy to one another so they are able to choose different tech stacks and release at different paces.
2. Hosting and deployment of those different applications is simple as one repository maps to one domain

There are multiple disavantages which can build up over time:

1. Teams will each have to dedicate time to develop and maintain duplicated infrastructure in terms of dependency management, security maitenance, local developer experience, CI/CD, devops, etc.
2. Cross team contributions will be more difficult if the tech stacks and code architecture starts to diverge
3. While possible, sharing dependencies between those teams (design system, common librairies) will not scale well with the number of dependencies

#### [Example setup](./examples/separate-repositories/reverse-proxy-split/)
