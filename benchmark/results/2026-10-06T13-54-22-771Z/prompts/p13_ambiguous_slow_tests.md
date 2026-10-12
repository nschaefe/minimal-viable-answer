# p13_ambiguous_slow_tests


═══════════════════════════════════════════════════════════════

## 📝 PROMPT

═══════════════════════════════════════════════════════════════


> My tests are slow. Help.




═══════════════════════════════════════════════════════════════

## 🔹 MODE: DEFAULT

═══════════════════════════════════════════════════════════════


_latency=4916ms · in=14 · out=332 · chars=1091_


<br>

I can help you speed up your tests! I'll need a bit more context to give specific advice, but here are the **most common causes and fixes**:

---

## Quick Diagnosis Questions
- What language/framework are you using?
- What kind of tests? (unit, integration, e2e)
- How slow are we talking? (seconds vs minutes)

---

## Common Causes & Fixes

### 1. **Database Calls**
- Use in-memory databases (SQLite, H2)
- Mock/stub DB calls in unit tests
- Use transactions that roll back after each test

### 2. **No Parallelization**
```bash
# Jest
jest --runInBand=false --maxWorkers=4

# pytest
pytest -n auto  # requires pytest-xdist

# RSpec
parallel_rspec spec/
```

### 3. **Unnecessary Setup/Teardown**
- Move shared setup to `beforeAll` instead of `beforeEach`
- Only create what each test actually needs

### 4. **Network Calls**
- Mock external APIs (WireMock, nock, VCR)
- Never hit real endpoints in unit tests

### 5. **Too Many E2E Tests**
- Follow the **test pyramid**: more unit, fewer e2e

---

## Tell me:
- Your stack
- A sample slow test

...and I can give you **specific fixes**.


<br><br>




═══════════════════════════════════════════════════════════════

## 🔹 MODE: CAVEMAN

═══════════════════════════════════════════════════════════════


_latency=923ms · in=1110 · out=14 · chars=41_


<br>

What kind of tests, and what's the stack?


<br><br>




═══════════════════════════════════════════════════════════════

## 🔹 MODE: MVA

═══════════════════════════════════════════════════════════════


_latency=921ms · in=744 · out=8 · chars=17_


<br>

What's the stack?


<br><br>
