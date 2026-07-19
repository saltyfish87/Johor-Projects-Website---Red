import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { projectsData } from "./src/data/projects-data.js";
import { blogPosts, areaGuides, developerProfiles } from "./src/data/blog-data.js";

// Helper for ESM paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = "https://jbpropertyportal.my";

const staticPages = [
  "",
  "#projects",
  "#compare",
  "#buying-guides",
  "#blog"
];

function generateSitemap() {
  const today = new Date().toISOString().split("T")[0];
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Helper to add URL
  const addUrl = (route: string, priority: string, freq: string = "weekly") => {
    const suffix = route.startsWith("#") || route === "" ? route : `#${route}`;
    const url = `${BASE_URL}/${suffix}`;
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

  // 2. Project Details
  projectsData.forEach(proj => {
    addUrl(`projects/${proj.slug}`, "0.9", "weekly");
  });

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
  console.log(`[Sitemap Generator] Successfully generated public/sitemap.xml with ${projectsData.length + blogPosts.length + areaGuides.length + developerProfiles.length + staticPages.length} entries.`);

  // Write sitemap.xml to dist folder if it exists
  const distDir = path.join(__dirname, "dist");
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, "sitemap.xml"), xml, "utf8");
    console.log("[Sitemap Generator] Copied sitemap.xml to dist/");
  }
}

generateSitemap();
