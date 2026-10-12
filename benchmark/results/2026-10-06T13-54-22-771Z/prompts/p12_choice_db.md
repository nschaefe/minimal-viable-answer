# p12_choice_db


═══════════════════════════════════════════════════════════════

## 📝 PROMPT

═══════════════════════════════════════════════════════════════


> Should I use Postgres or MongoDB for a small analytics dashboard?




═══════════════════════════════════════════════════════════════

## 🔹 MODE: DEFAULT

═══════════════════════════════════════════════════════════════


_latency=5659ms · in=20 · out=364 · chars=1428_


<br>

## Postgres vs MongoDB for a Small Analytics Dashboard

For most small analytics dashboards, **Postgres is likely the better choice**, but here's an honest breakdown:

---

## Why Postgres Usually Wins Here

**Analytics is fundamentally relational**
- Aggregations, GROUP BY, JOINs work naturally
- Window functions are powerful for time-series data
- SQL is well-understood and widely supported

**Strong analytics features**
- `DATE_TRUNC`, `PERCENTILE_CONT`, aggregates built-in
- Good performance on read-heavy workloads
- JSONB column if you need flexibility

**Tooling ecosystem**
- Nearly every BI tool (Grafana, Metabase, Redash) has native Postgres support

---

## When MongoDB Makes Sense

- Your source data is **already document-shaped** (logs, events, nested objects)
- You need **flexible schemas** because metrics are still being defined
- You're aggregating data from APIs that return JSON

---

## Practical Recommendation

```
Small dashboard + structured data → Postgres
Unstructured/evolving event data → MongoDB (or reconsider)
```

**Also worth considering:**
- **SQLite** - if truly small and single-user
- **DuckDB** - excellent for analytics specifically, very fast on flat data

---

## Quick Questions to Decide

1. Is your data structured or document-like?
2. Do you need complex aggregations?
3. What does your team already know?

What kind of data are you tracking? That would help narrow it down.


<br><br>




═══════════════════════════════════════════════════════════════

## 🔹 MODE: CAVEMAN

═══════════════════════════════════════════════════════════════


_latency=5503ms · in=1116 · out=42 · chars=164_


<br>

Postgres. Small dashboard = fixed schema + aggregation queries. `GROUP BY`, window functions, `JSONB` if you need flex. MongoDB adds ops overhead with no gain here.


<br><br>




═══════════════════════════════════════════════════════════════

## 🔹 MODE: MVA

═══════════════════════════════════════════════════════════════


_latency=817ms · in=750 · out=6 · chars=9_


<br>

Postgres.


<br><br>
