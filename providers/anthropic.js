// Anthropic provider: company lookup (v1, web search) + simulation generation (v2).
// Requires env ANTHROPIC_API_KEY. Model configurable via ANTHROPIC_MODEL.

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";
const MAX_SEARCHES = Number(process.env.MAX_SEARCHES || 4);

const SYSTEM = `You are a company-enrichment service for a business-analytics onboarding flow.
Given a company or organization name, use web search to identify the most likely real organization the user means.
Then respond with ONLY a single JSON object (no prose, no markdown fences) in exactly this shape:
{
  "found": true | false,
  "name": "<canonical company name>",
  "synopsis": "<1-2 plain-English sentences a non-technical owner would recognize as their business>",
  "facts": {
    "industry": "<short industry/sector or empty string>",
    "employees": "<approx headcount or size band, or empty string>",
    "hq": "<city, state/country, or empty string>",
    "founded": "<year or empty string>",
    "website": "<primary domain or empty string>"
  }
}
Rules:
- If you cannot confidently identify a real organization, set "found": false and leave fields empty. Do not invent facts.
- Prefer the interpretation a small/mid-sized business owner would mean. Keep the synopsis warm and specific.
- Output the JSON object and nothing else.`;

export async function lookupAnthropic(company) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");

  const body = {
    model: MODEL,
    max_tokens: 700,
    system: SYSTEM,
    tools: [{ type: "web_search_20250305", name: "web_search", max_uses: MAX_SEARCHES }],
    messages: [{ role: "user", content: `Company to look up: "${company}"` }]
  };

  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify(body)
  });

  if (!resp.ok) {
    const t = await resp.text();
    throw new Error(`anthropic ${resp.status}: ${t.slice(0, 300)}`);
  }
  const data = await resp.json();
  const text = (data.content || [])
    .filter(b => b.type === "text")
    .map(b => b.text)
    .join("\n")
    .trim();

  const parsed = extractJson(text);
  if (!parsed) return { found: false, name: company, synopsis: "", facts: {} };

  // normalize
  return {
    found: !!parsed.found,
    name: parsed.name || company,
    synopsis: parsed.synopsis || "",
    facts: {
      industry: parsed.facts?.industry || "",
      employees: parsed.facts?.employees || "",
      hq: parsed.facts?.hq || "",
      founded: parsed.facts?.founded || "",
      website: parsed.facts?.website || ""
    }
  };
}

// ── Simulation generation (v2) ─────────────────────────────────────────────
// Returns the same JSON contract as the library entries in providers/simulated.js.
const SIMULATE_SYSTEM = `You are a business-analytics demo generator.
Given an industry name, invent a clearly fictional small-to-mid-sized business in that industry
and generate one representative DataBlueprint-style profitability insight for it.

RULES:
- The company name MUST be invented and MUST end with "(sample)". Never use a real company name.
- All financial figures are entirely fictional and clearly simulated.
- Return ONLY a single valid JSON object — no prose, no markdown fences, nothing else.
- The JSON must match this exact shape:
{
  "industry": "<the industry provided>",
  "simulated": true,
  "source": "generated",
  "company": {
    "name": "<Invented Name (sample)>",
    "synopsis": "<1-2 plain-English sentences describing the fictional business>",
    "facts": {
      "industry": "<industry>",
      "employees": "<~N>",
      "hq": "<City, ST>",
      "founded": "<year>",
      "model": "<business model, e.g. Retainer + project>"
    }
  },
  "insight": {
    "title": "<short question like 'Which X actually make money?'>",
    "takeaway": "<one sentence summary of the key finding>",
    "chart": {
      "type": "bar",
      "unit": "$",
      "caption": "<chart title> (simulated)",
      "series": [
        { "label": "<label>", "value": <integer>, "highlight": true },
        { "label": "<label>", "value": <integer> },
        { "label": "<label>", "value": <integer>, "warn": true }
      ]
    },
    "table": {
      "columns": ["<col1>", "<col2>", "<col3>", "<col4>"],
      "rows": [
        ["<v>", "<v>", "<v>", "<v>"]
      ]
    },
    "exposition": "<2-3 sentences about how DataBlueprint built this insight, using conditional language like 'on your real data...' or 'if this were your business...'. Never claim the numbers belong to the user.>"
  }
}
Chart series: 4-7 items. One item must have highlight:true (best performer). One or two should have warn:true (problem areas). Values are relative integers used for bar height scaling — keep them proportional but in a 1-500 range.`;

export async function simulateGenerated(industry) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");

  const body = {
    model: MODEL,
    max_tokens: 1500,
    system: SIMULATE_SYSTEM,
    messages: [{ role: "user", content: `Generate a simulated company and profitability insight for this industry: "${industry}"` }]
  };

  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify(body)
  });

  if (!resp.ok) {
    const t = await resp.text();
    throw new Error(`anthropic ${resp.status}: ${t.slice(0, 300)}`);
  }
  const data = await resp.json();
  const text = (data.content || [])
    .filter(b => b.type === "text")
    .map(b => b.text)
    .join("\n")
    .trim();

  const parsed = extractJson(text);
  if (!parsed || !parsed.company || !parsed.insight) {
    throw new Error("Invalid simulation response shape");
  }
  return parsed;
}

function extractJson(text) {
  if (!text) return null;
  try { return JSON.parse(text); } catch {}
  const m = text.match(/\{[\s\S]*\}/);
  if (m) { try { return JSON.parse(m[0]); } catch {} }
  return null;
}
