import type { Company } from "../../src/lib/types";
import { fetchJson } from "../lib/http";
import { htmlToText, inferLocationType, splitLocations } from "../lib/normalise";
import type { RawJob, SourceAdapter } from "../lib/types";

type LeverJob = {
  id: string;
  text: string;
  hostedUrl: string;
  createdAt?: number;
  categories?: {
    location?: string;
    commitment?: string;
    team?: string;
  };
  content?: {
    descriptionHtml?: string;
    lists?: Array<{ text: string; content: string }>;
  };
};

function description(job: LeverJob) {
  const body = [
    htmlToText(job.content?.descriptionHtml ?? ""),
    ...(job.content?.lists ?? []).map((list) => `## ${list.text}\n${htmlToText(list.content)}`)
  ].filter(Boolean);
  return body.join("\n\n");
}

export const lever: SourceAdapter = {
  async fetchJobs(company: Company, etag?: string) {
    if (!company.ats_slug) {
      return { jobs: [] };
    }
    const url = `https://api.lever.co/v0/postings/${company.ats_slug}?mode=json`;
    const response = await fetchJson<LeverJob[]>(url, etag);
    if (response.status === 304) {
      return { jobs: [], etag: response.etag, notModified: true };
    }

    return {
      etag: response.etag,
      jobs: (response.data ?? []).map((job): RawJob => ({
        id: job.id,
        title: job.text,
        location: job.categories?.location ?? "Unlisted",
        description: description(job),
        apply_url: job.hostedUrl,
        source_url: job.hostedUrl,
        posted_at: job.createdAt ? new Date(job.createdAt).toISOString() : null
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
      source_provider: "lever",
      source_url: raw.source_url,
      posted_at: raw.posted_at ?? new Date().toISOString(),
      comp_base_min: raw.compensation?.min ?? null,
      comp_base_max: raw.compensation?.max ?? null,
      comp_currency: raw.compensation?.currency ?? "USD"
    };
  }
};
