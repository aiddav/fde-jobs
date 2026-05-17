import type { Company } from "../src/lib/types";
import { slugify } from "../src/lib/format";
import { writeJson } from "./io";

const categories = [
  {
    tags: ["frontier ai", "research"],
    names: ["OpenAI", "Anthropic", "Google DeepMind", "Cohere", "Mistral AI", "AI21 Labs", "Reka", "xAI", "Perplexity", "Adept"]
  },
  {
    tags: ["ai applications", "enterprise"],
    names: ["Sierra", "Decagon", "Harvey", "Glean", "Hebbia", "Cresta", "Writer", "Tessl", "Mem", "Imbue", "Magic", "Cognition", "Factory", "Poolside", "Cursor", "Codeium", "Sourcegraph", "Replit", "Lindy", "Airtable AI"]
  },
  {
    tags: ["defense", "dual-use"],
    names: ["Anduril", "Shield AI", "Helsing", "Palantir", "Saronic", "Saildrone", "Vannevar Labs", "Applied Intuition", "Epirus", "Skydio", "Forterra", "Hadrian"]
  },
  {
    tags: ["ai infra", "data"],
    names: ["Databricks", "Snowflake", "Modal", "Together AI", "Anyscale", "Lightning AI", "Replicate", "Fireworks AI", "LangChain", "Weights & Biases", "Pinecone", "Chroma", "Baseten", "Tecton", "MotherDuck", "Fivetran", "dbt Labs"]
  },
  {
    tags: ["vertical ai", "regulated"],
    names: ["Abridge", "Tessera", "Hippocratic AI", "Pillar", "EvenUp", "Casetext", "Spellbook", "Norm AI", "Regie.ai", "Ambience Healthcare", "Nabla", "Anysphere Health"]
  },
  {
    tags: ["fintech", "operations"],
    names: ["Ramp", "Mercury", "Stripe", "Brex", "Modern Treasury", "Airwallex", "Adyen", "Plaid", "Persona", "Rippling", "Watershed", "Vanta"]
  }
];

const atsHints: Record<string, Pick<Company, "ats_provider" | "ats_slug">> = {
  openai: { ats_provider: "ashby", ats_slug: "openai" },
  anthropic: { ats_provider: "greenhouse", ats_slug: "anthropic" },
  sierra: { ats_provider: "ashby", ats_slug: "sierra" },
  decagon: { ats_provider: "ashby", ats_slug: "decagon" },
  harvey: { ats_provider: "ashby", ats_slug: "harvey" },
  glean: { ats_provider: "greenhouse", ats_slug: "gleanwork" },
  anduril: { ats_provider: "greenhouse", ats_slug: "andurilindustries" },
  ramp: { ats_provider: "ashby", ats_slug: "ramp" },
  mercury: { ats_provider: "greenhouse", ats_slug: "mercury" },
  stripe: { ats_provider: "custom", ats_slug: "stripe" },
  databricks: { ats_provider: "greenhouse", ats_slug: "databricks" },
  modal: { ats_provider: "ashby", ats_slug: "modal" },
  "together-ai": { ats_provider: "greenhouse", ats_slug: "togetherai" },
  cursor: { ats_provider: "ashby", ats_slug: "cursor" },
  baseten: { ats_provider: "ashby", ats_slug: "baseten" },
  "fireworks-ai": { ats_provider: "greenhouse", ats_slug: "fireworksai" }
};

const stages: Company["stage"][] = ["seed", "series_a", "series_b", "series_c", "series_d_plus", "public", "gov_defense", "bootstrapped"];
const headcounts: Company["headcount_band"][] = ["11-50", "51-200", "201-500", "501-1000", "1000+"];
const stageHints: Record<string, Company["stage"]> = {
  anduril: "gov_defense",
  databricks: "series_d_plus",
  openai: "series_d_plus",
  anthropic: "series_d_plus",
  palantir: "public",
  snowflake: "public",
  stripe: "public"
};

const companies: Company[] = categories.flatMap((category, categoryIndex) =>
  category.names.map((name, index) => {
    const slug = slugify(name);
    const hint = atsHints[slug] ?? { ats_provider: null, ats_slug: null };
    return {
      slug,
      name,
      logo_url: null,
      stage: stageHints[slug] ?? stages[(categoryIndex + index) % stages.length],
      headcount_band: headcounts[(categoryIndex + index) % headcounts.length],
      industry_tags: category.tags,
      ats_provider: hint.ats_provider,
      ats_slug: hint.ats_slug,
      custom_scraper_id: hint.ats_provider === "custom" ? slug : null,
      is_active: true,
      notes: null
    };
  })
);

const initialCount = companies.length;
for (let index = initialCount; index < 200; index += 1) {
  const number = index - initialCount + 1;
  companies.push({
    slug: `stealth-ai-operator-${number}`,
    name: `Stealth AI Operator ${number}`,
    logo_url: null,
    stage: stages[index % stages.length],
    headcount_band: headcounts[index % headcounts.length],
    industry_tags: ["ai applications", "enterprise"],
    ats_provider: null,
    ats_slug: null,
    custom_scraper_id: null,
    is_active: false,
    notes: "Placeholder seed company for local density testing."
  });
}

companies.sort((a, b) => a.slug.localeCompare(b.slug));
await writeJson("src/content/data/companies.json", companies);
console.log(`Seeded ${companies.length} companies.`);
