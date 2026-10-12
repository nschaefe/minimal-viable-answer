#!/usr/bin/env node
/**
 * MVA benchmark: run prompts × 3 modes (default/caveman/mva) against any LLM endpoint.
 * Measures latency + input/output tokens. Writes JSONL + CSV + per-prompt markdown.
 *
 * Config via env (set in .env, loaded with `set -a; source .env; set +a`):
 *   BASE_URL      e.g. https://api.anthropic.com | https://api.openai.com | http://localhost:6655
 *   API_PATH      request path appended to BASE_URL (e.g. /v1/messages, /v1/chat/completions, /anthropic/v1/messages)
 *   API_SHAPE     "anthropic" or "openai" — picks request/response schema
 *   AUTH_HEADER   full auth header line, e.g.
 *                   "x-api-key: $API_KEY" (Anthropic native)
 *                   "Authorization: Bearer $API_KEY" (OpenAI, most proxies)
 *                 use literal "$API_KEY" and it will be substituted
 *   API_KEY       secret value substituted into AUTH_HEADER
 *   MODEL         model id, e.g. claude-sonnet-4-5, gpt-4o-mini
 *   MAX_TOKENS    optional, default 1024
 */
const fs = require("fs");
const path = require("path");

const BASE_URL = process.env.BASE_URL || "https://api.anthropic.com";
const API_PATH = process.env.API_PATH || "/v1/messages";
const API_SHAPE = (process.env.API_SHAPE || "anthropic").toLowerCase();
const API_KEY = process.env.API_KEY || "";
const MODEL = process.env.MODEL || "claude-sonnet-4-5";
const MAX_TOKENS = parseInt(process.env.MAX_TOKENS || "1024", 10);
const AUTH_HEADER_RAW = process.env.AUTH_HEADER || (API_SHAPE === "anthropic" ? "x-api-key: $API_KEY" : "Authorization: Bearer $API_KEY");

if (!API_KEY && !process.argv.includes("--report-only")) {
  console.error("API_KEY not set");
  process.exit(1);
}

const URL = `${BASE_URL.replace(/\/+$/, "")}${API_PATH.startsWith("/") ? API_PATH : "/" + API_PATH}`;

function buildHeaders() {
  const h = { "Content-Type": "application/json" };
  const line = AUTH_HEADER_RAW.replace("$API_KEY", API_KEY);
  const idx = line.indexOf(":");
  if (idx > 0) h[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  if (API_SHAPE === "anthropic") h["anthropic-version"] = process.env.ANTHROPIC_VERSION || "2023-06-01";
  return h;
}
const HEADERS = buildHeaders();

const ROOT = __dirname;
const SYSTEMS = {
  default: fs.readFileSync(path.join(ROOT, "systems/default.txt"), "utf8"),
  caveman: fs.readFileSync(path.join(ROOT, "systems/caveman.txt"), "utf8"),
  mva: fs.readFileSync(path.join(ROOT, "systems/mva.txt"), "utf8"),
};
const PROMPTS = JSON.parse(fs.readFileSync(path.join(ROOT, "prompts.json"), "utf8"));

async function callOpenAI(system, user) {
  const res = await fetch(URL, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      messages: [
        ...(system ? [{ role: "system", content: system }] : []),
        { role: "user", content: user },
      ],
    }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0, 500)}`);
  const data = JSON.parse(text);
  return {
    text: data.choices?.[0]?.message?.content ?? "",
    inputTokens: data.usage?.prompt_tokens ?? null,
    outputTokens: data.usage?.completion_tokens ?? null,
  };
}

async function callAnthropic(system, user) {
  const res = await fetch(URL, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      ...(system ? { system } : {}),
      messages: [{ role: "user", content: user }],
    }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0, 500)}`);
  const data = JSON.parse(text);
  return {
    text: data.content?.map((c) => c.text).join("") ?? "",
    inputTokens: data.usage?.input_tokens ?? null,
    outputTokens: data.usage?.output_tokens ?? null,
  };
}

const call = API_SHAPE === "anthropic" ? callAnthropic : callOpenAI;

