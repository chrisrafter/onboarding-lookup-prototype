// DataBlueprint onboarding server
// v1: POST /api/lookup  { company }  — real company lookup (web search + LLM)
// v2: POST /api/simulate { industry } — industry simulation aha (library or LLM-generated)

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { lookupAnthropic, simulateGenerated } from "./providers/anthropic.js";
import { lookupMock } from "./providers/mock.js";
import { simulateFromLibrary, GENERIC_FALLBACK } from "./providers/simulated.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json({ limit: "16kb" }));
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 8080;
const PROVIDER = process.env.LOOKUP_PROVIDER ||
  (process.env.ANTHROPIC_API_KEY ? "anthropic" : "mock");

// tiny in-memory caches + naive per-IP rate limit (prototype-grade)
const lookupCache = new Map();
const simCache    = new Map();
const hits        = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const w = hits.get(ip) || [];
  const recent = w.filter(t => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 30; // 30 req / minute / IP
}

app.get("/api/health", (_req, res) =>
  res.json({ ok: true, provider: PROVIDER }));

// ── v1: real company lookup ────────────────────────────────────────────────
app.post("/api/lookup", async (req, res) => {
  const company = (req.body?.company || "").toString().trim();
  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.ip;
  if (rateLimited(ip)) return res.status(429).json({ error: "rate_limited" });
  if (company.length < 2) return res.status(400).json({ error: "too_short" });

  const key = company.toLowerCase();
  if (lookupCache.has(key)) return res.json({ ...lookupCache.get(key), cached: true });

  try {
    let result;
    if (PROVIDER === "anthropic") result = await lookupAnthropic(company);
    else result = await lookupMock(company);
    result.provider = PROVIDER;
    lookupCache.set(key, result);
    res.json(result);
  } catch (e) {
    console.error("lookup error:", e?.message || e);
    res.json({ found: false, name: company, synopsis: "", facts: {}, provider: PROVIDER, error: "lookup_failed" });
  }
});

// ── v2: industry simulation ────────────────────────────────────────────────
app.post("/api/simulate", async (req, res) => {
  const industry = (req.body?.industry || "").toString().trim();
  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.ip;
  if (rateLimited(ip)) return res.status(429).json({ error: "rate_limited" });
  if (industry.length < 2) return res.status(400).json({ error: "too_short" });

  const key = industry.toLowerCase();
  if (simCache.has(key)) return res.json({ ...simCache.get(key), cached: true });

  // 1. Try the hand-authored library first (instant, free, hallucination-safe)
  const fromLib = simulateFromLibrary(industry);
  if (fromLib) {
    simCache.set(key, fromLib);
    return res.json(fromLib);
  }

  // 2. Library miss — try LLM generation if key available
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const result = await simulateGenerated(industry);
      result.simulated = true;
      simCache.set(key, result);
      return res.json(result);
    } catch (e) {
      console.error("simulate generate error:", e?.message || e);
      // fall through to generic fallback
    }
  }

  // 3. Generic fallback — always something, never a blank screen
  const fallback = { ...GENERIC_FALLBACK, industry, source: "library-fallback" };
  res.json(fallback);
});

app.listen(PORT, () =>
  console.log(`DataBlueprint onboarding server on :${PORT} (provider=${PROVIDER})`));
