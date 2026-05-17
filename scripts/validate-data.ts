import { companiesSchema, jobsSchema, marketStatsSchema, tickerSchema } from "../src/lib/schema";
import { readJson } from "./io";

const companies = companiesSchema.parse(await readJson("src/content/data/companies.json", []));
const jobs = jobsSchema.parse(await readJson("src/content/data/jobs.json", []));
const ticker = tickerSchema.parse(await readJson("src/content/data/ticker.json", []));
marketStatsSchema.parse(await readJson("src/content/data/market.json", {}));

function assertUnique(values: string[], label: string) {
  const seen = new Set<string>();
  const duplicates = values.filter((value) => {
    if (seen.has(value)) {
      return true;
    }
    seen.add(value);
    return false;
  });

  if (duplicates.length > 0) {
    throw new Error(`${label} contains duplicate values: ${duplicates.join(", ")}`);
  }
}

assertUnique(companies.map((company) => company.slug), "companies.slug");
assertUnique(jobs.map((job) => job.slug), "jobs.slug");
assertUnique(ticker.map((item) => item.id), "ticker.id");

const companySlugs = new Set(companies.map((company) => company.slug));
const missingCompanies = jobs.filter((job) => !companySlugs.has(job.company_slug)).map((job) => `${job.slug} -> ${job.company_slug}`);

if (missingCompanies.length > 0) {
  throw new Error(`Jobs reference unknown companies: ${missingCompanies.join(", ")}`);
}

const badTicker = ticker.filter((item) => new Date(item.expires_at) <= new Date(item.published_at));
if (badTicker.length > 0) {
  throw new Error(`Ticker items expire before publication: ${badTicker.map((item) => item.id).join(", ")}`);
}

console.log(`Validated ${companies.length} companies, ${jobs.length} jobs, ${ticker.length} ticker items, and market stats.`);
