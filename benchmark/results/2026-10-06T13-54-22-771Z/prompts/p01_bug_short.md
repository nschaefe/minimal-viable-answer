# p01_bug_short


═══════════════════════════════════════════════════════════════

## 📝 PROMPT

═══════════════════════════════════════════════════════════════


> Why does `const x = arr.find(e => e.id == id).name` sometimes throw?




═══════════════════════════════════════════════════════════════

## 🔹 MODE: DEFAULT

═══════════════════════════════════════════════════════════════


_latency=6211ms · in=30 · out=575 · chars=1851_


<br>

## Why `arr.find(...).name` Sometimes Throws

The problem is that **`find()` returns `undefined`** when no element matches the predicate, and you can't access a property on `undefined`.

```javascript
const arr = [{ id: 1, name: "Alice" }];
const id = 99; // No match exists

const x = arr.find(e => e.id == id).name;
//                                 ^^^^
// TypeError: Cannot read properties of undefined (reading 'name')
```

### What's Happening Step by Step

```javascript
arr.find(e => e.id == 99)  // → undefined  (no match found)
undefined.name             // → 💥 TypeError
```

---

## Solutions

### 1. Optional Chaining (simplest)
```javascript
const x = arr.find(e => e.id == id)?.name;
// Returns undefined instead of throwing
```

### 2. Check Before Accessing
```javascript
const match = arr.find(e => e.id == id);
if (match) {
  const x = match.name;
}
```

### 3. Provide a Fallback with `??`
```javascript
const x = arr.find(e => e.id == id)?.name ?? "default";
```

### 4. Use Nullish Coalescing on the Element
```javascript
const x = (arr.find(e => e.id == id) ?? {}).name;
// Old-school way before optional chaining
```

---

## Secondary Issue: `==` vs `===`

You're also using loose equality (`==`), which can cause **unexpected matches or misses** due to type coercion:

```javascript
// id might be a string "1" from a URL param, element id might be number 1
e.id == id   // true  (coerces types) — sometimes masks bugs
e.id === id  // false (strict)        — explicit about types
```

**Prefer `===`** and ensure your types are consistent.

---

## Key Takeaway

| Scenario | Result |
|---|---|
| Match found | Returns the element object ✅ |
| No match found | Returns `undefined` ⚠️ |
| Accessing `.name` on `undefined` | **Throws TypeError** 💥 |

Always assume `find()` **might not find anything** and guard accordingly.


<br><br>




═══════════════════════════════════════════════════════════════

## 🔹 MODE: CAVEMAN

═══════════════════════════════════════════════════════════════


_latency=2067ms · in=1126 · out=148 · chars=443_


<br>

`.find()` returns `undefined` when nothing matches. Then `.name` throws `TypeError: Cannot read properties of undefined`.

Fix — optional chain:

```js
const x = arr.find(e => e.id == id)?.name;  // undefined if not found
```

Or fail loudly:

```js
const el = arr.find(e => e.id == id);
if (!el) throw new Error(`id ${id} not found`);
const x = el.name;
```

Side note: `==` coerces types (`"3" == 3` is true). Use `===` unless you need that.


<br><br>




═══════════════════════════════════════════════════════════════

## 🔹 MODE: MVA

═══════════════════════════════════════════════════════════════


_latency=1622ms · in=760 · out=43 · chars=119_


<br>

`find` returns `undefined` when no match exists; `.name` on `undefined` throws.

Fix: `arr.find(e => e.id == id)?.name`


<br><br>
