import { useEffect, useMemo, useState } from "preact/hooks";
import SearchInput from "./SearchInput";
import {
  activeFilterCount,
  defaultFilters,
  filterJobs,
  filtersToParams,
  parseFilters,
  regionOptions
} from "../lib/filters";
import {
  customerFacingLabel,
  describeLocations,
  formatComp,
  isClosingSoon,
  isNew,
  postedAgo,
  roleLabel,
  stageLabel,
  travelLabel
} from "../lib/format";
import type { Company, FilterState, JobWithCompany } from "../lib/types";

type Props = {
  jobs: JobWithCompany[];
  companies: Company[];
  addedThisWeek: number;
};

const roleOptions = [
  "fde",
  "solutions_engineer",
  "deployed_engineer",
  "ai_engineer",
  "other"
] as const;

const stageOptions = [
  "seed",
  "series_a",
  "series_b",
  "series_c",
  "series_d_plus",
  "public",
  "gov_defense",
  "bootstrapped"
] as const;

const locationOptions = ["onsite", "hybrid", "remote"] as const;
const travelOptions = ["none", "low_0_25", "med_25_50", "high_50_plus"] as const;
const facingOptions = ["low_0_25", "med_25_50", "high_50_plus"] as const;
const postedOptions = [
  ["24h", "24h"],
  ["7d", "7d"],
  ["30d", "30d"],
  ["all", "All"]
] as const;
const sortOptions = [
  ["posted", "Newest"],
  ["company", "Company"],
  ["comp", "Comp"],
  ["stage", "Stage"]
] as const;

function useUrlFilters() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setFilters(parseFilters(new URLSearchParams(window.location.search)));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !hydrated) {
      return;
    }
    const params = filtersToParams(filters);
    const next = params.toString() ? `${window.location.pathname}?${params}` : window.location.pathname;
    window.history.replaceState(null, "", next);
  }, [filters, hydrated]);

  return [filters, setFilters] as const;
}

function toggleList(filters: FilterState, key: keyof FilterState, value: string): FilterState {
  const current = filters[key];
  if (!Array.isArray(current)) {
    return filters;
  }
  return {
    ...filters,
    [key]: current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
  };
}

function FilterGroup({
  label,
  children
}: {
  label: string;
  children: preact.ComponentChildren;
}) {
  return (
    <section class="filter-group">
      <div class="filter-label">{label}</div>
      <div class="filter-options">{children}</div>
    </section>
  );
}

function CheckboxOption({
  label,
  checked,
  onChange
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label class="filter-check">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span>{label}</span>
    </label>
  );
}

function FilterControls({
  filters,
  setFilters,
  industryOptions,
  benefitOptions
}: {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  industryOptions: string[];
  benefitOptions: string[];
}) {
  return (
    <div class="filters-grid">
      <FilterGroup label="Role family">
        {roleOptions.map((role) => (
          <CheckboxOption
            key={role}
            label={roleLabel(role)}
            checked={filters.role.includes(role)}
            onChange={() => setFilters(toggleList(filters, "role", role))}
          />
        ))}
      </FilterGroup>
      <FilterGroup label="Stage">
        {stageOptions.map((stage) => (
          <CheckboxOption
            key={stage}
            label={stageLabel(stage)}
            checked={filters.stage.includes(stage)}
            onChange={() => setFilters(toggleList(filters, "stage", stage))}
          />
        ))}
      </FilterGroup>
      <FilterGroup label="Location">
        {locationOptions.map((type) => (
          <CheckboxOption
            key={type}
            label={type[0].toUpperCase() + type.slice(1)}
            checked={filters.locationType.includes(type)}
            onChange={() => setFilters(toggleList(filters, "locationType", type))}
          />
        ))}
      </FilterGroup>
      <FilterGroup label="Region">
        {regionOptions.map((region) => (
          <CheckboxOption
            key={region}
            label={region}
            checked={filters.region.includes(region)}
            onChange={() => setFilters(toggleList(filters, "region", region))}
          />
        ))}
      </FilterGroup>
      <FilterGroup label="Travel">
        {travelOptions.map((travel) => (
          <CheckboxOption
            key={travel}
            label={travelLabel(travel)}
            checked={filters.travel.includes(travel)}
            onChange={() => setFilters(toggleList(filters, "travel", travel))}
          />
        ))}
      </FilterGroup>
      <FilterGroup label="Customer-facing">
        {facingOptions.map((facing) => (
          <CheckboxOption
            key={facing}
            label={customerFacingLabel(facing)}
            checked={filters.customerFacing.includes(facing)}
            onChange={() => setFilters(toggleList(filters, "customerFacing", facing))}
          />
        ))}
      </FilterGroup>
      <FilterGroup label="Comp floor">
        <input
          type="range"
          min="0"
          max="300000"
          step="10000"
          value={filters.compFloor ?? 0}
          aria-label="Minimum base compensation in USD"
          onInput={(event) => {
            const value = Number((event.currentTarget as HTMLInputElement).value);
            setFilters({ ...filters, compFloor: value === 0 ? null : value });
          }}
        />
        <span class="mono micro">{filters.compFloor ? `$${Math.round(filters.compFloor / 1000)}k+` : "Any base"}</span>
      </FilterGroup>
      <FilterGroup label="Industry">
        {industryOptions.slice(0, 14).map((tag) => (
          <CheckboxOption
            key={tag}
            label={tag}
            checked={filters.industry.includes(tag)}
            onChange={() => setFilters(toggleList(filters, "industry", tag))}
          />
        ))}
      </FilterGroup>
      <FilterGroup label="Benefits">
        {benefitOptions.map((tag) => (
          <CheckboxOption
            key={tag}
            label={tag}
            checked={filters.benefits.includes(tag)}
            onChange={() => setFilters(toggleList(filters, "benefits", tag))}
          />
        ))}
      </FilterGroup>
      <FilterGroup label="Posted in">
        {postedOptions.map(([value, label]) => (
          <label class="filter-check" key={value}>
            <input
              type="radio"
              name="posted"
              checked={filters.posted === value}
              onChange={() => setFilters({ ...filters, posted: value })}
            />
            <span>{label}</span>
          </label>
        ))}
      </FilterGroup>
    </div>
  );
}

