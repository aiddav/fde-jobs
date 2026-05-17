import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { Resvg } from "@resvg/resvg-js";
import type { Company, Job } from "../src/lib/types";
import { formatComp } from "../src/lib/format";
import { readJson } from "./io";

const jobs = await readJson<Job[]>("src/content/data/jobs.json", []);
const companies = await readJson<Company[]>("src/content/data/companies.json", []);
const bySlug = Object.fromEntries(companies.map((company) => [company.slug, company]));

await mkdir("public/og", { recursive: true });

function esc(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function exists(path: string) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

for (const job of jobs.filter((item) => item.status === "live").slice(0, 100)) {
  const company = bySlug[job.company_slug];
  if (!company) {
    continue;
  }
  const hash = createHash("sha256").update(JSON.stringify({ job, company })).digest("hex").slice(0, 16);
  const out = `public/og/${job.slug}.png`;
  const hashPath = `public/og/${job.slug}.hash`;
  const currentHash = (await exists(hashPath)) ? await readFile(hashPath, "utf8") : "";
  if (currentHash.trim() === hash && await exists(out)) {
    continue;
  }

  const svg = `
  <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="630" fill="#FAFAF7"/>
    <line x1="80" y1="86" x2="1120" y2="86" stroke="#E8E6E0"/>
    <text x="80" y="66" fill="#6B6B68" font-family="monospace" font-size="24" letter-spacing="4">FDE JOBS</text>
    <text x="80" y="190" fill="#0A0A0A" font-family="Geist Sans, sans-serif" font-size="42" font-weight="600">${esc(company.name)}</text>
    <text x="80" y="275" fill="#0A0A0A" font-family="Geist Sans, sans-serif" font-size="64" font-weight="600">${esc(job.title).slice(0, 48)}</text>
    <text x="80" y="370" fill="#6B6B68" font-family="monospace" font-size="28">${esc(job.locations.join(" · "))}</text>
    <text x="80" y="470" fill="#0A0A0A" font-family="monospace" font-size="44">${esc(formatComp(job))}</text>
    <line x1="80" y1="540" x2="1120" y2="540" stroke="#E8E6E0"/>
    <text x="80" y="585" fill="#9C9C97" font-family="monospace" font-size="22">REPO-BACKED · STATIC · FRESH</text>
  </svg>`;
  const png = new Resvg(svg).render().asPng();
  await writeFile(out, png);
  await writeFile(hashPath, hash);
}

console.log("Generated OG images.");
