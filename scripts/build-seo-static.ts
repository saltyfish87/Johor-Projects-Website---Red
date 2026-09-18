/**
 * Static SEO pre-render (added 2026-09-18). Runs after `vite build`.
 * Writes one real HTML file per page so search engines and AI crawlers see each page's own
 * title, description, canonical, JSON-LD and readable body without running JavaScript:
 *   dist/index.html, dist/projects, dist/compare, dist/buying-guides, dist/blog,
 *   dist/blog/<slug>, dist/area/<slug>, dist/developer/<slug>, dist/projects/<slug>
 * Project pages carry a canonical pointing to the official listing on jbproperties.my.
 */
import fs from "fs";
import path from "path";
import { projectsData } from "../src/data/projects-data";
import { blogPosts, areaGuides, developerProfiles } from "../src/data/blog-data";
import { SITE_URL, GREEN_SITE_URL, AGENT, HOME_SEO, STATIC_SEO, blogSeo, areaSeo, developerSeo, greenProjectUrl } from "../src/utils/seo-texts";

const cwd = process.cwd();
const distPath = path.join(cwd, "dist");
const indexPath = path.join(distPath, "index.html");
if (!fs.existsSync(indexPath)) { console.error("dist/index.html missing – run vite build first"); process.exit(1); }
const rawHtml = fs.readFileSync(indexPath, "utf-8");
if (!rawHtml.includes('<div id="root"></div>')) { console.error("dist/index.html has no empty #root – pre-render already applied?"); process.exit(1); }

const esc = (v: any) => String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const abs = (p: string) => (p === "/" ? `${SITE_URL}/` : `${SITE_URL}${p}`);
const today = new Date().toISOString().slice(0, 10);
const toIso = (d: string) => { const t = Date.parse(d); return isNaN(t) ? today : new Date(t).toISOString().slice(0, 10); };

const agentGraph = (canonical: string, name: string) => [
  { "@type": "RealEstateAgent", "@id": `${SITE_URL}/#agent`, "name": AGENT.name, "alternateName": "Johor Bahru Property Portal (jbpropertyportal.my)", "identifier": AGENT.ren,
    "telephone": AGENT.phone, "email": AGENT.email, "url": `${SITE_URL}/`, "parentOrganization": { "@type": "Organization", "name": AGENT.company },
    "areaServed": ["Johor Bahru", "Johor", "Malaysia"], "address": { "@type": "PostalAddress", "addressLocality": "Johor Bahru", "addressRegion": "Johor", "addressCountry": "MY" }, "sameAs": AGENT.sameAs },
  { "@type": "WebSite", "@id": `${SITE_URL}/#website`, "url": `${SITE_URL}/`, "name": "Johor Bahru Property Portal", "inLanguage": "en", "publisher": { "@id": `${SITE_URL}/#agent` } },
  { "@type": "WebPage", "@id": canonical, "url": canonical, "name": name, "inLanguage": "en", "isPartOf": { "@id": `${SITE_URL}/#website` } }
];
const crumbs = (items: [string, string][]) => ({ "@type": "BreadcrumbList", "itemListElement": items.map(([n, u], i) => ({ "@type": "ListItem", "position": i + 1, "name": n, ...(u ? { item: u } : {}) })) });

