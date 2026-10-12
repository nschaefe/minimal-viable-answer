# p20_open_ended


═══════════════════════════════════════════════════════════════

## 📝 PROMPT

═══════════════════════════════════════════════════════════════


> I inherited a legacy codebase with no tests, 200k lines, and I need to add a new feature next week without breaking anything. What is your plan?




═══════════════════════════════════════════════════════════════

## 🔹 MODE: DEFAULT

═══════════════════════════════════════════════════════════════


_latency=9388ms · in=42 · out=561 · chars=2460_


<br>

This is a common and genuinely difficult situation. Here's an honest, practical plan:

## Immediate Assessment (Day 1)

**Understand what you're working with**
- Run the code and verify it actually works currently
- Identify which modules are touched by your new feature
- Check if there's ANY existing documentation, even comments
- Ask: does anyone who wrote this still exist and can you reach them?

## Before Writing a Single Line of Feature Code

**Add characterization tests to the specific area you're touching**
```python
# You're not testing what it SHOULD do
# You're recording what it ACTUALLY does right now
def test_current_behavior():
    result = legacy_function(known_input)
    assert result == actual_observed_output  # even if the output seems wrong
```

This gives you a regression safety net for YOUR specific change area.

**Do NOT attempt to test the whole 200k lines.** That's a trap that will consume your week.

## Scoping Your Risk

Ask honestly:
- Is your feature isolated or deeply coupled?
- Can you add it without modifying existing code? (extension vs modification)
- What's the blast radius if something breaks?

## The Actual Feature Work

**Prefer adding over modifying**
- New files, new functions called from minimal touch points
- One clear integration point rather than scattered changes
- Feature flags if the environment supports them

**Keep changes small and reviewable**
- Smaller diffs mean easier debugging when something goes wrong
- Commit working states frequently

## Deployment Safety

- Deploy to staging first, obviously
- Have a rollback plan before you deploy
- Monitor after deployment - don't just ship and leave

## What I'd Warn Against

| Temptation | Why it's dangerous |
|---|---|
| Refactoring while adding features | Doubles your risk surface |
| Adding comprehensive tests before your deadline | Admirable but not realistic in one week |
| Assuming you understand the code after reading it | Legacy code has hidden dependencies |
| Skipping manual testing because you wrote unit tests | Do both |

## Honest Prioritization

Your goal this week is **one working feature without regressions**, not a clean codebase. Those are different problems requiring different timelines.

The codebase situation needs a longer conversation with your team about technical debt - but that's week 2+.

What does the feature touch? I can give more specific advice based on the actual coupling you're dealing with.


<br><br>




═══════════════════════════════════════════════════════════════

## 🔹 MODE: CAVEMAN

═══════════════════════════════════════════════════════════════


_latency=7283ms · in=1138 · out=436 · chars=1610_


<br>

**Map before you touch.**

---

**Day 1 – Orient**

1. Find the seam nearest your feature. Grep call sites, trace data flow, draw a 1-page dependency sketch.
2. Identify the 5–10 functions your change must touch.
3. Note any global state, singletons, or shared mutable structs in that path.

**Day 1–2 – Characterization tests**

Write tests that *describe current behavior*, not desired behavior. They are allowed to document bugs.

- One happy-path integration test per entry point you'll touch.
- One test per edge case you can see in the existing code.
- Goal: if you break something, a test fails. Not: prove the code is correct.

Tools: record real I/O if possible (golden files, snapshot tests, VCR-style HTTP mocks).

**Day 2–3 – Build a seam**

Introduce the new feature behind an interface or flag, not inline. Keep the old path untouched and reachable. The new path is additive until it's proven.

**Day 3–4 – Implement, narrow scope**

- Smallest possible diff that delivers the feature.
- No refactoring during implementation. Log refactor ideas; do them after.
- Run characterization tests after every meaningful commit.

**Day 5 – Verify and ship**

- Diff review: touch count should match your Day 1 map. Surprises mean something was missed.
- Manual smoke test of the old path. Confirm it still works end-to-end.
- Feature flag off by default if production risk is high.

---

**Ongoing rules**

- Leave characterization tests in the repo. Next person needs them.
- Never refactor and add a feature in the same commit.
- When a test fails and you're not sure why: revert, understand, re-apply.


<br><br>




═══════════════════════════════════════════════════════════════

## 🔹 MODE: MVA

═══════════════════════════════════════════════════════════════


_latency=3552ms · in=772 · out=186 · chars=750_


<br>

**Characterize before you touch anything.**

1. **Map the blast radius** – find every file likely touched by your feature. Use `grep`/`rg` aggressively. Note entry points, data models, and outputs.

2. **Add characterization tests now** – capture current behavior (even if wrong) on the code paths you'll modify. Approval/snapshot tests are fine. These are your safety net, not permanent tests.

3. **Spike the feature in isolation** – implement in the smallest possible unit, separate from legacy wiring.

4. **Strangle in** – connect your new code to legacy at one seam at a time, re-running characterization tests after each connection.

5. **Manual smoke test the happy path** before and after.

What's the feature? I can make this more specific.


<br><br>
