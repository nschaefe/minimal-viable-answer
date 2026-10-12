# p18_perf_question


═══════════════════════════════════════════════════════════════

## 📝 PROMPT

═══════════════════════════════════════════════════════════════


> I have a list of 10 million strings and I need to check if a given string is in it. What is the fastest approach in Python?




═══════════════════════════════════════════════════════════════

## 🔹 MODE: DEFAULT

═══════════════════════════════════════════════════════════════


_latency=7683ms · in=38 · out=738 · chars=2181_


<br>

## Fastest Approach: Use a `set`

Converting your list to a `set` gives **O(1)** average lookup time vs **O(n)** for a list.

```python
# ❌ Slow - O(n) linear scan
my_list = ["string1", "string2", ...]  # 10 million strings
if target in my_list:  # checks every element until found
    print("Found")

# ✅ Fast - O(1) hash lookup
my_set = set(my_list)
if target in my_set:  # near-instant lookup regardless of size
    print("Found")
```

## Performance Comparison

```python
import time

# Setup
my_list = [str(i) for i in range(10_000_000)]
my_set = set(my_list)
target = "9999999"  # worst case - near end of list

# List lookup
start = time.perf_counter()
result = target in my_list
print(f"List:  {time.perf_counter() - start:.4f}s")  # ~0.1-0.3s

# Set lookup
start = time.perf_counter()
result = target in my_set
print(f"Set:   {time.perf_counter() - start:.4f}s")  # ~0.0000001s
```

## Real-World Considerations

| Approach | Lookup | Memory | Setup Time | Notes |
|----------|--------|--------|------------|-------|
| `list` | O(n) | Low | None | Only if searching once |
| `set` | O(1) | ~3-4x list | One-time | **Best for repeated lookups** |
| `dict` | O(1) | ~4-5x list | One-time | Use if you need key→value |
| Sorted list + `bisect` | O(log n) | Low | O(n log n) | Memory-constrained situations |

```python
# bisect option - lower memory than set, slower than set
import bisect

sorted_list = sorted(my_list)

def contains(sorted_list, target):
    i = bisect.bisect_left(sorted_list, target)
    return i < len(sorted_list) and sorted_list[i] == target
```

## Recommendations

- **Default choice → `set`**: fastest lookup, simple to use
- **Memory is tight → `bisect`** on a sorted list: same memory as list, O(log n) lookup
- **Persistent/huge data → `sqlite` or `redis`**: when data doesn't fit in RAM
- **Fuzzy matching needed → `pyahocorasick`** or similar

```python
# If building the set is a one-time cost, it's almost always worth it
my_set = set(my_list)  # build once
for query in many_queries:  # benefit many times
    if query in my_set:
        ...
```

**Bottom line:** Use a `set` unless you have memory constraints or only need a single lookup.


<br><br>




═══════════════════════════════════════════════════════════════

## 🔹 MODE: CAVEMAN

═══════════════════════════════════════════════════════════════


_latency=4807ms · in=1134 · out=256 · chars=797_


<br>

**Use a set.**

```python
string_set = set(your_list)  # build once
"needle" in string_set        # O(1) average
```

Set membership is O(1) average (hash lookup). List `in` is O(n).

**Build cost:** O(n) time and memory. ~50–200 bytes per string entry overhead. For 10 M strings that's real RAM — measure with `sys.getsizeof` or `tracemalloc`.

**If RAM is tight:**

| Option | Speed | Memory |
|---|---|---|
| `set` | O(1) | High |
| Sorted list + `bisect` | O(log n) | Low |
| Bloom filter (`pybloom-live`) | O(1), probabilistic | Very low |

**If strings share prefixes** (URLs, file paths): a trie (`pygtrie`, `marisa-trie`) saves memory and stays fast.

**If the set is rebuilt often:** profile whether list → set conversion dominates. If so, maintain the set directly instead of converting.


<br><br>




═══════════════════════════════════════════════════════════════

## 🔹 MODE: MVA

═══════════════════════════════════════════════════════════════


_latency=1429ms · in=768 · out=63 · chars=150_


<br>

Convert the list to a `set` once, then use `in`.

```python
lookup = set(my_list)
"target" in lookup  # O(1)
```

List `in` is O(n); set `in` is O(1).


<br><br>
