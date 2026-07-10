---
title: The Tiny Token Suckers (part two)
date: "2026-07-10"
---

While researching the little tiny token suckers that sapped my tokens after switching to Fable — even though I was doing all the best practices — I did a lot of research into how to optimize token usage without having it destroy or debilitate my workflow.

And since the research I did all came from blog posts and other people's writing, I think it's only fair if I summarize what worked for me. I am not saying that my way of working is the way of working everybody should be using. I'm just describing what works for me and maybe it will benefit others.

<!-- more -->

![A Highland midge (Culicoides impunctatus) feeding](/posts/images/biting-midge.jpg)

_The Highland midge, nature's own tiny token sucker. ["Biting Midge on my leg"](https://commons.wikimedia.org/wiki/File:Biting_Midge_on_my_leg.jpg) by Dunpharlain, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0), via Wikimedia Commons._

## 1. Token compression and reduction

Step one in optimizing tokens was researching how I can actually reduce my token usage. I reviewed things like [Graphify](https://github.com/Graphify-Labs/graphify), [Headroom](https://github.com/headroomlabs-ai/headroom), and [tokensave.dev](https://tokensave.dev/) but I find them too intrusive. These tools run local proxies and index codebases, effectively creating a token optimization pipeline.

I work on more than one code base at a time and I work on more than one machine at a time. Anything that involves more than trivial setup or preparation before the work feels like it's getting in my way. I think this is still a leftover from when I joined [C9.io](https://en.wikipedia.org/wiki/Cloud9_IDE) and we started to develop Workspace first. I am still a firm believer in a fully reproducible development environment that should start up within seconds.

I settled on [rtk](https://github.com/rtk-ai/rtk) - the least intrusive and a drop-in solution into your settings.json: `rtk hook claude`.

The one argument that people have been throwing my way against rtk is that it might mangle outputs without providing a fallback. I believe this to be not true. The engineering behind rtk is very solid. It has defined a narrow scope of what it does and it aligns with my [shift left philosophy](/posts/radical-shift-left/) of creating small tools that do one thing well. It's a classical Unix tool in that sense.

## 2. Fixing the leaky faucet

Now, the second thing I did is actually quite interesting: fixing the leaky faucet. In my [vampire rant](/posts/tiny-token-vampires/), I alluded to sub-agent pings polluting and re-reading the cache repeatedly. I believe this was the root cause and this is what I made sure to stop immediately. Ironically enough, Fable was able to pinpoint the issue almost exactly and propose an elegant fix.

Subagents frequently stop and wait on their tasks. Sometimes they even stop midway or halfway because they encounter something where they expect input. And every one of those pings causes the main session to reread the full context. If that main session happened to be running Fable — which is something I love doing, because Fable will make judgment calls and decide on the right next steps without too much guidance — that is actually costing a lot of tokens. So I introduced a simple hook that does something similar to ["ralphing"](https://ghuntley.com/ralph/):

When a subagent tries to stop, this hook peeks at its last message. If that message sounds like "I'll wait / report back when it's done / check back later," the hook blocks the stop and shoves a correction back at it: don't wait — poll it yourself in the foreground, finish the whole thing, and stop only once with the real result.

The hook is embarrassingly simple and stupid. It just uses dumb heuristics. It's only a few lines of bash. But it's been surprisingly effective at not only keeping my main thread silent and reducing noise, but also reducing my token burn significantly.

Maybe I'm reinventing the wheel here. Maybe there are things that I don't know about that I could have just used instead. But I thought this was such an elegant and simple fix that I want to publish it here:

```bash
#!/usr/bin/env bash
# SubagentStop hook: block a subagent from stopping when its final message says
# it is waiting on a background run. Every such stop wakes the main session with
# a full-context roundtrip for nothing. Exit 2 feeds stderr back to the subagent
# as a correction; stop_hook_active guards against blocking the same stop twice.
set -euo pipefail
input=$(cat)
[ "$(jq -r '.stop_hook_active // false' <<<"$input")" = "true" ] && exit 0
tp=$(jq -r '.transcript_path // empty' <<<"$input")
[ -n "$tp" ] && [ -f "$tp" ] || exit 0
last=$(jq -rs '[.[] | select(.type? == "assistant") | .message.content[]? | select(.type? == "text") | .text] | last // ""' "$tp" 2>/dev/null || true)
[ -n "$last" ] || exit 0
if grep -qiE 'wait(ing)? (for|on|until)|report back (when|once|after)|resume (automatically|when notified)|check back|no further action needed from me|until .* (completes|finishes)' <<<"$last"; then
  echo "Do not stop to wait. Poll the run to completion inside this context (foreground commands with generous timeouts), finish the entire task, and stop exactly once with the final result." >&2
  exit 2
fi
exit 0
```

## 3. Closing the loop with a babysitter

Now that I realized and learned that any polling loop wastes tokens and can drain my quota, I understood that one of the patterns I've been doing all along could be optimized trivially. I frequently ask Claude to babysit my pull request or my pipeline, to detect issues quickly and keep the flow going. On a pull request it's often incoming Copilot comments or failing tests that I expect the agents to simply pick up by themselves.

There's no value in me monitoring CI if an agent can do it. And on deployments, I want to be notified immediately if something breaks or blocks my pipelines, which is something that Claude is excellent at. But you don't actually need an intelligent LLM to simply spot the trouble, if it can escalate to a more intelligent agent.

The funny thing is that "babysitting the pipeline" is such AWS jargon that the first time I mentioned it to Claude, it exhibited exactly the right behavior immediately — and I've been using it ever since. In a sense I had become lazy. Why create a skill if it's a natural emergent behavior of the LLM that you can leverage by simply using the right words?

But by codifying it as a skill, I can actually be more explicit about what type of model should be used and what type of behavior I expect. And this also turned out to be a huge optimizer. I should have known this. I know this and I've written many skills before, but I guess I just got lazy here. The [skill](https://gist.github.com/mvhenten/498681f5296b883b75bc3b2edb05bd15) is 100% LLM generated, but it's actually doing the job quite well here.

## 4. Wrapping it up

As with all software development best practices, it's important to continue sharpening your tools. Over the past couple of months we learned that as the models get smarter, we should reduce the amount of explaining — or mansplaining — that we do, and we should curate what we feed them to maintain a clean and sharp context. The simple best practices apply: keep your CLAUDE.md minimal and separate global and local tiers. The CLAUDE.md that goes into my repositories is at most three sentences long, saying the things that Claude can't see or that are invisible from the code base. The CLAUDE.md that goes into my home directory is short and minimal, focusing on the behavioral aspects and rules that I want Claude to follow day by day. Whenever I see Claude thrashing or spending multiple iterations on accomplishing a task, I will ask him what we have learned and how we could leverage and codify this into a skill or a script. One of the most important instructions that I've given Claude as a standing order is to become a tool builder. Whenever it finds something that is repetitive for the project at hand, it will commit tiny little scripts and tools for itself to be using instead of creating inline scripts that it is throwing away every time.

The tiny but significant discovery I also made is that you can tell Claude to split your CLAUDE.md for agents and main threads. In retrospect, it's obvious that rules for subagents should be different from the rules of the main intelligence that is orchestrating. And this too reduced a bunch of friction points that I was seeing before:

```markdown
"Everyone" applies to every Claude. "Main session" applies ONLY to the top-level user-facing session — background/sub-agents must ignore it and follow "Agents" plus their brief.
```

_Yes, it's just that: telling it how to read the doc upfront..._

I'm including a small snippet of my settings.json here as a reference in case you're interested. It's really surprisingly minimal and effective at the same time:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "rtk hook claude"
          }
        ]
      }
    ],
    "SubagentStop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash ~/.claude/hooks/subagent-no-wait.sh"
          }
        ]
      }
    ]
  }
}
```
