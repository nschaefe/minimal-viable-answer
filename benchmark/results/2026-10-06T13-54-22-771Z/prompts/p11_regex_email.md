# p11_regex_email


═══════════════════════════════════════════════════════════════

## 📝 PROMPT

═══════════════════════════════════════════════════════════════


> Write a regex that matches an email address.




═══════════════════════════════════════════════════════════════

## 🔹 MODE: DEFAULT

═══════════════════════════════════════════════════════════════


_latency=5903ms · in=16 · out=588 · chars=1374_


<br>

## Email Address Regex

Here's a regex pattern that matches most valid email addresses:

```regex
^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$
```

### Breakdown

| Part | Description |
|------|-------------|
| `^` | Start of string |
| `[a-zA-Z0-9._%+\-]+` | Local part (letters, digits, `.` `_` `%` `+` `-`) |
| `@` | Literal `@` symbol |
| `[a-zA-Z0-9.\-]+` | Domain name (letters, digits, `.` `-`) |
| `\.[a-zA-Z]{2,}` | TLD with at least 2 letters (`.com`, `.org`, etc.) |
| `$` | End of string |

### Examples

| Email | Match |
|-------|-------|
| `user@example.com` | ✅ |
| `user.name+tag@sub.domain.org` | ✅ |
| `user@domain.co.uk` | ✅ |
| `@domain.com` | ❌ |
| `user@.com` | ❌ |
| `user@domain` | ❌ |

### Usage in Common Languages

```python
# Python
import re
pattern = r'^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$'
re.match(pattern, 'user@example.com')
```

```javascript
// JavaScript
const pattern = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
pattern.test('user@example.com');
```

```java
// Java
String pattern = "^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}$";
email.matches(pattern);
```

> **Note:** A fully RFC 5322-compliant email regex is extremely complex. This pattern covers the vast majority of real-world email addresses. For production use, consider sending a **confirmation email** to truly validate an address.


<br><br>




═══════════════════════════════════════════════════════════════

## 🔹 MODE: CAVEMAN

═══════════════════════════════════════════════════════════════


_latency=1514ms · in=1112 · out=74 · chars=182_


<br>

```
^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$
```

Catches most real addresses. Does not cover quoted locals, IP literals, or internationalized domains—those need a library.


<br><br>




═══════════════════════════════════════════════════════════════

## 🔹 MODE: MVA

═══════════════════════════════════════════════════════════════


_latency=919ms · in=746 · out=26 · chars=34_


<br>

```
^[^\s@]+@[^\s@]+\.[^\s@]+$
```


<br><br>
