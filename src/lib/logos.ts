import type { Company } from "./types";

const logoDomains: Record<string, string> = {
  abridge: "abridge.com",
  adept: "adept.ai",
  "ai21-labs": "ai21.com",
  anduril: "anduril.com",
  anthropic: "anthropic.com",
  "arize-ai": "arize.com",
  baseten: "baseten.co",
  brex: "brex.com",
  cbre: "cbre.com",
  cohere: "cohere.com",
  cursor: "cursor.com",
  databricks: "databricks.com",
  decagon: "decagon.ai",
  deloitte: "deloitte.com",
  "distyl-ai": "distyl.ai",
  "google-cloud": "cloud.google.com",
  "gowan-usa": "gowanco.com",
  glean: "glean.com",
  harvey: "harvey.ai",
  hebbia: "hebbia.ai",
  helsing: "helsing.ai",
  infinit: "infinit.com",
  modal: "modal.com",
  obviant: "obviant.com",
  openai: "openai.com",
  palantir: "palantir.com",
  "p-1-ai": "p1.ai",
  ramp: "ramp.com",
  "rational-dynamics": "rationaldynamics.com",
  replicate: "replicate.com",
  sierra: "sierra.ai",
  "shield-ai": "shield.ai",
  snowflake: "snowflake.com",
  "together-ai": "together.ai",
  "towards-ai": "towardsai.net",
  vercel: "vercel.com",
  writer: "writer.com",
  xai: "x.ai"
};

export function companyInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function companyLogoUrl(company: Pick<Company, "slug" | "logo_url">) {
  if (company.logo_url) {
    return company.logo_url;
  }

  const domain = logoDomains[company.slug];
  return domain ? `https://logo.clearbit.com/${domain}` : null;
}