function JobRow({ job }: { job: JobWithCompany }) {
  const tags = job.company.industry_tags.slice(0, 2);
  const overflow = job.company.industry_tags.length - tags.length;
  const closing = isClosingSoon(job);
  const newlyPosted = isNew(job.posted_at);

  return (
    <a class="job-row" href={`/j/${job.slug}/`}>
      <div class="job-row-main">
        <div>
          <div class="job-company-line">
            <span class="job-company-name">{job.company.name}</span>
            <span class="chip stage">{stageLabel(job.company.stage)}</span>
            {job.is_featured && <span class="chip featured">Featured</span>}
          </div>
        </div>
        <div>
          <div class="job-title">{job.title}</div>
          <div class="job-meta-line">
            <span>{describeLocations(job)}</span>
            {job.travel_pct_band === "high_50_plus" && <span class="chip closing">50%+ travel</span>}
          </div>
        </div>
        <div class="job-tags">
          {tags.map((tag) => (
            <span class="chip" key={tag}>{tag}</span>
          ))}
          {overflow > 0 && <span class="chip">+{overflow}</span>}
          {closing && <span class="chip closing">Closing soon</span>}
        </div>
        <div class="job-right">
          <span class="job-comp">{formatComp(job)}</span>
          <span class="job-date-line">
            {newlyPosted && <span class="chip new">New</span>}
            <span class="job-date">{postedAgo(job.posted_at)}</span>
          </span>
        </div>
      </div>
      <div class="job-hidden-line">
        <span>{customerFacingLabel(job.customer_facing_pct_band)}</span>
        <span>·</span>
        <span>{job.benefits_tags.length ? job.benefits_tags.join(" · ") : "Benefits not listed"}</span>
        <span>·</span>
        <span>Apply</span>
      </div>
    </a>
  );
}

export default function FilterRail({ jobs, companies, addedThisWeek }: Props) {
  const [filters, setFilters] = useUrlFilters();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const industryOptions = useMemo(
    () => Array.from(new Set(companies.flatMap((company) => company.industry_tags))).sort(),
    [companies]
  );
  const benefitOptions = useMemo(() => {
    const values = Array.from(new Set(jobs.flatMap((job) => job.benefits_tags))).sort();
    return [
      ...values.filter((value) => /visa/i.test(value)),
      ...values.filter((value) => /parent/i.test(value)),
      ...values.filter((value) => !/visa|parent/i.test(value))
    ].slice(0, 12);
  }, [jobs]);
  const filteredJobs = useMemo(() => filterJobs(jobs, filters), [jobs, filters]);
  const active = activeFilterCount(filters);

  return (
    <div>
      <div class="page-head">
        <div class="eyebrow">Forward deployed engineering roles</div>
        <h1 class="page-title">forward deployed: the fastest growing job in tech</h1>
        <p class="page-subhead">
          <span class="mono">{filteredJobs.length} of {jobs.length} roles · {addedThisWeek} added this week</span>
        </p>
      </div>
      <div class="list-toolbar">
        <SearchInput value={filters.q} onInput={(q) => setFilters({ ...filters, q })} />
        <div class="toolbar-row">
          <button
            class="filter-dropdown-button"
            type="button"
            aria-expanded={filtersOpen}
            onClick={() => setFiltersOpen((open) => !open)}
          >
            Filters{active > 0 ? ` (${active})` : ""}
          </button>
          <label class="sort-control">
            <span>Sort</span>
            <select
              value={filters.sort}
              onChange={(event) => {
                const sort = (event.currentTarget as HTMLSelectElement).value as FilterState["sort"];
                setFilters({ ...filters, sort });
              }}
            >
              {sortOptions.map(([value, label]) => (
                <option value={value} key={value}>{label}</option>
              ))}
            </select>
          </label>
          {active > 0 && (
            <button class="button-ghost" type="button" onClick={() => setFilters(defaultFilters)}>
              Clear all
            </button>
          )}
        </div>
        {filtersOpen && (
          <div class="filters-dropdown-panel">
            <FilterControls
              filters={filters}
              setFilters={setFilters}
              industryOptions={industryOptions}
              benefitOptions={benefitOptions}
            />
          </div>
        )}
      </div>
      <main aria-live="polite">
        <div class="job-list">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => <JobRow key={job.slug} job={job} />)
          ) : (
            <div class="empty-state">
              <p>No roles match those filters.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
