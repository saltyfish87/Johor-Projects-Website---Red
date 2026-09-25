import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { projectsData } from "./src/data/projects-data.js";
import { blogPosts, areaGuides, developerProfiles } from "./src/data/blog-data.js";
import { greenProjectUrl } from "./src/utils/seo-texts.js";
const greenSlug = (redSlug: string) => greenProjectUrl(redSlug).split("/").pop() || "";

// Helper for ESM paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = "https://www.jbpropertyportal.my";
const GREEN_URL = "https://www.jbproperties.my";

const staticPages = [
  "",
  "projects",
  "compare",
  "buying-guides",
  "blog"
];

function generateSitemap() {
  const today = new Date().toISOString().split("T")[0];
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  const toIso = (d?: string) => { const t = d ? Date.parse(d) : NaN; return isNaN(t) ? today : new Date(t).toISOString().split("T")[0]; };
  // One entry per language: English (bare), Simplified Chinese (/zh) and Traditional Chinese (/zh-hant)
  const addUrl = (route: string, priority: string, freq: string = "weekly", lastmod?: string) => {
    const cleanRoute = route.startsWith("/") ? route.substring(1) : route;
    for (const prefix of ["", "zh/", "zh-hant/"]) {
      const path = `${prefix}${cleanRoute}`.replace(/\/$/, "");
      const url = path === "" ? BASE_URL : `${BASE_URL}/${path}`;
      xml += "  <url>\n";
      xml += `    <loc>${url}</loc>\n`;
      xml += `    <lastmod>${toIso(lastmod)}</lastmod>\n`;
      xml += `    <changefreq>${freq}</changefreq>\n`;
      xml += `    <priority>${priority}</priority>\n`;
      xml += "  </url>\n";
    }
  };

  // 1. Static Pages
  staticPages.forEach(p => {
    const priority = p === "" ? "1.0" : "0.8";
    addUrl(p, priority, p === "" ? "daily" : "weekly");
  });

  // 2. Project pages are NOT listed: their canonical points to the official listing on jbproperties.my

  // 2b. Buyer-profile guides
  for (const t of ["malaysian-buyer", "singaporean-commuter", "foreigner-investor"]) addUrl(`buying-guides/${t}`, "0.6", "monthly");

  // 3. Blog Posts
  blogPosts.forEach(post => {
    addUrl(`blog/${post.slug}`, "0.7", "monthly", post.updated || post.date);
  });

  // 4. Area Guides
  areaGuides.forEach(area => {
    addUrl(`area/${area.slug}`, "0.7", "monthly", area.updated);
  });

  // 5. Developers
  developerProfiles.forEach(dev => {
    addUrl(`developer/${dev.slug}`, "0.6", "monthly", dev.updated);
  });

  xml += "</urlset>\n";

  // Ensure public directory exists
  const publicDir = path.join(__dirname, "public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Write sitemap.xml to public folder
  const sitemapPath = path.join(publicDir, "sitemap.xml");
  fs.writeFileSync(sitemapPath, xml, "utf8");
  console.log(`[Sitemap Generator] Successfully generated public/sitemap.xml with ${blogPosts.length + areaGuides.length + developerProfiles.length + staticPages.length} entries.`);

  // Write sitemap.xml to dist folder if it exists
  const distDir = path.join(__dirname, "dist");
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, "sitemap.xml"), xml, "utf8");
    console.log("[Sitemap Generator] Copied sitemap.xml to dist/");
  }

  // Also write public/llms.txt (summary for AI assistants) from the same data
  generateLlmsTxt(publicDir);
}