// Minimal markdown -> HTML for article bodies (headings, lists, bold, paragraphs)
function md(src: string): string {
  const inline = (s: string) => esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, '<a href="$2">$1</a>');
  const out: string[] = []; let list: string[] = []; let para: string[] = [];
  const flushList = () => { if (list.length) { out.push(`<ul>${list.map((l) => `<li>${inline(l)}</li>`).join("")}</ul>`); list = []; } };
  const flushPara = () => { if (para.length) { out.push(`<p>${inline(para.join(" "))}</p>`); para = []; } };
  for (const raw of src.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) { flushList(); flushPara(); continue; }
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) { flushList(); flushPara(); const lvl = Math.min(h[1].length, 4); out.push(`<h${lvl === 1 ? 2 : lvl}>${inline(h[2])}</h${lvl === 1 ? 2 : lvl}>`); continue; }
    const li = line.match(/^[-*]\s+(.*)$/);
    if (li) { flushPara(); list.push(li[1]); continue; }
    flushList(); para.push(line);
  }
  flushList(); flushPara();
  return out.join("\n");
}
// FAQ pairs from "#### question?" followed by an answer paragraph
function faqFromMarkdown(src: string): { q: string; a: string }[] {
  const faqs: { q: string; a: string }[] = []; const lines = src.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].trim().match(/^####\s+(.*\?)\s*$/);
    if (m) { let j = i + 1; while (j < lines.length && !lines[j].trim()) j++; if (j < lines.length && !/^#/.test(lines[j].trim())) faqs.push({ q: m[1], a: lines[j].trim() }); }
  }
  return faqs;
}

function applyHead(o: { bare: string; title: string; desc: string; canonical?: string; image?: string; graph: any[]; body: string }): string {
  const canonical = o.canonical || abs(o.bare);
  let out = rawHtml;
  out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(o.title)}</title>`);
  out = out.replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(o.desc)}" />`);
  out = out.replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${canonical}" />`);
  out = out.replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${abs(o.bare)}" />`);
  out = out.replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(o.title)}" />`);
  out = out.replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${esc(o.desc)}" />`);
  if (o.image) out = out.replace(/<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${esc(o.image)}" />`);
  out = out.replace(/<meta property="twitter:title" content="[^"]*" \/>/, `<meta property="twitter:title" content="${esc(o.title)}" />`);
  out = out.replace(/<meta property="twitter:description" content="[^"]*" \/>/, `<meta property="twitter:description" content="${esc(o.desc)}" />`);
  const ld = JSON.stringify({ "@context": "https://schema.org", "@graph": o.graph }).replace(/<\//g, "<\\/");
  out = out.replace(/<script id="seo-json-ld" type="application\/ld\+json"><\/script>/, `<script id="seo-json-ld" type="application/ld+json">${ld}</script>`);
  out = out.replace('<div id="root"></div>', `<div id="root">${o.body}</div>`);
  return out;
}

const wrap = (inner: string) => `<div style="max-width:1000px;margin:0 auto;padding:32px 20px;font-family:system-ui,-apple-system,sans-serif;color:#0f172a;line-height:1.7">${inner}</div>`;
const nav = (items: [string, string][]) => `<nav style="font-size:14px;color:#64748b;margin-bottom:20px">${items.map(([n, u], i) => u && i < items.length - 1 ? `<a href="${u}" style="color:#0f766e;text-decoration:none">${esc(n)}</a> &gt; ` : `<span>${esc(n)}</span>`).join("")}</nav>`;
const agentLine = `<p style="font-size:13px;color:#64748b;margin-top:32px">Licensed real estate negotiator ${AGENT.name} (${AGENT.ren}), ${AGENT.company}. WhatsApp <a href="https://wa.me/60108278932">${AGENT.phoneDisplay}</a>. Not a developer website.</p>`;
const projectsRelated = (filter?: (p: any) => boolean) => {
  const list = (projectsData as any[]).filter(filter || (() => true));
  return list.length ? `<h2>Related projects</h2><ul>${list.map((p) => `<li><a href="${abs(`/projects/${p.slug}`)}">${esc(p.project_name)}</a> — ${esc([p.area, p.tenure, p.price_min ? `from ${p.price_min}` : ""].filter(Boolean).join(" · "))} (<a href="${greenProjectUrl(p.slug)}">full listing on jbproperties.my</a>)</li>`).join("")}</ul>` : "";
};

function write(rel: string, html: string) { const dir = path.join(distPath, rel); if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); fs.writeFileSync(path.join(dir, "index.html"), html, "utf-8"); }
let n = 0;

