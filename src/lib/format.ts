import type { Company, Job } from "./types";

const stageLabels: Record<string, string> = {
  seed: "Seed",
  series_a: "Series A",
  series_b: "Series B",
  series_c: "Series C",
  series_d_plus: "Series D+",
  public: "Public",
  bootstrapped: "Bootstrapped",
  gov_defense: "Gov/Defense"
};

const roleLabels: Record<string, string> = {
  fde: "FDE",
  solutions_engineer: "Solutions Engineer",
  deployed_engineer: "Deployed Engineer",
  ai_engineer: "AI Engineer",
  other: "Other"
};

const travelLabels: Record<string, string> = {
  none: "No travel",
  low_0_25: "0-25% travel",
  med_25_50: "25-50% travel",
  high_50_plus: "50%+ travel"
};

const facingLabels: Record<string, string> = {
  low_0_25: "Low customer-facing",
  med_25_50: "Med customer-facing",
  high_50_plus: "High customer-facing"
};

export function stageLabel(stage: Company["stage"]) {
  return stageLabels[stage] ?? stage;
}

export function roleLabel(role: Job["role_family"]) {
  return roleLabels[role] ?? role;
}

export function travelLabel(band: Job["travel_pct_band"]) {
  return travelLabels[band] ?? band;
}

export function customerFacingLabel(band: Job["customer_facing_pct_band"]) {
  return facingLabels[band] ?? band;
}

export function roleSignalLabel(job: Pick<Job, "role_family" | "travel_pct_band" | "location_type">) {
  if (job.travel_pct_band === "high_50_plus") {
    return "Field-heavy deployment";
  }
  if (job.role_family === "fde" || job.role_family === "deployed_engineer") {
    return "Build + deployment ownership";
  }
  if (job.role_family === "solutions_engineer") {
    return "Solution design + technical sales";
  }
  if (job.role_family === "ai_engineer") {
    return "Production AI implementation";
  }
  if (job.location_type === "remote") {
    return "Remote customer delivery";
  }
  return "Customer workflow engineering";
}

export function locationTypeLabel(type: Job["location_type"]) {
  return type[0].toUpperCase() + type.slice(1);
}

export function formatComp(job: Pick<Job, "comp_base_min" | "comp_base_max" | "comp_currency">) {
  if (job.comp_base_min === null && job.comp_base_max === null) {
    return "Comp n/a";
  }

  const symbol = job.comp_currency === "GBP" ? "£" : job.comp_currency === "EUR" ? "€" : "$";
  const compact = (value: number | null) => (value === null ? null : `${symbol}${Math.round(value / 1000)}k`);

  if (job.comp_base_min !== null && job.comp_base_max !== null) {
    return `${compact(job.comp_base_min)}-${compact(job.comp_base_max)?.replace(symbol, "")}`;
  }

  if (job.comp_base_min !== null) {
    return `${compact(job.comp_base_min)}+`;
  }

  return `up to ${compact(job.comp_base_max)}`;
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

export function postedAgo(value: string, now = new Date()) {
  const posted = new Date(value).getTime();
  const diffMs = Math.max(0, now.getTime() - posted);
  const diffHours = Math.floor(diffMs / 36e5);
  if (diffHours < 1) {
    return "now";
  }
  if (diffHours < 24) {
    return `${diffHours}h`;
  }
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) {
    return `${diffDays}d`;
  }
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 8) {
    return `${diffWeeks}w`;
  }
  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths}mo`;
}

export function isNew(value: string, now = new Date()) {
  return now.getTime() - new Date(value).getTime() <= 48 * 36e5;
}

export function isClosingSoon(job: Pick<Job, "expires_at">, now = new Date()) {
  if (!job.expires_at) {
    return false;
  }
  const days = (new Date(job.expires_at).getTime() - now.getTime()) / 864e5;
  return days >= 0 && days <= 7;
}

export function describeLocations(job: Pick<Job, "locations" | "location_type">) {
  const locations = job.locations.slice(0, 2).join(" · ");
  const overflow = job.locations.length > 2 ? ` +${job.locations.length - 2}` : "";
  return `${locations}${overflow} · ${locationTypeLabel(job.location_type)}`;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function buildJobSlug(company: Company, title: string, locations: string[], date = new Date()) {
  const month = date.toISOString().slice(0, 7);
  return slugify(`${company.slug}-${title}-${locations[0] ?? "global"}-${month}`);
}
