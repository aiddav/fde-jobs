import type { Company } from "../../src/lib/types";
import { fetchJson } from "../lib/http";
import { htmlToText, inferLocationType, splitLocations } from "../lib/normalise";
import type { RawJob, SourceAdapter } from "../lib/types";

type GreenhouseJob = {
  id: number;
  title: string;
  absolute_url: string;
  updated_at?: string;
  location?: { name?: string };
  content?: string;
  metadata?: Array<{ name: string; value: string | number | null }>;
};

type GreenhouseResponse = {
  jobs: GreenhouseJob[];
};

export const greenhouse: SourceAdapter = {
  async fetchJobs(company: Company, etag?: string) {
    if (!company.ats_slug) {
      return { jobs: [] };
    }
    const url = `https://boards-api.greenhouse.io/v1/boards/${company.ats_slug}/jobs?content=true`;
    const response = await fetchJson<GreenhouseResponse>(url, etag);
    if (response.status === 304) {
      return { jobs: [], etag: response.etag, notModified: true };
    }

    return {
      etag: response.etag,
      jobs: (response.data?.jobs ?? []).map((job): RawJob => ({
        id: String(job.id),
        title: job.title,
        location: job.location?.name ?? "Unlisted",
        description: htmlToText(job.content ?? ""),
        apply_url: job.absolute_url,
        source_url: job.absolute_url,
        posted_at: job.updated_at ?? null
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
      source_provider: "greenhouse",
      source_url: raw.source_url,
      posted_at: raw.posted_at ?? new Date().toISOString(),
      comp_base_min: raw.compensation?.min ?? null,
      comp_base_max: raw.compensation?.max ?? null,
      comp_currency: raw.compensation?.currency ?? "USD"
    };
  }
};
