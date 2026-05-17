export type {
  Company,
  CustomerFacingBand,
  Job,
  JobStatus,
  LocationType,
  RoleFamily,
  Stage,
  TickerItem,
  TravelBand
} from "./schema";

export type CompanyLookup = Record<string, import("./schema").Company>;

export type JobWithCompany = import("./schema").Job & {
  company: import("./schema").Company;
  search_text: string;
  regions: string[];
  posted_ts: number;
};

export type FilterState = {
  q: string;
  role: string[];
  stage: string[];
  locationType: string[];
  region: string[];
  travel: string[];
  customerFacing: string[];
  compFloor: number | null;
  industry: string[];
  benefits: string[];
  posted: "24h" | "7d" | "30d" | "all";
  sort: "posted" | "company" | "comp" | "stage";
};

export type PostingStats = {
  totalEstimate: number;
  currentMonthLabel: string;
  currentMonthCount: number;
  previousMonthCount: number;
  momChangePct: number | null;
};