function writeReports(outDir, rows) {
  const csv = [
    "id,mode,latencyMs,inputTokens,outputTokens,chars,error",
    ...rows.map((r) =>
      [r.id, r.mode, r.latencyMs, r.inputTokens ?? "", r.outputTokens ?? "", r.chars, r.error ? JSON.stringify(r.error) : ""].join(","),
    ),
  ].join("\n");
  fs.writeFileSync(path.join(outDir, "runs.csv"), csv);

  const modes = ["default", "caveman", "mva"];
  const agg = modes.map((m) => {
    const rs = rows.filter((r) => r.mode === m && !r.error);
    const sum = (k) => rs.reduce((a, r) => a + (r[k] || 0), 0);
    const n = rs.length || 1;
    return {
      mode: m,
      n: rs.length,
      avgLatencyMs: Math.round(sum("latencyMs") / n),
      avgInputTokens: Math.round(sum("inputTokens") / n),
      avgOutputTokens: Math.round(sum("outputTokens") / n),
      avgChars: Math.round(sum("chars") / n),
      totalOutputTokens: sum("outputTokens"),
      totalLatencyMs: sum("latencyMs"),
    };
  });

  const md = [];
  md.push(`# MVA Benchmark — ${path.basename(outDir)}\n`);
  md.push(`Model: \`${MODEL}\` · Shape: \`${API_SHAPE}\` · URL: \`${URL}\`\n`);
  md.push(`## Aggregates\n`);
  md.push(`| mode | n | avg latency (ms) | avg in tok | avg out tok | avg chars | total out tok | total latency (ms) |`);
  md.push(`|---|---|---|---|---|---|---|---|`);
  for (const a of agg) {
    md.push(
      `| ${a.mode} | ${a.n} | ${a.avgLatencyMs} | ${a.avgInputTokens} | ${a.avgOutputTokens} | ${a.avgChars} | ${a.totalOutputTokens} | ${a.totalLatencyMs} |`,
    );
  }
  md.push(`\n## Per-prompt responses\n\nOne file per prompt in \`prompts/\`.\n`);
  for (const p of PROMPTS) {
    const r = (m) => rows.find((x) => x.id === p.id && x.mode === m);
    const stat = (x) => (x ? `latency=${x.latencyMs}ms · in=${x.inputTokens} · out=${x.outputTokens} · chars=${x.chars}` : "n/a");
    md.push(`- [${p.id}](prompts/${p.id}.md)`);
    const page = [];
    page.push(`# ${p.id}\n`);
    page.push(`\n═══════════════════════════════════════════════════════════════\n`);
    page.push(`## 📝 PROMPT\n`);
    page.push(`═══════════════════════════════════════════════════════════════\n`);
    page.push(`\n> ${p.prompt.replace(/\n/g, "\n> ")}\n`);
    for (const m of modes) {
      const x = r(m);
      page.push(`\n\n\n═══════════════════════════════════════════════════════════════\n`);
      page.push(`## 🔹 MODE: ${m.toUpperCase()}\n`);
      page.push(`═══════════════════════════════════════════════════════════════\n`);
      page.push(`\n_${stat(x)}_\n`);
      page.push(`\n<br>\n`);
      if (x?.error) {
        page.push(`**ERROR:** ${x.error}\n`);
      } else {
        page.push(x?.response || "_(empty)_");
        page.push("\n\n<br><br>\n");
      }
    }
    const promptsDir = path.join(outDir, "prompts");
    fs.mkdirSync(promptsDir, { recursive: true });
    fs.writeFileSync(path.join(promptsDir, `${p.id}.md`), page.join("\n"));
  }
  fs.writeFileSync(path.join(outDir, "report.md"), md.join("\n"));
  console.table(agg);
}

async function run() {
  const reportOnlyIdx = process.argv.indexOf("--report-only");
  if (reportOnlyIdx !== -1) {
    const dir = process.argv[reportOnlyIdx + 1];
    if (!dir) {
      console.error("--report-only requires a results dir");
      process.exit(1);
    }
    const outDir = path.isAbsolute(dir) ? dir : path.join(process.cwd(), dir);
    const rows = fs.readFileSync(path.join(outDir, "runs.jsonl"), "utf8").trim().split("\n").map((l) => JSON.parse(l));
    writeReports(outDir, rows);
    console.log(`Rebuilt reports in ${outDir}`);
    return;
  }

  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  const outDir = path.join(ROOT, "results", ts);
  fs.mkdirSync(outDir, { recursive: true });
  const jsonl = fs.createWriteStream(path.join(outDir, "runs.jsonl"));
  const rows = [];

  for (const p of PROMPTS) {
    for (const mode of Object.keys(SYSTEMS)) {
      process.stdout.write(`${p.id} / ${mode} ... `);
      const t0 = Date.now();
      let rec;
      try {
        const r = await call(SYSTEMS[mode], p.prompt);
        rec = {
          id: p.id,
          mode,
          latencyMs: Date.now() - t0,
          inputTokens: r.inputTokens,
          outputTokens: r.outputTokens,
          chars: r.text.length,
          response: r.text,
          error: null,
        };
      } catch (e) {
        rec = {
          id: p.id,
          mode,
          latencyMs: Date.now() - t0,
          inputTokens: null,
          outputTokens: null,
          chars: 0,
          response: "",
          error: String(e.message || e),
        };
      }
      jsonl.write(JSON.stringify(rec) + "\n");
      rows.push(rec);
      console.log(
        rec.error
          ? `ERR ${rec.error.slice(0, 80)}`
          : `${rec.latencyMs}ms in=${rec.inputTokens} out=${rec.outputTokens} chars=${rec.chars}`,
      );
    }
  }
  jsonl.end();
  writeReports(outDir, rows);
  console.log(`\nWrote: ${outDir}`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
