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

export const areaSeo = (guide: AreaGuide, language = "EN") => language === "ZH"
  ? { title: `${guide.name}：新山置业区域指南 | jbpropertyportal.my`, description: `${guide.where} ${guide.description.slice(0, 110)}` }
  : { title: `${guide.name}: Johor Bahru Area Guide | jbpropertyportal.my`, description: `${guide.where} ${guide.description.slice(0, 130)}` };

export const developerSeo = (dev: DeveloperProfile, language = "EN") => language === "ZH"
  ? { title: `${dev.name}在新山的挂牌项目 | jbpropertyportal.my`, description: dev.description.slice(0, 150) }
  : { title: `${dev.name}: Johor Bahru Projects | jbpropertyportal.my`, description: dev.description.slice(0, 155) };

/** Chinese titles for the fixed pages (used by /zh and /zh-hant) */
export const HOME_SEO_ZH = {
  title: "新山置业指南：区域、发展商、新柔捷运 | jbpropertyportal.my",
  description: "给新加坡和外国买家的新山置业指南：新柔捷运、关卡附近的区域、外国人购屋规定、房贷、发展商记录，以及住新山在新加坡上班的实际安排。持牌房产经纪 Yee Woei Shyan（REN 46305，IQI Realty）编写。"
};
export const STATIC_SEO_ZH: Record<string, { title: string; description: string }> = {
  projects: { title: "新山捷运附近的新楼盘 | jbpropertyportal.my", description: "新山捷运和关卡附近的新楼盘概览，完整资料、户型图和价格在 jbproperties.my。" },
  compare: { title: "新山新楼盘并排比较 | jbpropertyportal.my", description: "并排比较新山新楼盘：价格、面积、离捷运站距离、地契和管理费。" },
  "buying-guides": { title: "在新山买房：新加坡人与外国人指南 | jbpropertyportal.my", description: "新加坡人和外国买家在新山买房的分步指南：门槛价、州政府批准、印花税、贷款和捷运通勤。" },
  blog: { title: "新山房产指南与市场文章 | jbpropertyportal.my", description: "为新加坡和外国买家写的新山房产文章：新柔捷运、关卡附近的区域、市场现况、贷款和跨境生活。" }
};
