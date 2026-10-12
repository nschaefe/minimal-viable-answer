# MVA — Minimum Viable Answer

Reply = smallest info packet that unblocks your next step. Not comprehensive, not educational, not defensive. Just enough.

## Motivation

You have a goal. To reach it you need some information and exploration — but the priority is the goal, and you want to move fast. You don't want a lesson on something that isn't currently important to reaching that goal.

Daily work and research with agents need clear signal, less noise. MVA strips the tutorial, the menu of alternatives, and the "want me to also..." so the answer is the first thing you read.

## Benchmark

Averaged across 20 prompts (bugs, concept questions, commands, architecture, ambiguous asks) on `claude-sonnet-4-5`:

| mode    | avg latency | avg out tokens | avg chars | total out tokens (20 prompts) |
|---------|-------------|----------------|-----------|-------------------------------|
| default | 7074 ms     | 605            | 2038      | 12097                         |
| [caveman](https://github.com/juliusbrussee/caveman) | 4243 ms     | 251            | 861       | 5028                          |
| **mva** | **1914 ms** | **84**         | **280**   | **1671**                      |

MVA = **7.2× fewer output tokens** and **3.7× faster** than default across the full suite. Full report: [`benchmark/results/2026-10-06T13-54-22-771Z/report.md`](benchmark/results/2026-10-06T13-54-22-771Z/report.md).

Cut: preamble, context you already have, alternatives you didn't ask for, caveats that don't change the action, "want me to also...". Keep: the direct answer, facts you need to act on, caveats that *do* change the action.

Default posture: under-answer, not over. First sentence = answer. One approach, not a menu. Expand only on demand.

See [`SKILL.md`](SKILL.md) for the full spec.

## Example

Prompt: *Explain JavaScript closures. I know functions and scope but closures confuse me.*

**Default mode** (954 output tokens, 3332 chars — truncated):

> # JavaScript Closures
>
> ## The Core Idea
>
> A closure is when **a function remembers variables from its outer scope, even after that outer scope has finished executing.**
>
> ---
>
> ## Start With the Problem
>
> ```javascript
> function makeGreeting() {
>   const name = "Alice";  // This variable lives here
> }
>
> makeGreeting();
> // name is gone now... right?
> ```
>
> Normally yes — but closures change this.
>
> *[…9 more sections: basic example, backpack diagram, counter example, independent-copies example, var/let loop gotcha, mental model, key-takeaways table…]*

**MVA mode** (150 output tokens, 573 chars — full reply):

> A closure is a function that **remembers the variables from where it was defined**, even after that outer function has returned.
>
> ```js
> function makeCounter() {
>   let count = 0;
>   return function() {
>     count++;
>     return count;
>   };
> }
>
> const counter = makeCounter();
> counter(); // 1
> counter(); // 2
> ```
>
> `makeCounter` finished running, but `count` didn't disappear—the inner function still holds a reference to it. That reference is the closure.
>
> **Why it matters:** each call to `makeCounter()` creates a *separate* `count`. The inner function closes over its own copy.

Full three-mode comparison: [`benchmark/results/2026-10-06T13-54-22-771Z/prompts/p06_explain_closures.md`](benchmark/results/2026-10-06T13-54-22-771Z/prompts/p06_explain_closures.md).

## Install

Clone or copy this directory to wherever your agent loads skills from. For Claude Code the conventional path is `~/.claude/skills/mva/`:

```bash
mkdir -p ~/.claude/skills
cp -r ~/SAPDevelop/skills/mva ~/.claude/skills/mva
```

Then pick one activation mode below.

### Option 1 — Always on (Claude Code SessionStart hook)

Loads MVA at the start of every session. Add to `~/.claude/settings.json`:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "echo 'MVA MODE ACTIVE'; cat ~/.claude/skills/mva/SKILL.md"
          }
        ]
      }
    ]
  }
}
```

The hook prints the skill body into the session's system reminders so MVA is active from turn 1. Turn off per-session with `stop mva` / `normal mode`.

### Option 2 — Per session

Invoke on demand:

- `/mva` (slash command, if the skill is registered in your skills list)
- Or just type `mva` / `minimum viable answer` / `stop talking so much` — the skill's description triggers it.

### Option 3 — Global/always-loaded (not really a thing)

There's no built-in "load this skill for every tool everywhere" switch. The SessionStart hook above is the closest for Claude Code. For other agents (Copilot, Cursor, Cline, Aider, etc.) you'll need their own mechanism — custom instructions, system prompt, rules file, whatever each tool exposes. Paste the body of `SKILL.md` into that slot.

## Turn off

Say `stop mva` or `normal mode` mid-session. To disable permanently, remove the hook block from `settings.json`.
