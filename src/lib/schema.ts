import { z } from "astro/zod";

export const stageSchema = z.enum([
  "seed",
  "series_a",
  "series_b",
  "series_c",
  "series_d_plus",
  "public",
  "bootstrapped",
  "gov_defense"
]);

export const headcountBandSchema = z.enum([
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1000+"
]);

export const atsProviderSchema = z.enum([
  "greenhouse",
  "lever",
  "ashby",
  "workday",
  "workable",
  "custom",
  "manual"
]);

export const sourceProviderSchema = z.enum([
  "greenhouse",
  "lever",
  "ashby",
  "workday",
  "workable",
  "custom",
  "hn_who_is_hiring",
  "manual"
]);

export const roleFamilySchema = z.enum([
  "fde",
  "solutions_engineer",
  "deployed_engineer",
  "ai_engineer",
  "other"
]);

export const locationTypeSchema = z.enum(["onsite", "hybrid", "remote"]);
export const travelBandSchema = z.enum(["none", "low_0_25", "med_25_50", "high_50_plus"]);
export const customerFacingBandSchema = z.enum(["low_0_25", "med_25_50", "high_50_plus"]);
export const currencySchema = z.enum(["USD", "GBP", "EUR"]);
export const jobStatusSchema = z.enum(["review", "live", "expired"]);

export const isoDateString = z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
  message: "Expected an ISO-like date string"
});

export const companySchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().min(1),
  logo_url: z.string().url().nullable(),
  stage: stageSchema,
  headcount_band: headcountBandSchema,
  industry_tags: z.array(z.string().min(1)).default([]),
  ats_provider: atsProviderSchema.exclude(["manual"]).nullable(),
  ats_slug: z.string().min(1).nullable(),
  custom_scraper_id: z.string().min(1).nullable(),
  is_active: z.boolean(),
  notes: z.string().nullable()
});

export const jobSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  company_slug: z.string().min(1),
  title: z.string().min(1),
  role_family: roleFamilySchema,
  location_type: locationTypeSchema,
  locations: z.array(z.string().min(1)).min(1),
  travel_pct_band: travelBandSchema,
  customer_facing_pct_band: customerFacingBandSchema,
  comp_base_min: z.number().int().nonnegative().nullable(),
  comp_base_max: z.number().int().nonnegative().nullable(),
  comp_currency: currencySchema,
  equity_offered: z.boolean(),
  equity_note: z.string().nullable(),
  benefits_tags: z.array(z.string().min(1)).default([]),
  description_md: z.string().min(1),
  apply_url: z.string().url(),
  source_provider: sourceProviderSchema,
  source_url: z.string().url().nullable(),
  first_seen_at: isoDateString,
  posted_at: isoDateString,
  expires_at: isoDateString.nullable(),
  classifier_confidence: z.number().min(0).max(1),
  classifier_reasoning: z.string().nullable(),
  classifier_version: z.string().min(1).default("manual"),
  status: jobStatusSchema,
  is_featured: z.boolean()
}).refine((job) => {
  if (job.comp_base_min === null || job.comp_base_max === null) {
    return true;
  }
  return job.comp_base_min <= job.comp_base_max;
}, {
  message: "comp_base_min must be <= comp_base_max"
});

export const tickerItemSchema = z.object({
  id: z.string().min(1),
  kind: z.enum(["news", "announcement", "milestone"]),
  text: z.string().min(1).max(80),
  url: z.string().url().nullable(),
  published_at: isoDateString,
  expires_at: isoDateString,
  is_pinned: z.boolean()
});

export const companiesSchema = z.array(companySchema);
export const jobsSchema = z.array(jobSchema);
export const tickerSchema = z.array(tickerItemSchema);

export type Company = z.infer<typeof companySchema>;
export type Job = z.infer<typeof jobSchema>;
export type TickerItem = z.infer<typeof tickerItemSchema>;
export type Stage = z.infer<typeof stageSchema>;
export type RoleFamily = z.infer<typeof roleFamilySchema>;
export type LocationType = z.infer<typeof locationTypeSchema>;
export type TravelBand = z.infer<typeof travelBandSchema>;
export type CustomerFacingBand = z.infer<typeof customerFacingBandSchema>;
export type JobStatus = z.infer<typeof jobStatusSchema>;
