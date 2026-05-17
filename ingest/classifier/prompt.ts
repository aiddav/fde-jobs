export const CLASSIFIER_VERSION = "fde-classifier-v1";

export function classifierPrompt(input: {
  title: string;
  company_name: string;
  description: string;
  location: string;
}) {
  return [
    "Classify whether this job is relevant to a jobs board for Forward Deployed Engineers, Deployed Engineers, Solutions Engineers, AI Solutions Engineers, and adjacent technical customer-facing operator roles.",
    "Relevant roles usually combine software engineering, solution architecture, deployment, integration, customer-facing work, technical strategy, or field engineering.",
    "Not relevant: generic sales, account executives, support-only roles, non-technical customer success, pure product management, generic backend roles with no customer/deployment component.",
    "Infer travel and customer-facing bands only from evidence. If not stated, choose the conservative lower band.",
    "",
    `Title: ${input.title}`,
    `Company: ${input.company_name}`,
    `Location: ${input.location}`,
    `Description:\n${input.description.slice(0, 8000)}`
  ].join("\n");
}
