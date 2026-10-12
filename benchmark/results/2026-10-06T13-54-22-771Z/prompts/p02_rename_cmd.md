# p02_rename_cmd


═══════════════════════════════════════════════════════════════

## 📝 PROMPT

═══════════════════════════════════════════════════════════════


> How do I rename a function across my whole repo from the terminal?




═══════════════════════════════════════════════════════════════

## 🔹 MODE: DEFAULT

═══════════════════════════════════════════════════════════════


_latency=4599ms · in=21 · out=455 · chars=1339_


<br>

## Renaming a Function Across a Repo

The most common approaches:

### Using `sed` (simple find & replace)
```bash
# Dry run first (see what would change)
grep -r "oldFunctionName" --include="*.js" .

# Replace in all files
sed -i 's/oldFunctionName/newFunctionName/g' $(grep -rl "oldFunctionName" .)
```

> **Note:** On **macOS**, `sed -i` requires an empty string argument:
> ```bash
> sed -i '' 's/oldFunctionName/newFunctionName/g' $(grep -rl "oldFunctionName" .)
> ```

---

### Using `find` + `sed` (more control)
```bash
# Target specific file types
find . -name "*.js" -exec sed -i 's/oldFunctionName/newFunctionName/g' {} +
```

---

### Using `ripgrep` + `sed` (fastest, recommended)
```bash
# Install ripgrep if needed: brew install ripgrep
rg -l "oldFunctionName" | xargs sed -i 's/oldFunctionName/newFunctionName/g'
```

---

### Tips

| Tip | Command |
|-----|---------|
| Preview changes first | `grep -r "oldFunctionName" .` |
| Exclude directories | `find . -not -path "./node_modules/*"` |
| Whole word only | Use `\boldFunctionName\b` in the pattern |
| Case-insensitive | Add `I` flag: `s/old/new/gI` |

---

### After renaming
```bash
# Verify no old references remain
grep -r "oldFunctionName" .
```

**Always commit or stash your changes before doing a bulk rename** so you can easily revert if something goes wrong.


<br><br>




═══════════════════════════════════════════════════════════════

## 🔹 MODE: CAVEMAN

═══════════════════════════════════════════════════════════════


_latency=2975ms · in=1117 · out=236 · chars=582_


<br>

Use `grep` to find, `sed` to replace.

```bash
# Dry run — check matches first
grep -rn "old_name" .

# Replace in-place (GNU sed)
grep -rl "old_name" . | xargs sed -i 's/old_name/new_name/g'

# macOS sed needs empty string after -i
grep -rl "old_name" . | xargs sed -i '' 's/old_name/new_name/g'
```

Or use `git` tooling if in a repo:

```bash
git grep -l "old_name" | xargs sed -i 's/old_name/new_name/g'
```

Exclude dirs:

```bash
grep -rl "old_name" . --exclude-dir={node_modules,.git,dist} | xargs sed -i 's/old_name/new_name/g'
```

After: `git diff` to verify, then commit.


<br><br>




═══════════════════════════════════════════════════════════════

## 🔹 MODE: MVA

═══════════════════════════════════════════════════════════════


_latency=1149ms · in=751 · out=47 · chars=100_


<br>

`grep -rl 'oldName' . | xargs sed -i '' 's/oldName/newName/g'`

(Drop the `''` after `-i` on Linux.)


<br><br>
