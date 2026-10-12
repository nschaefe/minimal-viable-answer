# p16_debug_mystery


═══════════════════════════════════════════════════════════════

## 📝 PROMPT

═══════════════════════════════════════════════════════════════


> My cron job runs fine when I invoke the script manually but silently does nothing when cron runs it. Where do I even start?




═══════════════════════════════════════════════════════════════

## 🔹 MODE: DEFAULT

═══════════════════════════════════════════════════════════════


_latency=9404ms · in=36 · out=753 · chars=2399_


<br>

This is one of the most common and frustrating sysadmin problems. The core issue is almost always **environment differences** between your interactive shell and cron's minimal environment.

## Start Here: Capture Output

First, make cron actually tell you what's happening:

```bash
# In your crontab (crontab -e)
* * * * * /path/to/script.sh > /tmp/cron_output.log 2>&1
```

The `2>&1` captures stderr too. Check that file after it runs.

## Most Common Causes

**PATH is different**
```bash
# Cron's PATH is typically just:
/usr/bin:/bin

# Your interactive PATH might be:
/usr/local/bin:/usr/bin:/bin:/home/you/.local/bin  # etc.
```
Fix by using absolute paths in your script, or set PATH explicitly at the top:
```bash
#!/bin/bash
PATH=/usr/local/bin:/usr/bin:/bin
```

**Missing environment variables**
- `HOME`, `USER`, `DISPLAY`, and others may not be set
- Any env vars you set in `.bashrc`/`.bash_profile` won't exist

**Working directory**
- Cron doesn't run from your home directory
- Use absolute paths for all files

**Script isn't executable**
```bash
chmod +x /path/to/script.sh
```

## Systematic Debugging

**Simulate what cron sees:**
```bash
# Run a shell with cron's environment
env -i HOME=/root SHELL=/bin/sh /bin/sh
# Now try running your script here
```

**Log the environment cron actually uses:**
```bash
* * * * * env > /tmp/cron_env.log 2>&1
```
Compare it to what `env` shows in your interactive session.

**Add debugging inside the script:**
```bash
#!/bin/bash
set -x          # print each command before running
exec >> /tmp/debug.log 2>&1   # log everything
```

## Other Things to Check

| Problem | What to look for |
|---|---|
| Wrong user | Whose crontab? (`crontab -u username -l`) |
| Percent signs | `%` in crontab is a newline - escape as `\%` |
| File locking | Script already running, fails silently |
| SELinux/AppArmor | Check `/var/log/audit/audit.log` |
| Syntax error in crontab | Check `/var/log/syslog` or `journalctl` for cron daemon messages |

## Check If Cron Is Even Trying

```bash
# Debian/Ubuntu
grep CRON /var/log/syslog

# RHEL/CentOS
grep CRON /var/log/cron

# systemd
journalctl -u cron
# or
journalctl -u crond
```

This tells you if cron is attempting to run the job at all, which splits the problem in two: *is it running* vs *why does it fail*.

The most likely culprit is PATH - that alone accounts for probably 70% of these cases.


<br><br>




═══════════════════════════════════════════════════════════════

## 🔹 MODE: CAVEMAN

═══════════════════════════════════════════════════════════════


_latency=5857ms · in=1132 · out=333 · chars=1070_


<br>

Classic cron trap. Three root causes cover 95% of cases:

**1. Environment is stripped**

Cron gives you almost nothing: no `PATH`, no `HOME`, no aliases. Add to the top of your crontab:

```
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
```

Or use absolute paths for every binary in the script.

**2. Working directory is wrong**

Cron starts in `$HOME`, not wherever your script lives. Hardcode it:

```bash
cd /path/to/your/project || exit 1
```

**3. You're not seeing the errors**

Redirect output so it can't disappear:

```
* * * * * /path/to/script.sh >> /tmp/cron_debug.log 2>&1
```

Run it once, check the log. The error is almost certainly there.

---

**After those three**, check:

- Script has execute bit: `chmod +x script.sh`
- Shebang line is correct (`#!/bin/bash`, not `#!/usr/bin/env bash` if `env` isn't in cron's PATH)
- If it touches files, confirm the cron user owns or can write them
- `crontab -l` shows the entry saved correctly (common editor pitfall)

Start with the log redirect. That alone usually reveals the problem.


<br><br>




═══════════════════════════════════════════════════════════════

## 🔹 MODE: MVA

═══════════════════════════════════════════════════════════════


_latency=2046ms · in=766 · out=107 · chars=317_


<br>

Check the cron environment—it's almost always a `PATH` issue.

Add this to the top of your script:

```bash
export PATH=/usr/local/bin:/usr/bin:/bin
```

Also redirect output to confirm cron is actually running it:

```
* * * * * /path/to/script.sh >> /tmp/cron.log 2>&1
```

Check `/tmp/cron.log` after the next run.


<br><br>
