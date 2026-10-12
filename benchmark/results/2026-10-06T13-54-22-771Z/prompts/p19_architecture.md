# p19_architecture


═══════════════════════════════════════════════════════════════

## 📝 PROMPT

═══════════════════════════════════════════════════════════════


> I want to add a feature flag system to a Node service. Should I build my own or use a library? If library, which one and why?




═══════════════════════════════════════════════════════════════

## 🔹 MODE: DEFAULT

═══════════════════════════════════════════════════════════════


_latency=11376ms · in=38 · out=1024 · chars=3565_


<br>

## Feature Flags in Node.js: Build vs. Buy

### Short Answer
**Use a library** unless you have very specific constraints. The problem is well-solved and building your own has real hidden costs.

---

### When to Actually Build Your Own

```
✓ Flags are purely static (just env vars, no runtime changes)
✓ You have strict compliance/data residency requirements
✓ Your use case is genuinely simple and won't grow
✓ You're explicitly avoiding third-party dependencies
```

If none of these apply, a library saves you from reinventing:
- Gradual rollouts / percentage-based targeting
- User/context-based segmentation
- Audit trails
- Race conditions in flag evaluation
- Stale cache invalidation

---

### Library Options

| Option | Type | Best For |
|--------|------|----------|
| **Unleash** | Self-hosted OSS | Full control, no vendor lock-in |
| **LaunchDarkly** | Managed SaaS | Enterprise, complex targeting |
| **Flagsmith** | Self-hosted or SaaS | Good OSS middle ground |
| **GrowthBook** | Self-hosted OSS | Feature flags + A/B testing |
| **OpenFeature SDK** | Standard + adapters | Avoiding lock-in |

---

### My Recommendation: OpenFeature + Flagsmith or Unleash

**OpenFeature** is the key insight here — it's a CNCF standard that decouples your code from the provider.

```javascript
// Install
// npm install @openfeature/server-sdk @openfeature/flagsmith-provider

import { OpenFeature } from '@openfeature/server-sdk';
import { FlagsmithProvider } from '@openfeature/flagsmith-provider';

// Configure once at startup
await OpenFeature.setProviderAndWait(
  new FlagsmithProvider({ apiKey: process.env.FLAGSMITH_KEY })
);

const client = OpenFeature.getClient();

// Use everywhere - this API never changes regardless of provider
async function handleRequest(req, res) {
  const context = {
    targetingKey: req.user.id,
    email: req.user.email,
    plan: req.user.plan,
  };

  const isNewCheckoutEnabled = await client.getBooleanValue(
    'new-checkout-flow',
    false,  // default value
    context
  );

  if (isNewCheckoutEnabled) {
    return newCheckoutHandler(req, res);
  }
  return legacyCheckoutHandler(req, res);
}
```

**Why OpenFeature specifically:**
```javascript
// Later, switching providers requires changing ONE line
// Your feature flag calls throughout the codebase are untouched

// Before:
await OpenFeature.setProviderAndWait(new FlagsmithProvider(...));

// After (switching to LaunchDarkly):
await OpenFeature.setProviderAndWait(new LaunchDarklyProvider(...));
```

---

### If You Need Something Lightweight First

A minimal self-hosted approach with **Unleash** (free tier, Docker):

```javascript
// npm install unleash-client
import { initialize } from 'unleash-client';

const unleash = initialize({
  url: 'http://localhost:4242/api/',
  appName: 'my-service',
  customHeaders: { Authorization: 'your-api-token' },
});

// Wait for flags to sync
await new Promise(resolve => unleash.on('synchronized', resolve));

// Evaluate with context
const isEnabled = unleash.isEnabled('new-feature', {
  userId: req.user.id,
  properties: { plan: req.user.plan }
});
```

---

### What "Build Your Own" Actually Requires

People underestimate this. A production-ready system needs:

```
□ Storage backend (Redis/DB) with proper schemas
□ API for flag management
□ SDK with local caching + TTL
□ Cache invalidation strategy (polling vs. SSE vs. webhooks)
□ Gradual rollout logic (consistent hashing by user ID)
□ Context-based targeting rules engine
□ Audit logging
□ Admin UI (or live with curl forever)
□ Monitoring for


<br><br>




═══════════════════════════════════════════════════════════════

## 🔹 MODE: CAVEMAN

═══════════════════════════════════════════════════════════════


_latency=6123ms · in=1134 · out=430 · chars=1434_


<br>

Use a library. Building one means reinventing targeting rules, rollout percentages, audit logs, and a UI—weeks of work that isn't your product.

**Pick based on your situation:**

| Need | Library |
|------|---------|
| Self-hosted, OSS, no SaaS cost | [Unleash](https://github.com/Unleash/unleash) or [Flagsmith](https://github.com/Flagsmith/flagsmith) |
| Managed, fast setup, generous free tier | [LaunchDarkly](https://launchdarkly.com) |
| Already on Vercel/Edge | [Vercel Feature Flags](https://vercel.com/docs/workflow-collaboration/feature-flags) |
| Minimal, no infra, flags in config/env | [flagsmith-nodejs](https://github.com/Flagsmith/flagsmith-node) or roll a thin wrapper around env vars |

**For most Node services: Unleash (self-hosted) or LaunchDarkly (managed).**

Unleash reasons:
- Node SDK is first-class: `import { initialize } from 'unleash-client'`
- Gradual rollouts, user targeting, kill switches out of the box
- Docker Compose up in 5 min, no vendor lock-in

LaunchDarkly reasons:
- Zero infra to run
- SDK handles streaming updates, local caching, offline fallback
- Costs money at scale

**Avoid building your own unless:**
- Flags are purely on/off with no targeting
- You never need a UI or audit trail
- Team is <3 people and flags are <10

Even then: a thin wrapper around env vars (`process.env.FEATURE_FOO === 'true'`) beats a custom system. Graduate to a real library when targeting rules appear.


<br><br>




═══════════════════════════════════════════════════════════════

## 🔹 MODE: MVA

═══════════════════════════════════════════════════════════════


_latency=3108ms · in=768 · out=184 · chars=611_


<br>

Use a library. Building your own means reinventing targeting rules, gradual rollouts, and auditability.

**Use [Unleash](https://github.com/Unleash/unleash) (self-hosted) or [OpenFeature](https://openfeature.dev/) (vendor-neutral SDK).**

- **Unleash** if you want a full system (UI, targeting, metrics) on your own infra. Free, mature.
- **OpenFeature** if you want to avoid vendor lock-in and pick a backend later (works with LaunchDarkly, Flagsmith, etc.).
- **LaunchDarkly** if budget exists and you want zero ops overhead.

For most teams: start with Unleash or Flagsmith (both self-hostable, open-source).


<br><br>
