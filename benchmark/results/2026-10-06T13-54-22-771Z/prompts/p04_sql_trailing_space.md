# p04_sql_trailing_space


═══════════════════════════════════════════════════════════════

## 📝 PROMPT

═══════════════════════════════════════════════════════════════


> This SQL returns 0 rows but there is data: `SELECT * FROM users WHERE name = 'Alice '`. Why?




═══════════════════════════════════════════════════════════════

## 🔹 MODE: DEFAULT

═══════════════════════════════════════════════════════════════


_latency=5181ms · in=34 · out=439 · chars=1389_


<br>

## Trailing Space Issue

The problem is the **trailing space** in `'Alice '` — you're searching for `"Alice "` (with a space) instead of `"Alice"`.

---

## Why It Happens

```sql
SELECT * FROM users WHERE name = 'Alice '  -- searching for "Alice" + space
-- but the actual data stored is "Alice" (no trailing space)
```

---

## How to Fix It

### Option 1: Remove the trailing space (simplest)
```sql
SELECT * FROM users WHERE name = 'Alice'
```

### Option 2: Trim the search value
```sql
SELECT * FROM users WHERE name = TRIM('Alice ')
```

### Option 3: Trim the column (finds data regardless of stored spaces)
```sql
SELECT * FROM users WHERE TRIM(name) = TRIM('Alice ')
```

---

## ⚠️ Related Gotchas to Check

| Issue | Example | Fix |
|-------|---------|-----|
| Trailing space in query | `'Alice '` | `TRIM()` or fix the string |
| Trailing space in **stored data** | DB has `'Alice '` | `TRIM(name)` |
| Case sensitivity | `'alice'` vs `'Alice'` | `LOWER()` or collation |
| Hidden characters | tabs, `\r\n` | `TRIM()` may not catch all |

---

## Diagnose What's Actually Stored

```sql
-- Check the exact length and value
SELECT name, LEN(name), CONCAT('[', name, ']') as wrapped
FROM users
WHERE name LIKE 'Alice%'
```

This wraps the value in brackets so you can **see hidden spaces** clearly.

> **Note:** `LEN()` is SQL Server syntax — use `LENGTH()` in MySQL/PostgreSQL.


<br><br>




═══════════════════════════════════════════════════════════════

## 🔹 MODE: CAVEMAN

═══════════════════════════════════════════════════════════════


_latency=2198ms · in=1130 · out=139 · chars=443_


<br>

Trailing space in the literal. `'Alice '` ≠ `'Alice'`.

Fix:

```sql
SELECT * FROM users WHERE name = 'Alice';
-- or trim both sides:
SELECT * FROM users WHERE name = TRIM('Alice ');
-- or find all padded rows:
SELECT * FROM users WHERE TRIM(name) = 'Alice';
```

Check the source data too: `SELECT name, LENGTH(name) FROM users WHERE TRIM(name) = 'Alice'`. If lengths differ, the column has padding. Fix at insert time or add a CHECK/trigger.


<br><br>




═══════════════════════════════════════════════════════════════

## 🔹 MODE: MVA

═══════════════════════════════════════════════════════════════


_latency=1423ms · in=764 · out=49 · chars=146_


<br>

Trailing space in `'Alice '` — your literal has one, the stored data probably doesn't. Try `WHERE name = 'Alice'` or `WHERE TRIM(name) = 'Alice'`.


<br><br>
