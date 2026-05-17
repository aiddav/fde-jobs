import { defineCollection } from "astro:content";
import { file } from "astro/loaders";
import { companySchema, jobSchema, tickerItemSchema } from "./lib/schema";

const companies = defineCollection({
  loader: file("src/content/data/companies.json", {
    parser: (text) => JSON.parse(text).map((entry: { slug: string }) => ({ id: entry.slug, ...entry }))
  }),
  schema: companySchema
});

const jobs = defineCollection({
  loader: file("src/content/data/jobs.json", {
    parser: (text) => JSON.parse(text).map((entry: { slug: string }) => ({ id: entry.slug, ...entry }))
  }),
  schema: jobSchema
});

const ticker = defineCollection({
  loader: file("src/content/data/ticker.json", {
    parser: (text) => JSON.parse(text)
  }),
  schema: tickerItemSchema
});

export const collections = { companies, jobs, ticker };
