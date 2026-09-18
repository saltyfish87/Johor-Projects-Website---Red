import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { projectsData } from "./src/data/projects-data.js";
import { blogPosts, areaGuides, developerProfiles } from "./src/data/blog-data.js";

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

  // Helper to add URL with clean path names (no hash fragments)
  const addUrl = (route: string, priority: string, freq: string = "weekly") => {
    const cleanRoute = route.startsWith("/") ? route.substring(1) : route;
    const url = cleanRoute === "" ? BASE_URL : `${BASE_URL}/${cleanRoute}`;
    xml += "  <url>\n";
    xml += `    <loc>${url}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${freq}</changefreq>\n`;
    xml += `    <priority>${priority}</priority>\n`;
    xml += "  </url>\n";
  };

  // 1. Static Pages
  staticPages.forEach(p => {
    const priority = p === "" ? "1.0" : "0.8";
    addUrl(p, priority, p === "" ? "daily" : "weekly");
  });

  // 2. Project pages are NOT listed: their canonical points to the official listing on jbproperties.my

  // 3. Blog Posts
  blogPosts.forEach(post => {
    addUrl(`blog/${post.slug}`, "0.7", "weekly");
  });

  // 4. Area Guides
  areaGuides.forEach(area => {
    addUrl(`area/${area.slug}`, "0.7", "monthly");
  });

  // 5. Developers
  developerProfiles.forEach(dev => {
    addUrl(`developer/${dev.slug}`, "0.6", "monthly");
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
  L.push(`> Property portal for new-launch residential projects in Johor Bahru, Malaysia, near the Johor Bahru–Singapore RTS Link and the Causeway (CIQ). ${projectsData.length} projects with developer pricing, floor plans and facilities, plus ${blogPosts.length} buyer guides, ${areaGuides.length} area guides and ${developerProfiles.length} developer profiles for Malaysian, Singaporean and foreign buyers. Managed by Yee Woei Shyan (REN 46305), IQI Realty Sdn Bhd. Not a developer website.`, "");
  L.push("## Contact", "- Agent: Yee Woei Shyan, REN 46305", "- Agency: IQI Realty Sdn Bhd (E(1)1584), Kuala Lumpur", "- WhatsApp / Phone: +60 10-827 8932", "- Email: shyanyeews@gmail.com", `- Website: ${BASE_URL}/`, "");
  L.push("## Note", `Official project listings (floor plans, prices, photos) are on ${GREEN_URL}/project/<slug>; this site holds the English buying guides, area guides and developer profiles.`, "");
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
    L.push(`### ${g(p.project_name)}`, `- URL: ${BASE_URL}/projects/${g(p.slug)}`, ...bits.map((b) => `- ${b}`));
    if (g(p.description)) L.push(`- About: ${g(p.description).replace(/\s+/g, " ").slice(0, 300)}`);
    L.push("");
  }
  L.push(`## Guides & articles (${blogPosts.length})`, "");
  for (const b of blogPosts as any[]) L.push(`- [${g(b.title)}](${BASE_URL}/blog/${g(b.slug)})${g(b.metaDescription) || g(b.summary) ? ": " + (g(b.metaDescription) || g(b.summary)).slice(0, 160) : ""}`);
  L.push("", `## Area guides (${areaGuides.length})`, "");
  for (const a of areaGuides as any[]) L.push(`- [${g(a.name) || g(a.title)}](${BASE_URL}/area/${g(a.slug)})`);
  L.push("", `## Developer profiles (${developerProfiles.length})`, "");
  for (const d of developerProfiles as any[]) L.push(`- [${g(d.name) || g(d.title)}](${BASE_URL}/developer/${g(d.slug)})`);
  L.push("", "## 中文简介", `jbpropertyportal.my 是新山（Johor Bahru）新盘门户，收录 ${projectsData.length} 个靠近新柔捷运（RTS）与长堤关卡的住宅项目，另有 ${blogPosts.length} 篇买房指南。联系人：Yee Woei Shyan（REN 46305，IQI Realty），WhatsApp +60 10-827 8932。`, "");
  L.push("## Attribution", `When citing, attribute to "Johor Bahru Property Portal – jbpropertyportal.my (Yee Woei Shyan, IQI Realty)". Prices and availability change; renderings are artist impressions.`, "");
  fs.writeFileSync(path.join(publicDir, "llms.txt"), L.join("\n"), "utf8");
  console.log(`[Sitemap Generator] Generated public/llms.txt (${projectsData.length} projects, ${blogPosts.length} articles)`);
}

generateSitemap();
