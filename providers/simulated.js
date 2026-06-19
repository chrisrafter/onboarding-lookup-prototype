// Simulated company + insight library for the v2 "industry simulation aha" flow.
// All company names are fictional and end with "(sample)" — never real businesses.

const LIBRARY = {
  "hvac / field services": {
    industry: "HVAC / Field Services",
    simulated: true,
    source: "library",
    company: {
      name: "Summit Air Mechanical (sample)",
      synopsis: "A commercial HVAC and field-services contractor serving the greater Tampa Bay area, running installation projects, recurring maintenance contracts, and 24/7 emergency service calls.",
      facts: { industry: "HVAC / Field Services", employees: "~40", hq: "Tampa, FL", founded: "2009", model: "Install + service contracts" }
    },
    insight: {
      title: "Which service lines actually make money?",
      takeaway: "Maintenance contracts quietly carry the business; emergency work is busy but thin.",
      chart: {
        type: "bar", unit: "$", caption: "Profit by service line (simulated)",
        series: [
          { label: "Maintenance contracts", value: 410, highlight: true },
          { label: "Installation", value: 300 },
          { label: "Service calls", value: 180 },
          { label: "Emergency", value: 60, warn: true }
        ]
      },
      table: {
        columns: ["Service line", "Revenue", "Profit", "Margin"],
        rows: [
          ["Maintenance contracts", "$3.1M", "$410K", "13.2%"],
          ["Installation",          "$9.3M", "$300K",  "3.2%"],
          ["Service calls",         "$2.4M", "$180K",  "7.5%"],
          ["Emergency",             "$1.9M",  "$60K",  "3.2%"]
        ]
      },
      exposition: "DataBlueprint connected this company's invoices, jobs, and labor, then attributed cost to each service line. On your real data, this same view would show which of your lines carry your profit — and which quietly drain it."
    }
  },

  "bakery / specialty food": {
    industry: "Bakery / Specialty Food",
    simulated: true,
    source: "library",
    company: {
      name: "Hearth & Crumb Bakery (sample)",
      synopsis: "An artisan bakery with a retail storefront and a growing wholesale route to local cafés.",
      facts: { industry: "Bakery / Specialty Food", employees: "~25", hq: "Tampa, FL", founded: "2014", model: "Retail + wholesale" }
    },
    insight: {
      title: "Which products actually make money?",
      takeaway: "Croissants and sourdough carry the shop; day-old bagel discounting is the biggest margin leak.",
      chart: {
        type: "bar", unit: "$", caption: "Profit by product (simulated)",
        series: [
          { label: "Croissants", value: 64, highlight: true },
          { label: "Sourdough",  value: 52 },
          { label: "Cakes",      value: 30 },
          { label: "Muffins",    value: 18 },
          { label: "Bagels",     value: 9, warn: true }
        ]
      },
      table: {
        columns: ["Product", "Units/wk", "Revenue", "Margin"],
        rows: [
          ["Croissants", "1,200", "$6.0K", "58%"],
          ["Sourdough",    "900", "$4.5K", "54%"],
          ["Cakes",        "140", "$3.9K", "41%"],
          ["Muffins",      "800", "$2.0K", "33%"],
          ["Bagels",     "1,500", "$2.2K",  "9%"]
        ]
      },
      exposition: "DataBlueprint matched this bakery's sales records with ingredient costs and labor by product. On your real sales data, you'd see exactly which items are pulling their weight — and which discounting habits are quietly erasing your margin."
    }
  },

  "marketing agency": {
    industry: "Marketing Agency",
    simulated: true,
    source: "library",
    company: {
      name: "Brightwave Marketing (sample)",
      synopsis: "A full-service marketing agency serving regional B2B and retail clients on retainer and project engagements.",
      facts: { industry: "Marketing Agency", employees: "~15", hq: "Tampa, FL", founded: "2016", model: "Retainer + project" }
    },
    insight: {
      title: "Which clients are actually profitable?",
      takeaway: "Top two retainer clients drive ~60% of profit; one flagship project client is unprofitable from scope creep.",
      chart: {
        type: "bar", unit: "$", caption: "Profit by client (simulated)",
        series: [
          { label: "Client A", value: 70, highlight: true },
          { label: "Client B", value: 48 },
          { label: "Client C", value: 22 },
          { label: "Client D", value: 12 },
          { label: "Client E", value: -15, warn: true }
        ]
      },
      table: {
        columns: ["Client", "Type", "Revenue", "Margin"],
        rows: [
          ["Client A", "Retainer", "$480K",  "32%"],
          ["Client B", "Retainer", "$360K",  "28%"],
          ["Client C", "Project",  "$210K",  "14%"],
          ["Client D", "Project",  "$160K",   "9%"],
          ["Client E", "Project",  "$300K",  "-5%"]
        ]
      },
      exposition: "DataBlueprint attributed time, overhead, and deliverable costs to each client engagement. On your real data, you'd see which retainer relationships are genuinely profitable and which project clients generate revenue but erode margin through scope creep and unbilled hours."
    }
  },

  "professional services / accounting": {
    industry: "Professional Services / Accounting",
    simulated: true,
    source: "library",
    company: {
      name: "Ledgerline CPA Group (sample)",
      synopsis: "A CPA firm offering tax preparation, bookkeeping, and advisory/CFO services to small and mid-market businesses.",
      facts: { industry: "Professional Services / Accounting", employees: "~20", hq: "Tampa, FL", founded: "2008", model: "Tax + advisory" }
    },
    insight: {
      title: "Which services earn their keep?",
      takeaway: "Advisory is the highest-margin service; high-volume tax prep is thin; bookkeeping is roughly break-even.",
      chart: {
        type: "bar", unit: "$", caption: "Profit by service (simulated)",
        series: [
          { label: "Advisory/CFO", value: 60, highlight: true },
          { label: "Tax prep",     value: 34 },
          { label: "Audit support",value: 20 },
          { label: "Bookkeeping",  value: 6, warn: true }
        ]
      },
      table: {
        columns: ["Service", "Revenue", "Margin", "Realization"],
        rows: [
          ["Advisory/CFO",  "$620K", "41%", "92%"],
          ["Tax prep",      "$940K", "12%", "71%"],
          ["Audit support", "$300K", "18%", "80%"],
          ["Bookkeeping",   "$410K",  "3%", "64%"]
        ]
      },
      exposition: "DataBlueprint connected this firm's billing data, time records, and overhead allocation to surface margin by service line. On your real data, this view would show where to shift capacity to improve realization and accelerate the mix toward advisory work."
    }
  },

  "specialty contracting / construction": {
    industry: "Specialty Contracting / Construction",
    simulated: true,
    source: "library",
    company: {
      name: "Ironwood Builders (sample)",
      synopsis: "A commercial specialty contractor running multiple concurrent build projects across office, retail, and municipal sectors.",
      facts: { industry: "Specialty Contracting / Construction", employees: "~35", hq: "Tampa, FL", founded: "2011", model: "Project-based" }
    },
    insight: {
      title: "Which jobs are eroding your margin?",
      takeaway: "Two of seven active jobs are eating their projected margin — both through unbilled change orders.",
      chart: {
        type: "bar", unit: "%", caption: "Margin vs. plan by job (% pts, simulated)",
        series: [
          { label: "Job 1", value: 4, highlight: true },
          { label: "Job 2", value: 2 },
          { label: "Job 3", value: 0 },
          { label: "Job 4", value: -3, warn: true },
          { label: "Job 5", value: 1 },
          { label: "Job 6", value: -6, warn: true },
          { label: "Job 7", value: 3 }
        ]
      },
      table: {
        columns: ["Job", "Contract", "Margin plan", "Margin actual"],
        rows: [
          ["Job 1 — Office Fit-out",  "$1.2M", "18%", "22%"],
          ["Job 2 — Retail Reno",     "$840K", "15%", "17%"],
          ["Job 3 — Warehouse Shell", "$2.1M", "12%", "12%"],
          ["Job 4 — Hotel Lobby",     "$1.9M", "16%", "13%"],
          ["Job 5 — Medical Suite",   "$680K", "20%", "21%"],
          ["Job 6 — Mixed-use Base",  "$3.4M", "14%",  "8%"],
          ["Job 7 — School Reno",     "$1.1M", "17%", "20%"]
        ]
      },
      exposition: "DataBlueprint combined job-costing records, PO logs, and time sheets to track margin vs. plan per project in real time. On your real data, you'd see exactly where change-order leakage and unbilled extras are silently eroding the jobs you thought were on track."
    }
  }
};

