import * as cheerio from "cheerio";
import type { Company } from "../../src/lib/types";
import { fetchText } from "../lib/http";
import { inferLocationType, splitLocations } from "../lib/normalise";
import type { RawJob, SourceAdapter } from "../lib/types";

export const workable: SourceAdapter = {
  async fetchJobs(company: Company) {
    if (!company.ats_slug) {
      return { jobs: [] };
    }
    const html = await fetchText(`https://apply.workable.com/${company.ats_slug}/`);
    const $ = cheerio.load(html);
    const jobs: RawJob[] = [];
    $("[data-ui='job'], .job, a[href*='/j/']").each((index, element) => {
      const link = $(element).is("a") ? $(element) : $(element).find("a").first();
      const href = link.attr("href");
      const title = link.text().trim() || $(element).find("h2,h3").first().text().trim();
      if (!href || !title) {
        return;
      }
      const applyUrl = new URL(href, `https://apply.workable.com/${company.ats_slug}/`).toString();
      jobs.push({
        id: `${company.slug}-${index}`,
        title,
        location: $(element).text(),
        description: title,
        apply_url: applyUrl,
        source_url: applyUrl,
        posted_at: null
      });
    });
    return { jobs };
  },
  normalise(raw, company) {
    const locations = splitLocations(raw.location);
    return {
      company,
      title: raw.title,
      location_type: inferLocationType(locations),
      locations,
      description_md: raw.description,
      apply_url: raw.apply_url,
      source_provider: "workable",
      source_url: raw.source_url,
      posted_at: raw.posted_at ?? new Date().toISOString(),
      comp_base_min: null,
      comp_base_max: null,
      comp_currency: "USD"
    };
  }
};
