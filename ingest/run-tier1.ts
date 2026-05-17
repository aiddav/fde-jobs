import type { Job } from "../src/lib/types";
import { CLASSIFIER_VERSION } from "./classifier/prompt";
import { classifyJob } from "./classifier/classify";
import { benchmarkBaseComp } from "./lib/comp";
import { dedupKey, dedupKeyFromNormalised } from "./lib/dedup";
import { toJobSlug } from "./lib/normalise";
import { slugify } from "../src/lib/format";
import { commitAndPush } from "./lib/git";
import {
  readCompanies,
  readEtags,
  readJobs,
  readLastSeen,
  writeEtags,
  writeJobs,
  writeLastSeen
} from "./lib/persist";
import type { IngestSummary, SourceAdapter } from "./lib/types";
import { greenhouse } from "./sources/greenhouse";
import { lever } from "./sources/lever";
import { ashby } from "./sources/ashby";

const adapters: Partial<Record<NonNullable<ReturnType<typeof providerKey>>, SourceAdapter>> = {
  greenhouse,
  lever,
  ashby
};

function providerKey(company: { ats_provider: string | null }) {
  return company.ats_provider === "greenhouse" || company.ats_provider === "lever" || company.ats_provider === "ashby"
    ? company.ats_provider
    : null;
}

function samePersistedFields(existing: Job, next: Job) {
  const ignored = new Set(["first_seen_at"]);
  const existingComparable = Object.fromEntries(Object.entries(existing).filter(([key]) => !ignored.has(key)));
  const nextComparable = Object.fromEntries(Object.entries(next).filter(([key]) => !ignored.has(key)));
  return JSON.stringify(existingComparable) === JSON.stringify(nextComparable);
}

const companies = (await readCompanies()).filter((company) => company.is_active && providerKey(company));
const companyBySlug = new Map(companies.map((company) => [company.slug, company]));
const jobs = await readJobs();
const lastSeen = await readLastSeen();
const etags = await readEtags();
const byDedup = new Map(jobs.map((job) => [dedupKey(job), job]));
const bySlug = new Set(jobs.map((job) => job.slug));
const successfulCompanies = new Set<string>();
const seenThisRun = new Set<string>();
const summary: IngestSummary = { inserted: 0, updated: 0, expired: 0, reviewed: 0, discarded: 0 };

for (const company of companies) {
  const key = providerKey(company);
  if (!key) {
    continue;
  }
  const adapter = adapters[key];
  if (!adapter) {
    continue;
  }

  const etagKey = `${key}:${company.slug}`;
  try {
    const response = await adapter.fetchJobs(company, etags[etagKey]);
    if (response.etag) {
      etags[etagKey] = response.etag;
    }
    if (response.notModified) {
      successfulCompanies.add(company.slug);
      continue;
    }

    for (const raw of response.jobs) {
      const normalised = adapter.normalise(raw, company);
      const classification = await classifyJob({
        title: normalised.title,
        company_name: company.name,
        description: normalised.description_md,
        location: normalised.locations.join(", ")
      });

      if (!classification.is_fde_relevant) {
        summary.discarded += 1;
        continue;
      }

      const status: Job["status"] = classification.confidence >= 0.75 ? "live" : "review";
      if (status === "review") {
        summary.reviewed += 1;
      }

      const benchmarkComp = benchmarkBaseComp(classification.role_family, company.stage);
      const compBaseMin = normalised.comp_base_min ?? classification.comp_base_min_usd ?? benchmarkComp.min;
      const compBaseMax = normalised.comp_base_max ?? classification.comp_base_max_usd ?? benchmarkComp.max;
      const baseSlug = toJobSlug(company, normalised);
      const now = new Date().toISOString();
      const keyForJob = dedupKeyFromNormalised(normalised);
      const existing = byDedup.get(keyForJob);
      let slug = existing?.slug ?? baseSlug;
      if (!existing && bySlug.has(slug)) {
        const suffix = slugify(raw.id || normalised.source_url || now).slice(0, 32) || String(bySlug.size + 1);
        slug = `${baseSlug}-${suffix}`;
        let counter = 2;
        while (bySlug.has(slug)) {
          slug = `${baseSlug}-${suffix}-${counter}`;
          counter += 1;
        }
      }
      const next: Job = {
        slug,
        company_slug: company.slug,
        title: normalised.title,
        role_family: classification.role_family,
        location_type: normalised.location_type,
        locations: normalised.locations,
        travel_pct_band: classification.travel_pct_band,
        customer_facing_pct_band: classification.customer_facing_pct_band,
        comp_base_min: compBaseMin,
        comp_base_max: compBaseMax,
        comp_currency: normalised.comp_currency,
        equity_offered: /equity|stock|options|rsu/i.test(normalised.description_md),
        equity_note: /equity|stock|options|rsu/i.test(normalised.description_md) ? "Equity mentioned in source description" : null,
        benefits_tags: [
          ...(/visa/i.test(normalised.description_md) ? ["visa sponsorship"] : []),
          ...(/parental/i.test(normalised.description_md) ? ["parental leave"] : [])
        ],
        description_md: normalised.description_md || "No description provided by source.",
        apply_url: normalised.apply_url,
        source_provider: normalised.source_provider,
        source_url: normalised.source_url,
        first_seen_at: now,
        posted_at: normalised.posted_at,
        expires_at: null,
        classifier_confidence: classification.confidence,
        classifier_reasoning: classification.reasoning,
        classifier_version: CLASSIFIER_VERSION,
        status,
        is_featured: false
      };

      seenThisRun.add(slug);
      lastSeen[slug] = now;

      if (!existing) {
        jobs.push(next);
        byDedup.set(keyForJob, next);
        bySlug.add(slug);
        summary.inserted += 1;
      } else {
        lastSeen[existing.slug] = now;
        const merged = { ...existing, ...next, slug: existing.slug, first_seen_at: existing.first_seen_at };
        if (!samePersistedFields(existing, merged)) {
          Object.assign(existing, merged);
          summary.updated += 1;
        }
      }
    }

    successfulCompanies.add(company.slug);
  } catch (error) {
    console.error(`Failed ${company.slug}:`, error);
  }
}

const cutoff = Date.now() - 14 * 864e5;
for (const job of jobs) {
  if (!successfulCompanies.has(job.company_slug) || seenThisRun.has(job.slug) || job.status === "expired") {
    continue;
  }
  const lastSeenAt = lastSeen[job.slug];
  if (lastSeenAt && new Date(lastSeenAt).getTime() < cutoff) {
    job.status = "expired";
    job.expires_at = new Date().toISOString();
    summary.expired += 1;
  }
}

for (const job of jobs) {
  if (job.comp_base_min !== null || job.comp_base_max !== null || job.status === "expired") {
    continue;
  }
  const company = companyBySlug.get(job.company_slug);
  if (!company) {
    continue;
  }
  const benchmarkComp = benchmarkBaseComp(job.role_family, company.stage);
  job.comp_base_min = benchmarkComp.min;
  job.comp_base_max = benchmarkComp.max;
  job.comp_currency = "USD";
  summary.updated += 1;
}

await writeJobs(jobs);
await writeLastSeen(lastSeen);
await writeEtags(etags);
await commitAndPush("tier1", summary);
console.log(summary);