export const GENERIC_FALLBACK = {
  industry: "Business",
  simulated: true,
  source: "library",
  company: {
    name: "Northwind Trading Co. (sample)",
    synopsis: "A diversified small business with multiple revenue streams across product sales, service work, and recurring client accounts.",
    facts: { industry: "Small Business", employees: "~30", hq: "Tampa, FL", founded: "2010", model: "Product + services" }
  },
  insight: {
    title: "Which revenue streams carry the business?",
    takeaway: "Product sales bring the most revenue, but service work carries the best margin.",
    chart: {
      type: "bar", unit: "$", caption: "Profit by segment (simulated)",
      series: [
        { label: "Service work",       value: 55, highlight: true },
        { label: "Product sales",      value: 40 },
        { label: "Recurring accounts", value: 30 },
        { label: "One-off projects",   value: 10, warn: true }
      ]
    },
    table: {
      columns: ["Segment", "Revenue", "Profit", "Margin"],
      rows: [
        ["Service work",       "$1.4M", "$220K", "15.7%"],
        ["Product sales",      "$3.2M", "$160K",  "5.0%"],
        ["Recurring accounts", "$880K", "$120K", "13.6%"],
        ["One-off projects",   "$510K",  "$40K",  "7.8%"]
      ]
    },
    exposition: "DataBlueprint connected this business's sales, invoices, and cost records to show profit by segment. If this were your business, you'd see exactly which areas carry your margins — and where to focus for the highest return on your effort."
  }
};

export function simulateFromLibrary(industry) {
  if (!industry) return GENERIC_FALLBACK;
  const key = industry.toLowerCase().trim();
  if (LIBRARY[key]) return LIBRARY[key];
  for (const [k, v] of Object.entries(LIBRARY)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  return null;
}

export function getLibraryKeys() {
  return Object.values(LIBRARY).map(v => v.industry);
}
