import type { SourceAdapter } from "../lib/types";

export const workday: SourceAdapter = {
  async fetchJobs() {
    console.warn("Workday adapter requires per-company endpoint mapping; skipping in v1 scaffold.");
    return { jobs: [] };
  },
  normalise() {
    throw new Error("Workday normalise is not available without a company-specific endpoint.");
  }
};
