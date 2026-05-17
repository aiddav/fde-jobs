import type { Company, Job } from "../../src/lib/types";

export type RawJob = {
  id: string;
  title: string;
  location: string;
  description: string;
  apply_url: string;
  source_url: string | null;
  posted_at: string | null;
  compensation?: {
    min?: number | null;
    max?: number | null;
    currency?: Job["comp_currency"] | null;
  };
};

export type NormalisedJob = {
  company: Company;
  title: string;
  location_type: Job["location_type"];
  locations: string[];
  description_md: string;
  apply_url: string;
  source_provider: Job["source_provider"];
  source_url: string | null;
  posted_at: string;
  comp_base_min: number | null;
  comp_base_max: number | null;
  comp_currency: Job["comp_currency"];
};

export type SourceAdapter = {
  fetchJobs(company: Company, etag?: string): Promise<{
    jobs: RawJob[];
    etag?: string | null;
    notModified?: boolean;
  }>;
  normalise(raw: RawJob, company: Company): NormalisedJob;
};

export type IngestSummary = {
  inserted: number;
  updated: number;
  expired: number;
  reviewed: number;
  discarded: number;
};
