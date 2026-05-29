const baseHref = import.meta.env.BASE_URL.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

export const leadFormUrl =
  import.meta.env.PUBLIC_LEAD_FORM_URL ??
  "https://forms.gle/HwHsXRCMNJu3ThkW9";

export const leadSignupPath = `${baseHref}sign-up/`;

export const leadCaptureFields = [
  "Name",
  "Email",
  "LinkedIn profile",
  "Country",
  "Current role",
  "Years of experience",
  "Target role type",
  "Open to relocation",
  "Companies of interest",
  "CV upload or CV link"
];
