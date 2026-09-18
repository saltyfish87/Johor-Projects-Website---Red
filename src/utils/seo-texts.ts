/**
 * Shared SEO text (added 2026-09-18). Used by the app at runtime and by scripts/build-seo-static.ts
 * at build time so search engines and visitors see the same titles, descriptions and canonicals.
 * jbpropertyportal.my is the English guides site; the official project pages live on jbproperties.my.
 */
import { BlogPost, AreaGuide, DeveloperProfile } from "../types";

export const SITE_URL = "https://www.jbpropertyportal.my";
export const GREEN_SITE_URL = "https://www.jbproperties.my";

export const AGENT = {
  name: "Yee Woei Shyan",
  ren: "REN 46305",
  company: "IQI Realty Sdn Bhd",
  phone: "+60108278932",
  phoneDisplay: "+60 10-827 8932",
  email: "shyanyeews@gmail.com",
  sameAs: ["https://www.youtube.com/@shyanyee", "https://www.instagram.com/shyanyee/", "https://www.facebook.com/shyanyeeconsultant/", "https://wa.me/60108278932"]
};

/** Red project slug -> Green (official) project page slug */
const GREEN_SLUGS: Record<string, string> = {
  "aethera-residences": "aethera-residences",
  "causewayz-square-axis-tower-tower-a": "axis-tower",
  "causewayz-square-brixton-tower-tower-b": "brixton-tower",
  "causewayz-square-dover-tower-tower-d": "dover-tower",
  "coronade-twins": "coronade-twins",
  "gen-sphere": "gen-sphere",
  "m-grand-minori": "m-grand-minori",
  "princess-cove-rnf-phase-2": "princess-cove-phase-2",
  "princess-cove-rnf-phase-3": "princess-cove-phase-3"
};

/** Official listing page for a project (on jbproperties.my). Falls back to the Green home page. */
export function greenProjectUrl(redSlug: string): string {
  const g = GREEN_SLUGS[redSlug];
  return g ? `${GREEN_SITE_URL}/project/${g}` : `${GREEN_SITE_URL}/`;
}

export const HOME_SEO = {
  title: "Johor Bahru Property Guides, Areas & Developers | jbpropertyportal.my",
  description: "Independent guides to buying property in Johor Bahru: RTS Link impact, best areas near CIQ, foreign buyer rules, home loans, developer track records and living-in-JB-working-in-Singapore advice. By licensed negotiator Yee Woei Shyan (REN 46305, IQI Realty).",
  keywords: "Johor Bahru property guide, RTS Link property, best area to buy in JB, buy property near CIQ, foreigner buy property Johor, Malaysian home loan for foreigners, Johor Bahru developer review, living in JB working in Singapore, Johor Bahru property market outlook, JB new launch near RTS"
};

export const STATIC_SEO: Record<string, { title: string; description: string }> = {
  projects: { title: "Johor Bahru New Launch Projects near RTS Link | jbpropertyportal.my", description: "Overview of new-launch residential projects in Johor Bahru near the RTS Link and CIQ, with links to full listings, floor plans and prices on jbproperties.my." },
  compare: { title: "Compare Johor Bahru Projects Side by Side | jbpropertyportal.my", description: "Compare Johor Bahru new-launch projects side by side: price, unit sizes, RTS Link distance, tenure and maintenance fees." },
  "buying-guides": { title: "Buying Property in Johor Bahru: Guides for Singaporeans & Foreigners", description: "Step-by-step guides to buying property in Johor Bahru as a Singaporean or foreign buyer: minimum thresholds, state consent, stamp duty, loans and the RTS Link commute." },
  blog: { title: "Johor Bahru Property Insights & Market Analysis | jbpropertyportal.my", description: "Articles on the Johor Bahru property market: RTS Link impact, best areas near CIQ, market outlook, financing and cross-border living, written for Singapore and foreign buyers." }
};

export const blogSeo = (post: BlogPost) => ({
  title: post.seoTitle || post.metaTitle || `${post.title} | jbpropertyportal.my`,
  description: post.metaDescription || post.summary
});

export const areaSeo = (guide: AreaGuide) => ({
  title: `${guide.name} Property Guide | RTS ${guide.rtsDistance}, Yields ${guide.averageYield}`,
  description: `Guide to buying property in ${guide.name}, Johor Bahru: ${guide.rtsDistance} from the RTS Link, ${guide.ciqDistance} from CIQ, connectivity ${guide.connectivityScore}, average rental yield ${guide.averageYield}. ${guide.description.slice(0, 120)}`
});

export const developerSeo = (dev: DeveloperProfile) => ({
  title: `${dev.name} Johor Bahru Projects & Track Record | jbpropertyportal.my`,
  description: `${dev.name} (established ${dev.established}): developer profile, awards and current Johor Bahru projects. ${dev.description.slice(0, 140)}`
});
