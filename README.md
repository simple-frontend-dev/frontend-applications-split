# How to organize and split your frontend applications - showcase of 8 different setups with complete code examples

## 1.Monorepository

### Why?

This is the default setup I would recommend for most frontend teams. I have covered some of the advantages [here](https://www.simplefrontend.dev/blog/why-a-frontend-monorepo/), the biggest ones being simplification, consistency and easier cross-team contributions through a centralized and opinionated setup.

### 1.1 Different domain per application

When your applications are live under different domains, for example https://website-home.com and https://website-blog.com, you can still use a monorepository to serve your different frontend applications.

#### When to use?

You have distinct apps serving different purposes and you want different applications and/or teams to align and share their development setup and practices to encourage reusability and reduce overall efforts on developer experience and dependencies management.

#### Consequences of this setup:

Pros:

1. Streamlined development with shared opininated configurations (Typescript, formatting, linting etc.) that allow developers to focus on delivering business value.
1. You no longer have to synchronize shared dependencies releases and updates accross many scattered repositories.
1. Cross team contributions are much easier.
1. One (possibly virtual) team can focus on operational work (dependency management, security maitenance, local developer experience, CI/CD, devops, etc.), and all teams will benefit from it.

Cons:

1. You have to invest in the initial setup for example to setup monorepository tooling.
1. You have to invest into a collaboration model and a proper code architecture for the monorepository (which is a benefit in disguise).

#### [Example setup](./examples/monorepository/different-domain-per-application)

#### Sharing package dependencies

With this setup, it is simple and easy to share local package dependencies between apps such as UI modules or a horizontal enablement integration like analytics as they are linked locally.

#### Sharing runtime dependencies - See [Why runtime dependencies?](#Why-runtime-dependencies)

This is where [Module Federation](https://module-federation.io/guide/start/index.html) come in handy. The second version of Module Federation is supported by all major bundlers and allows you to share code and resources among multiple JavaScript application at runtime without the need to package them.

#### [Example setup](./examples/monorepository/different-domain-per-application-module-federation/)

### 1.2 Different url per application under the same domain

When your applications are live under the same domain but at different URLs, for example https://website.com/home and https://website.com/blog, then you will have to use a reverse proxy at some point in your stack to be able to route the traffic to your different frontend applications. You can still use a monorepository to serve your different frontend applications.

#### When to use ?

You have distinct apps serving different purposes and you want different applications and/or teams to align and share their development setup and practices to encourage reusability and reduce overall efforts on developer experience and dependencies management.

#### Consequences of this setup:

Pros:

1. Streamlined development with shared opininated configurations (Typescript, formatting, linting etc.) that allow developers to focus on delivering business value.
1. You no longer have to synchronize shared dependencies releases and updates accross many scattered repositories.
1. Cross team contributions are much easier.
1. One (possibly virtual) team can focus on operational work (dependency management, security maitenance, local developer experience, CI/CD, devops, etc.), and all teams will benefit from it.

Cons:

1. You have to invest in the initial setup for example to setup monorepository tooling.
1. You have to invest into a collaboration model and a proper code architecture for the monorepository (which is a benefit in disguise).

#### [Example setup](./examples/monorepository/different-url-per-application/)

#### Sharing package dependencies

With this setup, it is simple and easy to share local package dependencies between apps such as UI modules or a horizontal enablement integration like analytics as they are linked locally.

#### Sharing runtime dependencies - See [Why runtime dependencies?](#Why-runtime-dependencies)

This is where [Module Federation](https://module-federation.io/guide/start/index.html) come in handy. The second version of Module Federation is supported by all major bundlers and allows you to share code and resources among multiple JavaScript application at runtime.

#### [Example setup](./examples/monorepository/different-url-per-application-module-federation/)

## 2. Seperate repositories

### Why?

There are use cases where seperate repositories per applications make sense. The most common ones are:

- Compliance reasons: payment applications to adhere to Payment Card Industry Data Security Standard ([PCI DSS](https://en.wikipedia.org/wiki/Payment_Card_Industry_Data_Security_Standard)) where you need stronger governance and audit trails.
- High independence between teams: though there are negative consequences to this, you might want to prefer the trade offs of highly siloed, independent teams.

### 2.1 Different domain per application

When your applications are live under different domains, for example https://website-home.com and https://website-blog.com, then it is straightforward to use different repositories to serve your different frontend applications.

#### When to use?

You have distinct apps serving different purposes which are managed by different large teams with good frontend expertise in each and you do not want them to share the same infrastructure.

#### Consequences of this setup:

Pros:

1. Teams will be able to operate in competely autonomy so they are able to choose different tech stacks and release at different paces.
1. Hosting and deployment of those different applications is simple as one repository maps to one domain.

Cons:

1. Teams will each have to dedicate time to develop and maintain duplicated infrastructure in terms of dependency management, security maitenance, local developer experience, CI/CD, devops, etc.
1. Cross team contributions will be more difficult if the tech stacks and code architecture start to diverge.
1. While possible, sharing dependencies between those teams (design system, common librairies) will not scale well with the number of dependencies and frontend applications.

#### [Example setup](./examples/separate-repositories/different-domain-per-application/)

#### Sharing package dependencies

With this setup, it is time consuming to share package dependencies between apps such as UI modules or a horizontal enablement integration like analytics as you need to publish and update them in each repository.

#### Sharing runtime dependencies - See [Why runtime dependencies?](#Why-runtime-dependencies)

This is where [Module Federation](https://module-federation.io/guide/start/index.html) come in handy. The second version of Module Federation is supported by all major bundlers and allows you to share code and resources among multiple JavaScript application at runtime without the need to package and update them in all your repositories. This is even more powerful in a multiple repositories setup as it completely remove the need to update these dependencies manually in all your repositories.

#### [Example setup](./examples/separate-repositories/different-domain-per-application-module-federation/)

### 2.2 Different url per application under the same domain

When your applications are live under the same domain but different URLs, for example https://website.com/home and https://website.com/blog, then you will have to use a reverse proxy at some point in your stack to be able to serve the different frontend applications mapped to different repositories.

#### When to use ?

You have distinct apps serving different purposes which are managed by different large teams with good frontend expertise in each and you do not want them to share the same infrastructure.

#### Consequences of this setup:

Pros:

1. Teams will be able to operate in competely autonomy so they are able to choose different tech stacks and release at different paces.
1. Hosting and deployment of those different applications is simple as one repository maps to an URL subpath mapped to your reverse proxy.

Cons:

1. Teams will each have to dedicate time to develop and maintain duplicated infrastructure in terms of dependency management, security maitenance, local developer experience, CI/CD, devops, etc.
1. Cross team contributions will be more difficult if the tech stacks and code architecture start to diverge.
1. While possible, sharing dependencies between those teams (design system, common librairies) will not scale well with the number of dependencies and frontend applications.

#### [Example setup](./examples/separate-repositories/different-url-per-application/)

#### Sharing package dependencies

With this setup, it is time consuming to share package dependencies between apps such as UI modules or a horizontal enablement integration like analytics as you need to publish and update them in each repository.

#### Sharing runtime dependencies - See [Why runtime dependencies?](#Why-runtime-dependencies)

This is where [Module Federation](https://module-federation.io/guide/start/index.html) come in handy. The second version of Module Federation is supported by all major bundlers and allows you to share code and resources among multiple JavaScript application at runtime without the need to package and update them in all your repositories. This is even more powerful in a multiple repositories setup as it completely remove the need to update these dependencies manually in all your repositories.

#### [Example setup](./examples/separate-repositories/different-url-per-application-module-federation/)

## Why runtime dependencies?

Runtime dependencies are much easier to synchronize accross apps as you can simply redeploy them for every apps to have their latest version, eliminating lots of tedious work. Of course that puts increase risks on those app deliveries so a good quality assurance process is necessary.

The biggest advantage is that you can release hotfixes and new features for these dependencies without having to synchronize and redeploy all your applications.

Common use case include sharing global UI componments like a header or footer as well as horizontal enablement such as analytics, A/B testing or observability.

### What's the difference with a script tag loading a remote script that can be updated?

There are 2 main advantages of using module federation:

1. You can declare **shared** packages dependencies between your host and remotes such as framework dependencies (React, Vue etc) to reduce the overall bundle size while allowing the flexibility of framework development.
2. Great developer experience and debuggigng tools. This is where v2 of module federation really shines in my opinion with debugging tools integration such as [Chrome DevTools](https://module-federation.io/guide/basic/chrome-devtool.html)