// Home
{
  const c = abs("/");
  const body = wrap(`<h1>Johor Bahru Property Guides, Areas &amp; Developers</h1><p>${esc(HOME_SEO.description)}</p>
    <h2>Buying guides &amp; insights</h2><ul>${blogPosts.map((b) => `<li><a href="${abs(`/blog/${b.slug}`)}">${esc(b.title)}</a> — ${esc(b.summary)}</li>`).join("")}</ul>
    <h2>Area guides</h2><ul>${areaGuides.map((a) => `<li><a href="${abs(`/area/${a.slug}`)}">${esc(a.name)}</a> — RTS ${esc(a.rtsDistance)}, yields ${esc(a.averageYield)}</li>`).join("")}</ul>
    <h2>Developers</h2><ul>${developerProfiles.map((d) => `<li><a href="${abs(`/developer/${d.slug}`)}">${esc(d.name)}</a> — est. ${esc(d.established)}</li>`).join("")}</ul>
    ${projectsRelated()}${agentLine}`);
  write("", applyHead({ bare: "/", title: HOME_SEO.title, desc: HOME_SEO.description, graph: [...agentGraph(c, HOME_SEO.title),
    { "@type": "ItemList", "@id": `${c}#guides`, "name": "Johor Bahru property guides", "itemListElement": blogPosts.map((b, i) => ({ "@type": "ListItem", "position": i + 1, "name": b.title, "url": abs(`/blog/${b.slug}`) })) }], body })); n++;
}
// Static list pages
for (const key of Object.keys(STATIC_SEO)) {
  const bare = `/${key}`; const c = abs(bare); const s = STATIC_SEO[key];
  let inner = `<h1>${esc(s.title.split(" | ")[0])}</h1><p>${esc(s.description)}</p>`;
  if (key === "blog" || key === "buying-guides") inner += `<ul>${blogPosts.map((b) => `<li><a href="${abs(`/blog/${b.slug}`)}">${esc(b.title)}</a> — ${esc(b.summary)}</li>`).join("")}</ul>`;
  else inner += projectsRelated();
  write(key, applyHead({ bare, title: s.title, desc: s.description, graph: [...agentGraph(c, s.title), crumbs([["Home", abs("/")], [s.title.split(" | ")[0], c]])], body: wrap(nav([["Home", abs("/")], [key, ""]]) + inner + agentLine) })); n++;
}
// Blog posts
for (const b of blogPosts) {
  const bare = `/blog/${b.slug}`; const c = abs(bare); const s = blogSeo(b); const faqs = faqFromMarkdown(b.content || "");
  const graph: any[] = [...agentGraph(c, s.title), crumbs([["Home", abs("/")], ["Blog", abs("/blog")], [b.title, c]]),
    { "@type": "BlogPosting", "@id": `${c}#article`, "headline": b.title, "description": s.description, "image": b.image ? [b.image] : undefined, "datePublished": toIso(b.date), "dateModified": toIso(b.date), "inLanguage": "en",
      "author": { "@type": "Person", "name": `${AGENT.name} (${AGENT.ren})`, "url": `${SITE_URL}/` }, "publisher": { "@id": `${SITE_URL}/#agent` }, "mainEntityOfPage": { "@type": "WebPage", "@id": c }, "articleSection": b.category }];
  if (faqs.length) graph.push({ "@type": "FAQPage", "@id": `${c}#faq`, "mainEntity": faqs.map((f) => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })) });
  const body = wrap(`${nav([["Home", abs("/")], ["Blog", abs("/blog")], [b.title, ""]])}<p style="font-size:13px;color:#64748b">${esc(b.category)} · ${esc(b.date)} · ${esc(b.readTime)}</p><h1>${esc(b.title)}</h1><p style="font-size:17px;color:#475569">${esc(b.summary)}</p>${b.image ? `<img src="${esc(b.image)}" alt="${esc(b.title)}" loading="lazy" style="max-width:100%;border-radius:12px">` : ""}${md(b.content || "")}${agentLine}`);
  write(path.join("blog", b.slug), applyHead({ bare, title: s.title, desc: s.description, image: b.image, graph, body })); n++;
}
// Area guides
for (const a of areaGuides) {
  const bare = `/area/${a.slug}`; const c = abs(bare); const s = areaSeo(a);
  const body = wrap(`${nav([["Home", abs("/")], ["Areas", abs("/")], [a.name, ""]])}<h1>${esc(a.name)} — Johor Bahru property guide</h1><p>${esc(a.description)}</p>
    <ul><li><strong>Distance to RTS Link:</strong> ${esc(a.rtsDistance)}</li><li><strong>Distance to CIQ:</strong> ${esc(a.ciqDistance)}</li><li><strong>Connectivity score:</strong> ${esc(a.connectivityScore)}</li><li><strong>Average rental yield:</strong> ${esc(a.averageYield)}</li></ul>
    <h2>Highlights</h2><ul>${(a.highlights || []).map((h) => `<li>${esc(h)}</li>`).join("")}</ul>${projectsRelated((p) => String(p.area || "").toLowerCase().includes(a.name.split(" ")[0].toLowerCase()))}${agentLine}`);
  write(path.join("area", a.slug), applyHead({ bare, title: s.title, desc: s.description, graph: [...agentGraph(c, s.title), crumbs([["Home", abs("/")], [a.name, c]]), { "@type": "Place", "@id": `${c}#place`, "name": a.name, "description": a.description, "address": { "@type": "PostalAddress", "addressLocality": "Johor Bahru", "addressRegion": "Johor", "addressCountry": "MY" } }], body })); n++;
}
// Developers
for (const d of developerProfiles) {
  const bare = `/developer/${d.slug}`; const c = abs(bare); const s = developerSeo(d);
  const body = wrap(`${nav([["Home", abs("/")], ["Developers", abs("/")], [d.name, ""]])}<h1>${esc(d.name)}</h1><p>${esc(d.description)}</p><p><strong>Established:</strong> ${esc(d.established)}</p>
    ${(d.awards || []).length ? `<h2>Awards</h2><ul>${d.awards.map((w) => `<li>${esc(w)}</li>`).join("")}</ul>` : ""}${projectsRelated((p) => String(p.developer || "").toLowerCase().includes(d.name.split(" ")[0].toLowerCase()))}${agentLine}`);
  write(path.join("developer", d.slug), applyHead({ bare, title: s.title, desc: s.description, graph: [...agentGraph(c, s.title), crumbs([["Home", abs("/")], [d.name, c]]), { "@type": "Organization", "@id": `${c}#org`, "name": d.name, "description": d.description, "foundingDate": d.established, "url": c }], body })); n++;
}
// Project pages: canonical -> official listing on jbproperties.my
for (const p of projectsData as any[]) {
  const bare = `/projects/${p.slug}`; const c = abs(bare); const official = greenProjectUrl(p.slug);
  const title = p.seo_title || `${p.project_name} Johor Bahru`; const desc = p.seo_description || `${p.project_name} in ${p.area}, Johor Bahru by ${p.developer}.`;
  const specs: [string, string][] = [["Developer", p.developer], ["Area", p.area], ["Tenure", p.tenure], ["Price range", [p.price_min, p.price_max].filter(Boolean).join(" – ")], ["Built-up", p.built_up_min ? `${p.built_up_min} – ${p.built_up_max} sq ft` : ""], ["Bedrooms", p.bedrooms], ["Total units", p.total_units], ["Completion", [p.completion_status, p.completion_year].filter(Boolean).join(" ")]];
  const body = wrap(`${nav([["Home", abs("/")], ["Projects", abs("/projects")], [p.project_name, ""]])}<p style="background:#ecfdf5;border:1px solid #a7f3d0;border-radius:12px;padding:12px 16px">Full listing with floor plans, pricing and photos: <a href="${official}" style="font-weight:700;color:#047857">${esc(p.project_name)} on jbproperties.my &rarr;</a></p>
    <h1>${esc(p.project_name)}</h1><p>${esc(desc)}</p><ul>${specs.filter(([, v]) => v).map(([k, v]) => `<li><strong>${k}:</strong> ${esc(v)}</li>`).join("")}</ul>${p.description ? `<p>${esc(p.description)}</p>` : ""}${agentLine}`);
  write(path.join("projects", p.slug), applyHead({ bare, title, desc, canonical: official, graph: [...agentGraph(c, title), crumbs([["Home", abs("/")], ["Projects", abs("/projects")], [p.project_name, c]]), { "@type": "WebPage", "@id": `${c}#summary`, "url": c, "name": title, "mainEntityOfPage": official, "isPartOf": { "@id": `${SITE_URL}/#website` } }], body })); n++;
}
console.log(`✅ [SEO Static Build] ${n} pages written (home, ${Object.keys(STATIC_SEO).length} lists, ${blogPosts.length} articles, ${areaGuides.length} areas, ${developerProfiles.length} developers, ${projectsData.length} project summaries)`);
