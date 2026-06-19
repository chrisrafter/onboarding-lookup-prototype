# DataBlueprint — Onboarding Industry Simulation Prototype (v2)

A web app that delivers the DataBlueprint aha moment **without asking for any identity up front**.
The user picks an industry; the app shows a clearly-labeled simulated company in that industry with
a representative profitability insight. The call to connect real data comes only after value is delivered.

Frontend: `public/index.html` · Backend: `server.js` + `providers/`

---

## Run locally (no API key needed)

```bash
npm install
npm start
# open http://localhost:8080
```

The five core industries (HVAC, Bakery, Marketing Agency, Accounting, Construction) are served from
a hand-authored library — instant, free, no key required. "Other" industries fall back to a generic
example unless `ANTHROPIC_API_KEY` is set.

## Run with LLM generation for "Other" industries

```bash
cp .env.example .env
# edit .env: set ANTHROPIC_API_KEY=...  (do NOT commit .env)
npm start
```

With a key set, selecting "Other" and typing any industry asks Claude to invent a fictional company
and insight in that industry. The result is cached in memory for the session.

## Deploy to your VPS

```bash
git clone <your-repo-url> datablueprint-lookup && cd datablueprint-lookup
npm install --omit=dev
cp .env.example .env && nano .env       # set ANTHROPIC_API_KEY
# run under a process manager:
npm i -g pm2 && pm2 start server.js --name dblp-lookup && pm2 save
```

Put it behind nginx using `deploy/nginx.conf.example`, or as a systemd service with
`deploy/datablueprint-lookup.service`. **Secrets:** the API key lives only in the VPS `.env`
(git-ignored) — never in the browser or git.

## What to look for during testing

- Does the simulated company feel plausible and relevant for each industry?
- Is the disclosure ("SIMULATED EXAMPLE" badge, framing text) unmistakably clear?
- Does "Other" produce a coherent result for niche industries?
- Does the three-screen flow feel natural and low-pressure?

## Endpoints

`POST /api/simulate  { "industry": "HVAC / Field Services" }` →
```json
{
  "industry": "HVAC / Field Services",
  "simulated": true,
  "source": "library",
  "company": { "name": "Summit Air Mechanical (sample)", "synopsis": "...", "facts": { ... } },
  "insight": {
    "title": "...", "takeaway": "...",
    "chart": { "type": "bar", "caption": "... (simulated)", "series": [ ... ] },
    "table": { "columns": [ ... ], "rows": [ ... ] },
    "exposition": "..."
  }
}
```
`source` is `"library"` for the five core industries, `"generated"` for LLM-generated results,
or `"library-fallback"` when no key is set and the industry is unknown.

`POST /api/lookup  { "company": "Acme Mechanical" }` — v1 real company lookup, retained for the
optional opt-in identity step later in the flow.

`GET /api/health` → `{ ok, provider }`
