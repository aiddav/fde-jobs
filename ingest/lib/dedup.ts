import type { Job } from "../../src/lib/types";
import type { NormalisedJob } from "./types";

export function dedupKey(job: Pick<Job, "source_provider" | "source_url" | "company_slug" | "title" | "locations">) {
  if (job.source_url) {
    return `${job.source_provider}:${job.source_url}`;
  }
  return `${job.company_slug}:${job.title}:${job.locations[0] ?? ""}`.toLowerCase();
}

export function dedupKeyFromNormalised(job: NormalisedJob) {
  if (job.source_url) {
    return `${job.source_provider}:${job.source_url}`;
  }
  return `${job.company.slug}:${job.title}:${job.locations[0] ?? ""}`.toLowerCase();
}
