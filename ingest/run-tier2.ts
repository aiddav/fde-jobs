import { commitAndPush } from "./lib/git";
import { benchmarkBaseComp } from "./lib/comp";
import { readCompanies, readJobs, readLastSeen, writeJobs, writeLastSeen } from "./lib/persist";
import type { IngestSummary, SourceAdapter } from "./lib/types";
import { workable } from "./sources/workable";
import { workday } from "./sources/workday";

const adapters: Record<string, SourceAdapter> = { workable, workday };
const companies = (await readCompanies()).filter((company) => company.is_active && (company.ats_provider === "workable" || company.ats_provider === "workday"));
const jobs = await readJobs();
const lastSeen = await readLastSeen();
const summary: IngestSummary = { inserted: 0, updated: 0, expired: 0, reviewed: 0, discarded: 0 };

for (const company of companies) {
  const adapter = adapters[company.ats_provider ?? ""];
  if (!adapter) {
    continue;
  }
  const response = await adapter.fetchJobs(company);
  for (const raw of response.jobs) {
    const normalised = adapter.normalise(raw, company);
    const now = new Date().toISOString();
    const slug = `${company.slug}-${raw.id}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    if (jobs.some((job) => job.slug === slug)) {
      lastSeen[slug] = now;
      continue;
    }
    const benchmarkComp = benchmarkBaseComp("other", company.stage);
    jobs.push({
      slug,
      company_slug: company.slug,
      title: normalised.title,
      role_family: "other",
      location_type: normalised.location_type,
      locations: normalised.locations,
      travel_pct_band: "none",
      customer_facing_pct_band: "med_25_50",
      comp_base_min: normalised.comp_base_min ?? benchmarkComp.min,
      comp_base_max: normalised.comp_base_max ?? benchmarkComp.max,
      comp_currency: normalised.comp_currency,
      equity_offered: false,
      equity_note: null,
      benefits_tags: [],
      description_md: normalised.description_md,
      apply_url: normalised.apply_url,
      source_provider: normalised.source_provider,
      source_url: normalised.source_url,
      first_seen_at: now,
      posted_at: normalised.posted_at,
      expires_at: null,
      classifier_confidence: 0.5,
      classifier_reasoning: "Tier 2 scaffold requires manual review or classifier pass.",
      classifier_version: "tier2-scaffold",
      status: "review",
      is_featured: false
    });
    lastSeen[slug] = now;
    summary.reviewed += 1;
  }
}

await writeJobs(jobs);
await writeLastSeen(lastSeen);
await commitAndPush("tier2", summary);
console.log(summary);
