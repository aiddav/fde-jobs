import type { Company } from "../../src/lib/types";
import { fetchJson } from "../lib/http";
import { htmlToText, inferLocationType, splitLocations } from "../lib/normalise";
import type { RawJob, SourceAdapter } from "../lib/types";

type AshbyJob = {
  id: string;
  title: string;
  jobUrl: string;
  publishedAt?: string;
  location?: string;
  descriptionHtml?: string;
  compensationTierSummary?: string;
  compensation?: {
    compensationTiers?: Array<{
      components?: Array<{
        minValue?: number;
        maxValue?: number;
        currencyCode?: "USD" | "GBP" | "EUR";
      }>;
    }>;
  };
};

type AshbyResponse = {
  jobs: AshbyJob[];
};

function compensation(job: AshbyJob): RawJob["compensation"] {
  const component = job.compensation?.compensationTiers?.[0]?.components?.[0];
  if (!component) {
    return undefined;
  }
  if (component.currencyCode && !["USD", "GBP", "EUR"].includes(component.currencyCode)) {
    return undefined;
  }
  return {
    min: component.minValue ?? null,
    max: component.maxValue ?? null,
    currency: component.currencyCode ?? "USD"
  };
}

export const ashby: SourceAdapter = {
  async fetchJobs(company: Company, etag?: string) {
    if (!company.ats_slug) {
      return { jobs: [] };
    }
    const url = `https://api.ashbyhq.com/posting-api/job-board/${company.ats_slug}?includeCompensation=true`;
    const response = await fetchJson<AshbyResponse>(url, etag);
    if (response.status === 304) {
      return { jobs: [], etag: response.etag, notModified: true };
    }

    return {
      etag: response.etag,
      jobs: (response.data?.jobs ?? []).map((job): RawJob => ({
        id: job.id,
        title: job.title,
        location: job.location ?? "Unlisted",
        description: htmlToText(job.descriptionHtml ?? ""),
        apply_url: job.jobUrl,
        source_url: job.jobUrl,
        posted_at: job.publishedAt ?? null,
        compensation: compensation(job)
      }))
    };
  },
  normalise(raw, company) {
    const locations = splitLocations(raw.location);
    return {
      company,
      title: raw.title,
      location_type: inferLocationType(locations),
      locations,
      description_md: raw.description,
      apply_url: raw.apply_url,
      source_provider: "ashby",
      source_url: raw.source_url,
      posted_at: raw.posted_at ?? new Date().toISOString(),
      comp_base_min: raw.compensation?.min ?? null,
      comp_base_max: raw.compensation?.max ?? null,
      comp_currency: raw.compensation?.currency ?? "USD"
    };
  }
};