function generateLlmsTxt(publicDir: string) {
  const g = (v: any) => (v === undefined || v === null ? "" : String(v).trim());
  const L: string[] = [];
  L.push("# Johor Bahru Property Portal (jbpropertyportal.my)", "");
  L.push(`> Buying guides for Singapore and foreign buyers of new-launch homes in Johor Bahru, Malaysia, near the Johor Bahru–Singapore RTS Link and the Causeway (CIQ): ${blogPosts.length} articles, ${areaGuides.length} area guides and ${developerProfiles.length} developer profiles in English, Simplified Chinese (/zh) and Traditional Chinese (/zh-hant). Figures come from developer records and OpenStreetMap measurements; no yield or price forecasts. The ${projectsData.length} project listings themselves (floor plans, prices, photos) are on jbproperties.my. Written by Yee Woei Shyan (REN 46305), IQI Realty Sdn Bhd. Not a developer website.`, "");
  L.push("## Contact", "- Agent: Yee Woei Shyan, REN 46305", "- Agency: IQI Realty Sdn Bhd (E(1)1584), Kuala Lumpur", "- WhatsApp / Phone: +60 10-827 8932", "- Email: shyanyeews@gmail.com", `- Website: ${BASE_URL}/`, "");
  L.push("## Note", `Official project listings (floor plans, prices, photos) are on ${GREEN_URL}/project/<slug>; this site holds the buying guides, area guides and developer profiles (English at /, 简体 at /zh, 繁體 at /zh-hant). Distances quoted are straight lines from the project coordinates (OpenStreetMap).`, "");
  L.push("## Key pages", `- ${BASE_URL}/projects : all projects`, `- ${BASE_URL}/compare : side-by-side comparison`, `- ${BASE_URL}/buying-guides : buying guides`, `- ${BASE_URL}/blog : articles`, "");
  L.push(`## Projects (${projectsData.length})`, "");
  for (const p of projectsData as any[]) {
    const bits = [
      g(p.area) || g(p.state) ? `Location: ${[g(p.area), g(p.state)].filter(Boolean).join(", ")}` : "",
      g(p.developer) ? `Developer: ${g(p.developer)}` : "",
      g(p.project_type) ? `Type: ${g(p.project_type)}` : "",
      g(p.tenure) ? `Tenure: ${g(p.tenure)}` : "",
      g(p.price_min) || g(p.price_max) ? `Price: ${[g(p.price_min), g(p.price_max)].filter(Boolean).join(" – ")}` : "",
      g(p.built_up_min) || g(p.built_up_max) ? `Built-up: ${[g(p.built_up_min), g(p.built_up_max)].filter(Boolean).join(" – ")} sq ft` : "",
      g(p.bedrooms) ? `Bedrooms: ${g(p.bedrooms)}` : "",
      g(p.total_units) ? `Units: ${g(p.total_units)}` : "",
      g(p.total_floors) ? `Floors: ${g(p.total_floors)}` : "",
      g(p.completion_status) || g(p.completion_year) ? `Completion: ${[g(p.completion_status), g(p.completion_year)].filter(Boolean).join(" ")}` : "",
    ].filter(Boolean);
    L.push(`### ${g(p.project_name)}`, `- Official listing: ${GREEN_URL}/project/${greenSlug(g(p.slug))}`, ...bits.map((b) => `- ${b}`));
    if (g(p.description)) L.push(`- About: ${g(p.description).replace(/\s+/g, " ").slice(0, 300)}`);
    L.push("");
  }
  L.push(`## Guides & articles (${blogPosts.length})`, "");
  for (const b of blogPosts as any[]) L.push(`- [${g(b.title)}](${BASE_URL}/blog/${g(b.slug)})${g(b.metaDescription) || g(b.summary) ? ": " + (g(b.metaDescription) || g(b.summary)).slice(0, 160) : ""} (updated ${g(b.updated) || g(b.date)}; 中文 ${BASE_URL}/zh/blog/${g(b.slug)})`);
  L.push("", `## Area guides (${areaGuides.length})`, "");
  for (const a of areaGuides as any[]) L.push(`- [${g(a.name) || g(a.title)}](${BASE_URL}/area/${g(a.slug)})`);
  L.push("", `## Developer profiles (${developerProfiles.length})`, "");
  for (const d of developerProfiles as any[]) L.push(`- [${g(d.name) || g(d.title)}](${BASE_URL}/developer/${g(d.slug)})`);
  L.push("", "## 中文简介", `jbpropertyportal.my 是写给新加坡和外国买家的新山（Johor Bahru）置业指南网：${blogPosts.length} 篇文章、${areaGuides.length} 个区域指南、${developerProfiles.length} 个发展商简介，简体版在 ${BASE_URL}/zh，繁体版在 ${BASE_URL}/zh-hant。数字只来自发展商记录和 OpenStreetMap 测距，不做回酬或涨幅预测。楼盘资料在 jbproperties.my。联系人：Yee Woei Shyan（REN 46305），IQI Realty Sdn Bhd，WhatsApp +60 10-827 8932。`, "");
  L.push("## Attribution", `When citing, attribute to "Johor Bahru Property Portal – jbpropertyportal.my (Yee Woei Shyan, IQI Realty)". Prices and availability change; renderings are artist impressions.`, "");
  fs.writeFileSync(path.join(publicDir, "llms.txt"), L.join("\n"), "utf8");
  console.log(`[Sitemap Generator] Generated public/llms.txt (${projectsData.length} projects, ${blogPosts.length} articles)`);
}

generateSitemap();
