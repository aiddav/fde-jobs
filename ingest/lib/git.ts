import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { IngestSummary } from "./types";

const exec = promisify(execFile);

export async function hasChanges() {
  const { stdout } = await exec("git", ["status", "--short"]);
  return stdout.trim().length > 0;
}

export async function commitAndPush(scope: string, summary: IngestSummary) {
  if (!(await hasChanges())) {
    console.log("No net changes; skipping commit.");
    return;
  }

  const message = `ingest(${scope}): +${summary.inserted} new, ~${summary.updated} updated, -${summary.expired} expired`;
  await exec("git", ["add", "src/content/data/jobs.json", "ingest/state/last-seen.json", "ingest/state/etags.json"]);
  await exec("git", ["commit", "-m", message]);

  if (process.env.CI) {
    await exec("git", ["push"]);
  }
}
