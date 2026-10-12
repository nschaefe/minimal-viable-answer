# p14_react_rerender


═══════════════════════════════════════════════════════════════

## 📝 PROMPT

═══════════════════════════════════════════════════════════════


> I have a React component that re-renders on every keystroke even though the parent state did not change. The child receives `{ user, config, onSave }` as props. `user` and `config` are objects, `onSave` is a function. All three come from a parent component that reads from a Redux store. What is the most likely cause?




═══════════════════════════════════════════════════════════════

## 🔹 MODE: DEFAULT

═══════════════════════════════════════════════════════════════


_latency=7274ms · in=86 · out=729 · chars=2483_


<br>

## Most Likely Cause

**New object/function references are created on every parent render**, even when the underlying data hasn't changed.

### Why This Happens

```jsx
// Parent component - THIS is the problem
function Parent() {
  const user = useSelector(state => state.user)      // ✅ memoized by Redux
  const config = useSelector(state => state.config)  // ✅ memoized by Redux

  // ❌ New object created every render, new reference every time
  const enrichedConfig = { ...config, timestamp: Date.now() }

  // ❌ New function created every render, new reference every time  
  const onSave = (data) => {
    dispatch(saveAction(data))
  }

  return <Child user={user} config={enrichedConfig} onSave={onSave} />
}
```

Even if `user` and `config` from Redux are stable, **any wrapping or inline definition breaks referential equality**.

---

### The Fix

```jsx
function Parent() {
  const user = useSelector(state => state.user)
  const config = useSelector(state => state.config)

  // ✅ Only recomputes when config changes
  const enrichedConfig = useMemo(() => ({
    ...config,
    extraProp: 'value'
  }), [config])

  // ✅ Only recomputes when dispatch changes (it never does)
  const onSave = useCallback((data) => {
    dispatch(saveAction(data))
  }, [dispatch])

  return <Child user={user} config={enrichedConfig} onSave={onSave} />
}

// ✅ Child bails out if props are referentially equal
const Child = React.memo(function Child({ user, config, onSave }) {
  // ...
})
```

---

### Why React.memo Alone Isn't Enough

`React.memo` does a **shallow comparison** of props. If references change on every render, the comparison always fails:

```
prev.onSave === next.onSave  // false - new function each render
prev.config === next.config  // false - new object each render
```

---

### Checklist to Diagnose

| Prop | Check for |
|------|-----------|
| `user` | Spread/transform in parent? Selector creating new object? |
| `config` | Same as above |
| `onSave` | Defined inline without `useCallback`? |

### Also Check Your Selectors

```js
// ❌ Creates new object reference every time selector runs
const config = useSelector(state => ({
  ...state.config,
  extra: true
}))

// ✅ Use reselect to memoize derived data
const selectConfig = createSelector(
  state => state.config,
  config => ({ ...config, extra: true })
)
```

The root issue is that **JavaScript object/function equality is by reference**, so `{}` never equals `{}` even with identical contents.


<br><br>




═══════════════════════════════════════════════════════════════

## 🔹 MODE: CAVEMAN

═══════════════════════════════════════════════════════════════


_latency=6141ms · in=1182 · out=390 · chars=1428_


<br>

New object/function references on every render — even when the data is identical.

**Why each prop fails:**

- `user` and `config`: if the parent does `{ ...storeUser }` or selects a derived/mapped object, a new reference is created each render.
- `onSave`: defined inline (`onSave={() => dispatch(...)}`) creates a new function every render.

**Confirm:** `React.memo` on the child will expose this — it will still re-render because the shallow comparison sees three new references every time.

---

**Fixes:**

`user` / `config` — select primitives or stabilize the reference:
```js
// Stable if the store slice hasn't changed
const user = useSelector(state => state.user);       // object — fine if not remapped
const user = useSelector(state => ({ ...state.user })); // BAD — new ref every time
```
Use `shallowEqual` from react-redux if you must select a derived object:
```js
const user = useSelector(selectUser, shallowEqual);
```

`onSave` — memoize with `useCallback`:
```js
const onSave = useCallback(() => dispatch(saveAction()), [dispatch]);
```

Then wrap the child:
```js
export default React.memo(ChildComponent);
```

---

**Root cause order of suspicion:**
1. `onSave` inline — almost always the culprit.
2. Selector returning a new object (`mapState`, `reselect` misconfigured, spread in selector).
3. Parent itself re-rendering for an unrelated reason and passing stable-looking but freshly allocated objects.


<br><br>




═══════════════════════════════════════════════════════════════

## 🔹 MODE: MVA

═══════════════════════════════════════════════════════════════


_latency=1536ms · in=816 · out=58 · chars=188_


<br>

`onSave` is recreated every render. Wrap it in `useCallback`. If that doesn't fix it, `user` or `config` are new object references each render—use `useMemo` or fix the selector (reselect).


<br><br>
