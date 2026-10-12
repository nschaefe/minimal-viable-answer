# p03_module_missing


═══════════════════════════════════════════════════════════════

## 📝 PROMPT

═══════════════════════════════════════════════════════════════


> My Node app crashes on startup with `Error: Cannot find module 'express'`. What do I do?




═══════════════════════════════════════════════════════════════

## 🔹 MODE: DEFAULT

═══════════════════════════════════════════════════════════════


_latency=4784ms · in=30 · out=449 · chars=1560_


<br>

## Fixing "Cannot find module 'express'"

This error means Node.js can't locate the Express package. Here are the solutions:

---

### 1. Install Dependencies (Most Common Fix)

```bash
npm install
```

This installs everything listed in your `package.json`. If Express isn't there yet:

```bash
npm install express
```

---

### 2. Verify the Install Worked

```bash
ls node_modules | grep express
# or
npm list express
```

You should see express listed in the output.

---

### 3. Check Your `package.json`

Make sure express appears in dependencies:

```json
{
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

If it's missing, run:
```bash
npm install express --save
```

---

### 4. Check for Common Mistakes

**Wrong directory** - make sure you're in the right folder:
```bash
ls package.json    # should exist here
npm install
```

**Corrupted node_modules** - try a clean reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

---

### 5. Verify Your Import Statement

```js
// CommonJS (most common)
const express = require('express');

// ES Modules (if using "type": "module" in package.json)
import express from 'express';
```

A **typo** in the module name will cause the same error.

---

### Quick Checklist

| Check | Command |
|-------|---------|
| In right directory? | `ls package.json` |
| Dependencies installed? | `npm install` |
| Express in package.json? | `npm list express` |
| No typo in require? | Check your source file |

The most likely fix is simply running **`npm install`** in your project directory.


<br><br>




═══════════════════════════════════════════════════════════════

## 🔹 MODE: CAVEMAN

═══════════════════════════════════════════════════════════════


_latency=1332ms · in=1126 · out=32 · chars=110_


<br>

Run `npm install` in your project root. If that fails:

```bash
npm install express
```

Then restart the app.


<br><br>




═══════════════════════════════════════════════════════════════

## 🔹 MODE: MVA

═══════════════════════════════════════════════════════════════


_latency=922ms · in=760 · out=13 · chars=44_


<br>

Run `npm install` in your project directory.


<br><br>
