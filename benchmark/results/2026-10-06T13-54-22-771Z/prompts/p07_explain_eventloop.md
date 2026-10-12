# p07_explain_eventloop


═══════════════════════════════════════════════════════════════

## 📝 PROMPT

═══════════════════════════════════════════════════════════════


> Explain how the Node.js event loop works. What is the difference between microtasks and macrotasks?




═══════════════════════════════════════════════════════════════

## 🔹 MODE: DEFAULT

═══════════════════════════════════════════════════════════════


_latency=9117ms · in=31 · out=1024 · chars=3531_


<br>

# Node.js Event Loop

## Overview

Node.js is single-threaded but handles concurrency through an **event-driven, non-blocking I/O model**. The event loop is the mechanism that allows Node.js to perform non-blocking operations by offloading operations to the system kernel whenever possible.

---

## Event Loop Phases

The event loop runs through distinct phases in order:

```
   ┌───────────────────────────┐
┌─>│           timers          │  ← setTimeout, setInterval callbacks
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │  ← I/O callbacks deferred to next iteration
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │  ← internal use only
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           poll            │  ← retrieve new I/O events
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           check           │  ← setImmediate callbacks
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──│      close callbacks      │  ← socket.on('close', ...) etc.
   └───────────────────────────┘
```

### Phase Details

| Phase | What it does |
|-------|-------------|
| **Timers** | Executes callbacks scheduled by `setTimeout`/`setInterval` whose threshold has elapsed |
| **Pending Callbacks** | Executes I/O callbacks deferred from the previous loop iteration |
| **Idle/Prepare** | Internal Node.js housekeeping |
| **Poll** | Retrieves new I/O events; blocks here if nothing else pending |
| **Check** | Executes `setImmediate` callbacks |
| **Close Callbacks** | Handles close events like `socket.destroy()` |

---

## Microtasks vs Macrotasks

This is the **most critical distinction** for understanding execution order.

### Macrotasks (Task Queue)
Each phase of the event loop processes one type of macrotask.

```javascript
// Macrotask sources:
setTimeout(callback, delay)    // Timers phase
setInterval(callback, delay)   // Timers phase
setImmediate(callback)         // Check phase
I/O callbacks                  // Poll phase
close callbacks                // Close phase
```

### Microtasks (Microtask Queue)
Microtasks run **after every single macrotask** and **between each event loop phase**.

```javascript
// Microtask sources (in priority order):
process.nextTick(callback)     // nextTick queue (highest priority)
Promise.then/catch/finally     // Promise microtask queue
queueMicrotask(callback)       // Promise microtask queue
```

### Execution Order Rule

```
┌─────────────────────────────────────────────────────┐
│  Run current synchronous code                       │
│                          ↓                          │
│  Drain nextTick queue (ALL callbacks)               │
│                          ↓                          │
│  Drain Promise microtask queue (ALL callbacks)      │
│                          ↓                          │
│  Move to next event loop phase / run next macrotask │
│                          ↓                          │
│  Repeat ↑                                           │
└─────────────────────────────────────────────────────┘
```

> **Key insight:** Microtasks drain completely before the next macrotask or phase begins.

---

## Code Examples

### Example 1: Basic Order

```javascript
console.log('1: synchronous');

setTimeout(() => console.log('2: setTimeout'), 0);

Promise.resolve().then(() => console.log('3: promise'));

process.nextTick(() => console.log('4: nextTick'));

console


<br><br>




═══════════════════════════════════════════════════════════════

## 🔹 MODE: CAVEMAN

═══════════════════════════════════════════════════════════════


_latency=7368ms · in=1127 · out=589 · chars=2037_


<br>

Node.js runs on a single thread. Libuv handles async I/O via a thread pool and OS primitives; the event loop drains its phases in order.

## Event loop phases (each is a FIFO queue)

1. **timers** — `setTimeout`, `setInterval` callbacks whose threshold has passed
2. **pending callbacks** — I/O errors deferred from the previous iteration
3. **idle / prepare** — internal use
4. **poll** — fetch new I/O events; block here if nothing else is waiting
5. **check** — `setImmediate` callbacks
6. **close callbacks** — `socket.on('close', ...)` etc.

After *each phase* (and between each C++ → JS transition), Node drains two microtask queues before moving on.

## Microtasks vs macrotasks

| | Microtasks | Macrotasks |
|---|---|---|
| **What** | `Promise.then/catch/finally`, `queueMicrotask()`, `process.nextTick`* | `setTimeout`, `setInterval`, `setImmediate`, I/O callbacks |
| **When** | After current operation, before next event loop phase | On the next (or a later) event loop phase |
| **Queue drain** | Full queue drained before moving on | One callback per iteration per phase |
| **Order** | `nextTick` queue first, then Promise queue | Phase order above |

*`process.nextTick` is not technically a microtask per spec but drains before Promises and before any I/O.

## Example

```js
setTimeout(() => console.log('setTimeout'), 0);
setImmediate(() => console.log('setImmediate'));
Promise.resolve().then(() => console.log('Promise'));
process.nextTick(() => console.log('nextTick'));
console.log('sync');
```

Output:
```
sync
nextTick
Promise
setTimeout   // or setImmediate first — order between these two is non-deterministic outside I/O callbacks
setImmediate
```

## Key consequences

- A `nextTick` or Promise loop (recursive scheduling) **starves the event loop** — I/O never runs.
- `setImmediate` fires after I/O poll; `setTimeout(fn, 0)` fires before poll on the next iteration. Inside an I/O callback, `setImmediate` always wins.
- CPU-heavy sync code blocks all phases — offload to worker threads or child processes.


<br><br>




═══════════════════════════════════════════════════════════════

## 🔹 MODE: MVA

═══════════════════════════════════════════════════════════════


_latency=3673ms · in=761 · out=264 · chars=820_


<br>

**Event loop** runs in phases. Each phase drains its queue before moving to the next:

1. **timers** – `setTimeout`/`setInterval` callbacks
2. **I/O** – most async callbacks (fs, net)
3. **poll** – waits for new I/O
4. **check** – `setImmediate`
5. **close** – `socket.on('close', ...)`

**Between every phase**, Node drains microtasks first.

---

**Microtasks** (run before next phase, in order):
- `process.nextTick` queue ← drained first
- Promise `.then`/`catch`/`finally` queue

**Macrotasks** = one item per loop iteration from a phase queue (`setTimeout`, `setImmediate`, I/O callbacks).

---

**Practical result:**

```js
setTimeout(() => console.log('macro'), 0);
Promise.resolve().then(() => console.log('micro'));
process.nextTick(() => console.log('nextTick'));

// Output:
// nextTick
// micro
// macro
```


<br><br>
