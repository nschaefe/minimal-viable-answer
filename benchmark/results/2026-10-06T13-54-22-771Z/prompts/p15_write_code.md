# p15_write_code


═══════════════════════════════════════════════════════════════

## 📝 PROMPT

═══════════════════════════════════════════════════════════════


> Write a Python function that takes a list of integers and returns the two numbers that sum to a target. Return None if no pair exists.




═══════════════════════════════════════════════════════════════

## 🔹 MODE: DEFAULT

═══════════════════════════════════════════════════════════════


_latency=6145ms · in=35 · out=792 · chars=2458_


<br>

## Two Sum Function

### Implementation

```python
def two_sum(numbers: list[int], target: int) -> tuple[int, int] | None:
    """
    Find two numbers in a list that sum to the target value.

    Args:
        numbers: List of integers to search through
        target: The target sum to find

    Returns:
        A tuple of the two numbers that sum to target, or None if no pair exists

    Examples:
        >>> two_sum([2, 7, 11, 15], 9)
        (2, 7)
        >>> two_sum([3, 2, 4], 6)
        (2, 4)
        >>> two_sum([1, 2, 3], 10)
        None
    """
    seen = {}

    for number in numbers:
        complement = target - number

        if complement in seen:
            return (complement, number)

        seen[number] = True

    return None
```

### How It Works

The function uses a **hash map** to achieve O(n) time complexity:

| Step | Action |
|------|--------|
| 1 | Calculate the `complement` needed to reach the target (`target - current`) |
| 2 | Check if the complement was seen in a previous iteration |
| 3 | If yes, return the pair immediately |
| 4 | If no, store the current number and continue |
| 5 | Return `None` if no pair is found after checking all numbers |

### Example Usage

```python
# Basic usage
print(two_sum([2, 7, 11, 15], 9))   # (2, 7)
print(two_sum([3, 2, 4], 6))         # (2, 4)
print(two_sum([3, 3], 6))            # (3, 3)

# Edge cases
print(two_sum([1, 2, 3], 10))        # None  — no valid pair
print(two_sum([], 5))                # None  — empty list
print(two_sum([5], 5))               # None  — only one element
```

### Complexity Analysis

| | Best Case | Worst Case |
|---|---|---|
| **Time** | O(1) | O(n) |
| **Space** | O(1) | O(n) |

The hash map approach is significantly faster than a brute-force nested loop, which would be **O(n²)** time.

---

### Alternative: Return Indices Instead of Values

If you need the **indices** of the two numbers rather than the values:

```python
def two_sum_indices(numbers: list[int], target: int) -> tuple[int, int] | None:
    """Returns the indices of the two numbers that sum to target."""
    seen = {}  # Maps number -> index

    for index, number in enumerate(numbers):
        complement = target - number

        if complement in seen:
            return (seen[complement], index)

        seen[number] = index

    return None

print(two_sum_indices([2, 7, 11, 15], 9))  # (0, 1)
print(two_sum_indices([3, 2, 4], 6))        # (1, 2)
```


<br><br>




═══════════════════════════════════════════════════════════════

## 🔹 MODE: CAVEMAN

═══════════════════════════════════════════════════════════════


_latency=1329ms · in=1131 · out=102 · chars=319_


<br>

```python
def two_sum(nums: list[int], target: int) -> tuple[int, int] | None:
    seen = {}
    for n in nums:
        complement = target - n
        if complement in seen:
            return (complement, n)
        seen[n] = True
    return None
```

O(n) time, O(n) space. Returns first valid pair found, or `None`.


<br><br>




═══════════════════════════════════════════════════════════════

## 🔹 MODE: MVA

═══════════════════════════════════════════════════════════════


_latency=1227ms · in=765 · out=60 · chars=178_


<br>

```python
def two_sum(nums, target):
    seen = {}
    for n in nums:
        if target - n in seen:
            return (target - n, n)
        seen[n] = True
    return None
```


<br><br>
