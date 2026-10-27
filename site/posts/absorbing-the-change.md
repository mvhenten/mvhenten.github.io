---
title: Absorbing the change
date: "2026-10-27"
---

Looking back at one year of agentic development at STX, I'm starting to arrive at the conclusion that once we were able to reduce the friction of shipping code to production, our new bottleneck is the ability of the business to absorb the change.

Now that we can automate any process, getting stakeholders involved in shaping the automation requires time on their calendar. We no longer need to negotiate the launch date of a new capability because it takes time to build it and we have to trade off features against time.

<!-- more -->

Today we have to negotiate with our customer or the business when they are able to provide us with feedback or absorb the new changes in the product we're about to deliver.

Engineering teams struggle with a similar problem where the product manager as an input aggregator for an engineering team no longer works because engineers can absorb product requirements faster than the product manager can state them.

Meanwhile, the role of product manager as a quality gate and a strategic release coordinator is under a lot of pressure because more features get deployed than a product manager can test and track.

It's not obvious to me where the solution lies. On one hand, we could simply say we need more product managers so that the ratio of engineer to product manager changes, but that just adds another coordination layer that the business didn't ask for.

On the other hand, we could also say engineers need to become more product minded so that they work with the business, gather their own requirements and build entire product ranges autonomously. But this just creates another flow of information between stakeholders and engineers and removes the strategic product thinking from the loop. And instead of a product manager gathering business needs, the business now has to talk to many engineers working on many features at the same time, the product manager still having to coordinate all of them.

In both cases, we increase the number of conversations faster than the features that we deliver. And of course, then we talk about aptitudes and experience. Not everybody has the required level of strategic thinking of a senior product manager. And especially in engineering, not everybody has the same business communication skills and aptitudes for sitting down with stakeholders, understanding the requirements from what they are saying and solving the bigger picture problems instead of responding to immediate business needs.

What seems obvious to me from my observation is that we see people with high agency habits thrive with agentic tooling. A UX designer, for example, who takes the initiative to start building their own tools, may not have an aptitude to understand distributed systems design, but by building the tools that they need to accelerate their workflows, they become an equitable partner to engineering, who may be able to take those tools and bring them into a secure and distributed cloud environment.

A product manager who starts building prototypes to explore ideas, to do user testing and to validate business requirements might not deeply understand security boundaries and technical limitations, but by prototyping and deeply understanding the workflows is able to provide engineering with a much richer definition of the requirements, which then, using agentic tooling, can be distilled down into specs and architecture instead of going through traditional development phases.

In software engineering we have recognized these habits for a long time in roles like staff, product and forward deployed engineers.

High agency is a learnable behavioral habit. It can be stimulated by giving people appropriate autonomy and responsibility, and rewarding initiative. And if we create work environments where this behavior is modeled and rewarded, we can bring up a new generation of technologists and problem solvers that can thrive in tomorrow's technology landscape. High agency people pull in stakeholders when a decision is needed and feel a radical responsibility to own the outcome of their projects, driving business alignment and engagement. The number of conversations only needs to grow where high stakes decisions are needed. A small high agency team is more effective than a large engineering team if a successful outcome depends more heavily on the engagement of our stakeholders instead of the capacity of our engineering team.

So what does that environment look like exactly? I think it is rather simple: remove all friction from trivial and low-risk decisions in the process of building and deploying software. And this starts from engineering first principles: standardize authorization and authentication across the organization, classify your data so you know when the stakes are high, and build self-service mechanisms for elevation of privilege and common activities that require some sort of administrative privilege like deploying Entra apps, Slack and Teams integrations, deployment pipelines and sensitive data access.

These best practices were a good idea from the start, but now that it is actually trivial to build self-service portals and flows, there is no more excuse to require administrator tax on the trivial stuff. Any unnecessary approval queue with a human in the loop teaches people to lean back and defer responsibility. With self-service, compliance to a data access policy becomes a responsibility of the individual, not the admin. In fact, we can harden our security posture while at the same time enabling access, because we can reduce the amount of administrator privileges. After all, we don't want to stop people from accessing information; we need to prevent accidents and grand larceny, and if it happens, we need to constrain the blast radius and know how it happened.

And by establishing engineering golden paths and best practices and building vibe-coding environments, internal MCPs and agent proxies, we eliminate the toil of decision making and alignment from building software in engineering, so we can focus on the bottom line: to create value, faster than ever before.
