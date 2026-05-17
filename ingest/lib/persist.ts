import type { Company, Job } from "../../src/lib/types";
import { companiesSchema, jobsSchema } from "../../src/lib/schema";
import { readJson, writeJson } from "../../scripts/io";

export async function readCompanies() {
  return companiesSchema.parse(await readJson<Company[]>("src/content/data/companies.json", []));
}

export async function readJobs() {
  return jobsSchema.parse(await readJson<Job[]>("src/content/data/jobs.json", []));
}

export async function writeJobs(jobs: Job[]) {
  jobs.sort((a, b) => a.slug.localeCompare(b.slug));
  await writeJson("src/content/data/jobs.json", jobs);
}

export async function readLastSeen() {
  return readJson<Record<string, string>>("ingest/state/last-seen.json", {});
}

export async function writeLastSeen(state: Record<string, string>) {
  await writeJson("ingest/state/last-seen.json", Object.fromEntries(Object.entries(state).sort(([a], [b]) => a.localeCompare(b))));
}

export async function readEtags() {
  return readJson<Record<string, string>>("ingest/state/etags.json", {});
}

export async function writeEtags(state: Record<string, string>) {
  await writeJson("ingest/state/etags.json", Object.fromEntries(Object.entries(state).sort(([a], [b]) => a.localeCompare(b))));
}
