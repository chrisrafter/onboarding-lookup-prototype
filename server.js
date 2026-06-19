// DataBlueprint onboarding — company-lookup prototype server
// One endpoint: POST /api/lookup { company } -> { found, name, synopsis, facts:{...}, source }
// Provider is pluggable. Defaults to the mock provider when no API key is present,
// so the app runs out of the box. Set LOOKUP_PROVIDER=anthropic + ANTHROPIC_API_KEY for real lookups.

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { lookupAnthropic } from "./providers/anthropic.js";
import { lookupMock } from "./providers/mock.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json({ limit: "16kb" }));
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 8080;
const PROVIDER = process.env.LOOKUP_PROVIDER ||
  (process.env.ANTHROPIC_API_KEY ? "anthropic" : "mock");

// tiny in-memory cache + naive per-IP rate limit (prototype-grade)
const cache = new Map();
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const w = hits.get(ip) || [];
  const recent = w.filter(t => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 30; // 30 lookups / minute / IP
}

app.get("/api/health", (_req, res) =>
  res.json({ ok: true, provider: PROVIDER }));

app.post("/api/lookup", async (req, res) => {
  const company = (req.body?.company || "").toString().trim();
  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.ip;
  if (rateLimited(ip)) return res.status(429).json({ error: "rate_limited" });
  if (company.length < 2) return res.status(400).json({ error: "too_short" });

  const key = company.toLowerCase();
  if (cache.has(key)) return res.json({ ...cache.get(key), cached: true });

  try {
    let result;
    if (PROVIDER === "anthropic") result = await lookupAnthropic(company);
    else result = await lookupMock(company);
    result.provider = PROVIDER;
    cache.set(key, result);
    res.json(result);
  } catch (e) {
    console.error("lookup error:", e?.message || e);
    // graceful fallback so the UI always has the reassuring no-result path
    res.json({
      found: false,
      name: company,
      synopsis: "",
      facts: {},
      provider: PROVIDER,
      error: "lookup_failed"
    });
  }
});

app.listen(PORT, () =>
  console.log(`DataBlueprint lookup prototype on :${PORT} (provider=${PROVIDER})`));
