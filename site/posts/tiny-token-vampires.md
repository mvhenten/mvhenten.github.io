---
title: The Tale of the Tiny Token Vampires
date: "2026-07-08"
---

Okay, so my Claude code setup is pretty simple. I run Claude in a TMUX and I run a few of them. I've reached a point where I'm comfortable creating a high level project plan using an LLM. And by rigorously reviewing the project plan, removing ambiguity, I trust that when I hand it off to create a set of issues in an epic on GitHub, that it does more or less the right thing. I give it a cursory overview and usually then simply hand it off to a swarm of agents.

Our setup at this point has been working quite well and we have been delivering several greenfield projects with near perfect accuracy. How we do that at this point is a little bit besides the point, but what I want to really remark is that my way of working hasn't changed significantly for a couple of months now, but my token usage went up crazy around the same time that Fable got released.

Obviously, my first thought was, oh gosh, Fable sure is token hungry. And after hitting my limits a few times, I started to become more careful. I optimized my workflow using Fable for routing, brainstorming and supervising the project. Sonnet to create pull requests and Opus to do reviews after merging. I've created small skills that use Haiku for dumb work to avoid spending tokens on Opus for running things like logging into Jira or GitHub. So at this point, I was expecting my token usage to go down as I've actually invested and optimized my workflow to reduce the usage, the consumption.

So Monday afternoon I started a new build of two projects, straightforward, cookie cutter, done it before, seen it before, end to end, including testing infrastructure and validation steps. Since the two projects did not overlap in the codebase, I could run them in parallel while dedicating the rest of my brain to research and writing. As usual, I let them run at night when the deployment lanes were clear and I can let them run without interfering with my team's work.

By Tuesday around noon I had exhausted all of my limits. Not only had I exhausted my hourly limits, I had exhausted my token budget for the entire week and I was out of tokens until Friday. Buing extra tokens was pooring drops into the ocean, so I switched to another subscription only to exhaust my tokens in a matter of hours again. Because the build had been getting interrupted by limit prompts and sometimes even broke down because of the limits the build had been installing, I had been doing rework and investigation and spent a lot of time catching up on what was going on.

At this point I think I was suffering from a little bit of a belief crisis. What had Anthropic done? Why am I losing my tokens like this? How can I get back to becoming efficient and productive again? And what else can I do to optimize my token use? I spend a lot of time reading and researching just to conclude I was already best boy in class: A minimalist, hand curated claude.md, small concise useful skills that automate repetitive work, agents with smaller models for the appropriate job, clear project plans and complete, unambiguous prompting.

After buying tokens, getting back to work, and avoiding Fable like the plague (even using sonnet as the main driver) something struck me as I came back from a break, reading claude having a little chat with himself:

```
● Agent "Fix issue #185 session routing" finished · 1h 40m 7s

● Nothing new — that's the same final report already relayed. PR #186 stands ready to merge.

✻ Baked for 7s

● Agent "Fix issue #185 session routing" finished · 1h 41m 12s

● Stale cleanup ping only — all done, PR #186 awaits merge.

✻ Crunched for 6s

● Agent "Fix issue #185 session routing" finished · 1h 43m 44s

● Same stale ping — nothing to act on.

✻ Cooked for 4s

● Agent "Fix issue #185 session routing" finished · 1h 45m 22s

● Stale ping again — done, nothing pending.

✻ Crunched for 5s
```

Agent pings, spaced at around a minute from each other. And Claude commenting on them with a little bit of variety every time. And I realized I never applied Occam's Razor. I looked at the things that I could do and I could change rather than accepting the fact that if I hadn't changed my behavior, something else had. These Agent pings are something new or maybe they've been there all along. But with the higher token usage from Fable, they've suddenly become a lot more expensive.

Replying to the ping doesn't cost that much tokens, although it's annoying, the CAVEAT here is that each ping causes a reread of the entire session... and _reading cost a lot of tokens_. Claude had been sitting around for hours, quietly sapping off my lifeblood for no reason.

At this point I don't know if this is a design flaw in ClaudeCode or simply me not using the tool correctly. But I think this is a real foot gun. And since then I've gone on nuclear on any notification or polling loops: From now on it's little haiku sitting in a sub-task only to report back when something is finished. I can already see that it's a lot more quiet than the regular claude and hopefully it's going to reduce the token burn, so I can go back to using Fable to do some real work again...
