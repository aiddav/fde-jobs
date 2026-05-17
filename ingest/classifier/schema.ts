import { z } from "astro/zod";
import { customerFacingBandSchema, roleFamilySchema, travelBandSchema } from "../../src/lib/schema";

export const classifierOutputSchema = z.object({
  is_fde_relevant: z.boolean(),
  confidence: z.number().min(0).max(1),
  role_family: roleFamilySchema,
  travel_pct_band: travelBandSchema,
  customer_facing_pct_band: customerFacingBandSchema,
  comp_base_min_usd: z.number().int().nonnegative().nullable(),
  comp_base_max_usd: z.number().int().nonnegative().nullable(),
  reasoning: z.string().min(1).max(400)
});

export type ClassifierOutput = z.infer<typeof classifierOutputSchema>;

export type ClassifierInput = {
  title: string;
  company_name: string;
  description: string;
  location: string;
};
