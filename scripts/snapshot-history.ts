import { historySchema, jobsSchema } from "../src/lib/schema";
import { readJson, writeJson } from "./io";

const jobs = jobsSchema.parse(await readJson("src/content/data/jobs.json", []));
const history = historySchema.parse(await readJson("src/content/data/history.json", []));
const liveRoleCount = jobs.filter((job) => job.status === "live").length;
const now = new Date();
const snapshotDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString();
const existing = history.find((snapshot) => snapshot.date.slice(0, 10) === snapshotDate.slice(0, 10));

if (existing) {
  existing.live_role_count = liveRoleCount;
  existing.notes = "Weekly snapshot of current live FDE roles displayed on the site.";
} else {
  history.push({
    date: snapshotDate,
    live_role_count: liveRoleCount,
    source: "site_live_jobs",
    notes: "Weekly snapshot of current live FDE roles displayed on the site."
  });
}

history.sort((a, b) => a.date.localeCompare(b.date));
await writeJson("src/content/data/history.json", history);
console.log(`Snapshot ${snapshotDate}: ${liveRoleCount} live roles`);
