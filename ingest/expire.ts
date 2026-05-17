import { commitAndPush } from "./lib/git";
import { readJobs, readLastSeen, writeJobs } from "./lib/persist";
import type { IngestSummary } from "./lib/types";

const jobs = await readJobs();
const lastSeen = await readLastSeen();
const cutoff = Date.now() - 14 * 864e5;
const summary: IngestSummary = { inserted: 0, updated: 0, expired: 0, reviewed: 0, discarded: 0 };

for (const job of jobs) {
  if (job.status === "expired") {
    continue;
  }
  const lastSeenAt = lastSeen[job.slug];
  if (lastSeenAt && new Date(lastSeenAt).getTime() < cutoff) {
    job.status = "expired";
    job.expires_at = new Date().toISOString();
    summary.expired += 1;
  }
}

await writeJobs(jobs);
await commitAndPush("expire", summary);
console.log(summary);
