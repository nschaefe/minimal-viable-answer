# p17_concept_idempotent


═══════════════════════════════════════════════════════════════

## 📝 PROMPT

═══════════════════════════════════════════════════════════════


> What does it mean for an HTTP endpoint to be idempotent? Give an example of one that is and one that isn't.




═══════════════════════════════════════════════════════════════

## 🔹 MODE: DEFAULT

═══════════════════════════════════════════════════════════════


_latency=6183ms · in=35 · out=476 · chars=1463_


<br>

## HTTP Idempotency

An endpoint is **idempotent** if making the **same request multiple times produces the same result** as making it once. The server's state ends up identical regardless of how many times you call it.

> Note: idempotency is about **server state**, not necessarily the response you get back.

---

## Idempotent Example — `PUT /users/42`

```http
PUT /users/42
Content-Type: application/json

{ "name": "Alice", "email": "alice@example.com" }
```

- Call it **once** → user 42 is updated
- Call it **10 times** → user 42 still has the same data
- The final server state is **identical** no matter how many times you call it

---

## Non-Idempotent Example — `POST /orders`

```http
POST /orders
Content-Type: application/json

{ "item": "book", "quantity": 1 }
```

- Call it **once** → 1 order created
- Call it **10 times** → **10 orders created**
- Each call **changes server state further**

---

## Quick Reference

| Method | Idempotent | Safe (no side effects) |
|--------|-----------|----------------------|
| `GET` | ✅ | ✅ |
| `PUT` | ✅ | ❌ |
| `DELETE` | ✅ | ❌ |
| `POST` | ❌ | ❌ |
| `PATCH` | ❌* | ❌ |

*`PATCH` is typically **not** idempotent — e.g. `PATCH /counter` with `{ "op": "increment" }` gives different results each call.

---

## Why It Matters

Idempotency is critical for **reliability** — if a network request times out, a client can safely **retry** an idempotent request without worrying about duplicate side effects.


<br><br>




═══════════════════════════════════════════════════════════════

## 🔹 MODE: CAVEMAN

═══════════════════════════════════════════════════════════════


_latency=3865ms · in=1131 · out=167 · chars=542_


<br>

Idempotent: same request N times = same server state as 1 time. Response code may vary; state must not.

**Is idempotent — `PUT /users/42 {"name":"Alice"}`**
Sets the name to Alice. Run it 10 times: still Alice. No side effects stack.

**Not idempotent — `POST /orders {"item":"book"}`**
Creates an order each call. Run it 10 times: 10 orders.

GET, PUT, DELETE are idempotent. POST and PATCH generally aren't.

> DELETE edge case: first call returns 200, subsequent return 404, but the state (resource absent) is identical. Still idempotent.


<br><br>




═══════════════════════════════════════════════════════════════

## 🔹 MODE: MVA

═══════════════════════════════════════════════════════════════


_latency=1728ms · in=765 · out=72 · chars=225_


<br>

**Idempotent:** calling it N times has the same effect as calling it once.

**Is:** `PUT /users/42` with a full user body — sends it 10 times, user ends up the same.

**Isn't:** `POST /orders` — each call creates a new order.


<br><br>
