# p05_git_amend_pushed


═══════════════════════════════════════════════════════════════

## 📝 PROMPT

═══════════════════════════════════════════════════════════════


> I just did `git commit --amend` on a pushed commit. How do I recover?




═══════════════════════════════════════════════════════════════

## 🔹 MODE: DEFAULT

═══════════════════════════════════════════════════════════════


_latency=6247ms · in=27 · out=379 · chars=1359_


<br>

## Recovering from `git commit --amend` on a Pushed Commit

You have a few options depending on your situation.

---

### Option 1: Force Push the Amended Commit (if you intended the amend)

```bash
git push --force-with-lease origin your-branch
```

> **`--force-with-lease`** is safer than `--force` — it will fail if someone else pushed to the branch since your last fetch, preventing you from overwriting their work.

---

### Option 2: Undo the Amend (restore the original commit)

If you want to **revert the amend itself**, use the reflog:

```bash
git reflog
```

Find the commit hash **before** the amend (it will show something like `HEAD@{1}: commit: your original message`), then:

```bash
git reset --hard HEAD@{1}
```

Then push normally (no force needed since you're back to the original commit).

---

### Which should you choose?

| Situation | Solution |
|---|---|
| You **meant** to amend, just need to push | `push --force-with-lease` |
| You **didn't mean** to amend | `reset --hard HEAD@{1}`, then normal push |
| **Others have pulled** the original commit | Coordinate with them — force pushing will cause problems |

---

### ⚠️ Warning

If teammates have already based work on the original commit, force pushing will cause **diverged history** for them. They'll need to run:

```bash
git fetch origin
git rebase origin/your-branch
```


<br><br>




═══════════════════════════════════════════════════════════════

## 🔹 MODE: CAVEMAN

═══════════════════════════════════════════════════════════════


_latency=2344ms · in=1123 · out=106 · chars=383_


<br>

Force-push is the fix—but first confirm nobody else pulled.

```bash
git push --force-with-lease origin <branch>
```

`--force-with-lease` fails if someone else pushed since you last fetched. Safer than `--force`.

**If others already pulled:**
Tell them to run:
```bash
git fetch origin
git reset --hard origin/<branch>
```
They lose any local commits on that branch not yet pushed.


<br><br>




═══════════════════════════════════════════════════════════════

## 🔹 MODE: MVA

═══════════════════════════════════════════════════════════════


_latency=827ms · in=757 · out=13 · chars=29_


<br>

`git push --force-with-lease`


<br><br>
