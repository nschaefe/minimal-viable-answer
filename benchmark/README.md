# MVA Benchmark

Measures latency + token usage for `default` vs `caveman` vs `mva` system prompts across the prompts in `prompts.json`. Works with any LLM endpoint that speaks the Anthropic Messages API or the OpenAI Chat Completions API.

## Setup

```bash
cp .env.example .env
# edit .env — see profiles for Anthropic native, OpenAI, SAP Hai local proxy
```

## Run

```bash
set -a; source .env; set +a
node run.js
```

Writes `results/<timestamp>/`:
- `runs.jsonl` — raw records
- `report.md` — aggregates table
- `prompts/<id>.md` — one file per prompt, prompt + each mode's response

## Rebuild per-prompt files without re-calling the API

```bash
node run.js --report-only results/<timestamp>
```

## Config (env)

| var | purpose |
|---|---|
| `BASE_URL` | API host, e.g. `https://api.anthropic.com` |
| `API_PATH` | path on host, e.g. `/v1/messages` |
| `API_SHAPE` | `anthropic` or `openai` — request/response schema |
| `AUTH_HEADER` | full header line, literal `$API_KEY` is substituted |
| `API_KEY` | secret |
| `MODEL` | model id |
| `MAX_TOKENS` | optional, default 1024 |

## Swap system prompts

`systems/{default,caveman,mva}.txt` — edit or replace. Empty file = no system prompt.
