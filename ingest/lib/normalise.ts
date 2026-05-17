import type { Company, Job } from "../../src/lib/types";
import { slugify } from "../../src/lib/format";
import type { NormalisedJob } from "./types";

export function inferLocationType(locations: string[]): Job["location_type"] {
  const text = locations.join(" ").toLowerCase();
  if (/remote|anywhere|worldwide/.test(text)) {
    return "remote";
  }
  if (/hybrid/.test(text)) {
    return "hybrid";
  }
  return "onsite";
}

export function splitLocations(value: string | null | undefined) {
  if (!value) {
    return ["Unlisted"];
  }
  return value
    .split(/,|;|\||\/|\bor\b/i)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 6);
}

export function htmlToText(value: string) {
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<li>/gi, "- ")
    .replace(/<\/li>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function toJobSlug(company: Company, normalised: Pick<NormalisedJob, "title" | "locations" | "posted_at">) {
  const month = new Date(normalised.posted_at).toISOString().slice(0, 7);
  return slugify(`${company.slug}-${normalised.title}-${normalised.locations[0] ?? "global"}-${month}`);
}
