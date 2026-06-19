// Mock provider: lets the app run with zero keys so the team can see the flow.
// Names containing "zzz" or "qqq" return the no-result fallback for demoing that path.

const CANNED = {
  "acme mechanical": {
    found: true, name: "Acme Mechanical",
    synopsis: "Acme Mechanical is a commercial HVAC and field-services contractor serving the Tampa Bay area, focused on installation, maintenance, and 24/7 service contracts.",
    facts: { industry: "HVAC / Field Services", employees: "~40", hq: "Tampa, FL", founded: "2009", website: "acme-mech.com" }
  },
  "bakemorepies": {
    found: true, name: "BakeMorePies",
    synopsis: "BakeMorePies is a Tampa-based marketing firm that builds analytics and reporting for its own clients across retail and services.",
    facts: { industry: "Marketing / Agency", employees: "~15", hq: "Tampa, FL", founded: "2016", website: "bakemorepies.com" }
  }
};

export async function lookupMock(company) {
  await new Promise(r => setTimeout(r, 650)); // simulate latency
  const key = company.toLowerCase().trim();
  if (/zzz|qqq/.test(key)) {
    return { found: false, name: company, synopsis: "", facts: {} };
  }
  if (CANNED[key]) return CANNED[key];
  // generic plausible synthesis for any other name
  return {
    found: true,
    name: company,
    synopsis: `${company} appears to be a small-to-mid-sized business. (Mock data — connect a real provider to verify and enrich this.)`,
    facts: { industry: "Unknown (mock)", employees: "", hq: "", founded: "", website: "" }
  };
}
