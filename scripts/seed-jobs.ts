import type { Company, Job } from "../src/lib/types";
import { buildJobSlug } from "../src/lib/format";
import { readJson, writeJson } from "./io";
import "./seed-companies";

const companies = await readJson<Company[]>("src/content/data/companies.json", []);
const roleFamilies: Job["role_family"][] = ["fde", "solutions_engineer", "deployed_engineer", "ai_engineer", "other"];
const titles = [
  "Forward Deployed Engineer",
  "AI Solutions Engineer",
  "Deployed AI Engineer",
  "Customer Engineering Lead",
  "Strategic Deployment Engineer",
  "Solutions Architect, AI",
  "Field Engineer, Enterprise AI",
  "Implementation Engineer"
];
const locationSets = [
  ["London", "Hybrid"],
  ["New York", "Hybrid"],
  ["San Francisco", "Onsite"],
  ["Remote", "EMEA"],
  ["Washington DC", "Onsite"],
  ["Paris", "Hybrid"],
  ["Singapore", "Hybrid"],
  ["Remote", "United States"]
];
const travelBands: Job["travel_pct_band"][] = ["none", "low_0_25", "med_25_50", "high_50_plus"];
const facingBands: Job["customer_facing_pct_band"][] = ["low_0_25", "med_25_50", "high_50_plus"];
const benefits = ["visa sponsorship", "parental leave", "healthcare", "401k", "relocation", "learning budget"];
const now = new Date();

const jobs: Job[] = Array.from({ length: 520 }, (_, index) => {
  const company = companies[index % companies.length];
  const title = titles[index % titles.length];
  const locations = locationSets[index % locationSets.length];
  const posted = new Date(now.getTime() - (index % 45) * 864e5);
  const compMin = 110000 + (index % 12) * 10000;
  const compMax = compMin + 45000 + (index % 4) * 10000;
  const currency: Job["comp_currency"] = locations.includes("London") ? "GBP" : locations.includes("Paris") ? "EUR" : "USD";

  return {
    slug: `${buildJobSlug(company, title, locations, posted)}-${index}`,
    company_slug: company.slug,
    title,
    role_family: roleFamilies[index % roleFamilies.length],
    location_type: locations.includes("Remote") ? "remote" : locations.includes("Hybrid") ? "hybrid" : "onsite",
    locations,
    travel_pct_band: travelBands[index % travelBands.length],
    customer_facing_pct_band: facingBands[index % facingBands.length],
    comp_base_min: compMin,
    comp_base_max: compMax,
    comp_currency: currency,
    equity_offered: index % 3 !== 0,
    equity_note: index % 3 !== 0 ? "Equity package discussed during process" : null,
    benefits_tags: benefits.filter((_, benefitIndex) => (index + benefitIndex) % 3 === 0),
    description_md: [
      "## About the role",
      "Work with strategic customers to turn ambiguous AI workflows into shipped systems.",
      "",
      "- Prototype product integrations with engineering teams",
      "- Translate deployment lessons into product feedback",
      "- Partner with technical and executive stakeholders"
    ].join("\n"),
    apply_url: `https://example.com/jobs/${index}`,
    source_provider: "manual",
    source_url: null,
    first_seen_at: posted.toISOString(),
    posted_at: posted.toISOString(),
    expires_at: null,
    classifier_confidence: 0.96,
    classifier_reasoning: "Seeded local role with deployment, technical implementation, and customer-facing work.",
    classifier_version: "seed",
    status: "live",
    is_featured: index < 3
  };
});

jobs.sort((a, b) => a.slug.localeCompare(b.slug));
await writeJson("src/content/data/jobs.json", jobs);
await writeJson("src/content/data/ticker.json", [
  {
    id: "seed-stat-1000",
    kind: "milestone",
    text: "LOCAL SEED DATA LOADED FOR DENSITY TESTING",
    url: null,
    published_at: now.toISOString(),
    expires_at: new Date(now.getTime() + 365 * 864e5).toISOString(),
    is_pinned: true
  },
  {
    id: "seed-news-ai",
    kind: "news",
    text: "AI LABS EXPAND FORWARD DEPLOYED TEAMS",
    url: null,
    published_at: now.toISOString(),
    expires_at: new Date(now.getTime() + 30 * 864e5).toISOString(),
    is_pinned: false
  }
]);
console.log(`Seeded ${jobs.length} local jobs.`);
