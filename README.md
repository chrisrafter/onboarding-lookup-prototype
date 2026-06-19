# DataBlueprint — Onboarding Company-Lookup Prototype

A tiny web app that tests the **Stage-2 "it already knows my business" aha moment**: a user types
their company name, and the app looks it up (LLM + live web search) and reads back a synopsis plus
fact cards (industry, size, HQ, founded, website).

Frontend: `public/index.html` (the Stage-2 screen).
Backend: `server.js` + `providers/` (one endpoint, pluggable lookup source).

---

## Run locally (keyless — mock data)

```bash
npm install
npm start
# open http://localhost:8080
```

Runs in **mock mode** with no API key. Try `Acme Mechanical` or `BakeMorePies` for canned results,
any other name for a generic result, and a name containing `zzz` to see the no-result fallback.

## Run with real lookups (LLM + web search)

```bash
cp .env.example .env
# edit .env and set ANTHROPIC_API_KEY=...  (do NOT commit .env)
npm start
```

With a key present the provider switches to `anthropic` automatically. Each lookup asks Claude to
web-search the company and return a normalized JSON record; the server caches results in memory.

## Deploy to your VPS

```bash
# on the VPS, as a deploy user
git clone <your-repo-url> datablueprint-lookup && cd datablueprint-lookup
npm install --omit=dev
cp .env.example .env && nano .env       # set ANTHROPIC_API_KEY
# run under a process manager:
npm i -g pm2 && pm2 start server.js --name dblp-lookup && pm2 save
```

Put it behind nginx (TLS via certbot) using `deploy/nginx.conf.example`, or run it as a service
with `deploy/datablueprint-lookup.service`. Both are documented inline.

**Secrets:** the API key lives only in the VPS `.env` (git-ignored). Never paste it into chat,
commit it, or expose it to the browser — all lookups go through the server.

## What to look for during testing

- Accuracy on **small/local SMBs** (the real ICP) vs. well-known companies.
- Latency per lookup (shown under the result).
- No-result handling — does the reassuring fallback fire gracefully?
- Use the 👍 / 👎 buttons to tally accuracy as you test (stored in your browser).

## Endpoint

`POST /api/lookup  { "company": "Acme Mechanical" }` →
```json
{ "found": true, "name": "...", "synopsis": "...",
  "facts": { "industry":"", "employees":"", "hq":"", "founded":"", "website":"" },
  "provider": "anthropic" }
```
`GET /api/health` → `{ ok, provider }`
