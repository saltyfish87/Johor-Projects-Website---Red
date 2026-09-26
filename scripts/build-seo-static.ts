/**
 * Static SEO pre-render (2026-09-18, rewritten 2026-09-25). Runs after `vite build`.
 * Writes one real HTML file per page in three languages so search engines and AI crawlers see each
 * page's own title, description, canonical, hreflang, JSON-LD and readable body without JavaScript:
 *   /            /blog  /buying-guides  /buying-guides/<type>  /projects  /compare
 *   /blog/<slug>  /area/<slug>  /developer/<slug>          (English)
 *   /zh/...                                                 (Simplified Chinese, hand-written)
 *   /zh-hant/...                                            (Traditional Chinese, OpenCC from /zh)
 *   /projects/<slug>  English only, canonical -> official listing on jbproperties.my
 * Also copies llms.txt into dist. The sitemap comes from generate-sitemap.ts.
 */
import fs from "fs";
import path from "path";
// @ts-ignore — no types shipped
import * as OpenCC from "opencc-js";
import { projectsData } from "../src/data/projects-data";
import { blogPosts, areaGuides, developerProfiles } from "../src/data/blog-data";
import { blogPostsZh, areaGuidesZh, developerProfilesZh, CATEGORY_ZH, UI_ZH } from "../src/data/blog-data.zh";
import { buyingGuides } from "../src/data/buying-guides";
import { greenProject, greenUrl, greenHome, greenHero, distanceToBukitChagar, nearestCheckpoint, kmText, GREEN_PROJECTS } from "../src/data/green-index";
import { SITE_URL, AGENT, HOME_SEO, HOME_SEO_ZH, STATIC_SEO, STATIC_SEO_ZH, blogSeo, areaSeo, developerSeo, greenProjectUrl } from "../src/utils/seo-texts";

type Lang = "en" | "zh";
const cwd = process.cwd();
const distPath = path.join(cwd, "dist");
const indexPath = path.join(distPath, "index.html");
if (!fs.existsSync(indexPath)) { console.error("dist/index.html missing – run vite build first"); process.exit(1); }
const rawHtml = fs.readFileSync(indexPath, "utf-8");
if (!rawHtml.includes('<div id="root"></div>')) { console.error("dist/index.html has no empty #root – pre-render already applied?"); process.exit(1); }

const esc = (v: any) => String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const today = new Date().toISOString().slice(0, 10);
const toIso = (d?: string) => { const t = d ? Date.parse(d) : NaN; return isNaN(t) ? today : new Date(t).toISOString().slice(0, 10); };
/** "/blog/x" + "zh" -> https://.../zh/blog/x ; "/" + "en" -> https://.../ */
const absUrl = (bare: string, lang: string) => {
  const prefix = lang === "en" ? "" : `/${lang}`;
  const p = bare === "/" ? "" : bare;
  return `${SITE_URL}${prefix}${p}` + (prefix === "" && p === "" ? "/" : "");
};
const HTML_LANG: Record<string, string> = { en: "en", zh: "zh-CN" };
const hreflangBlock = (bare: string) =>
  `    <link rel="alternate" hreflang="en" href="${absUrl(bare, "en")}" />\n` +
  `    <link rel="alternate" hreflang="zh-CN" href="${absUrl(bare, "zh")}" />\n` +
  `    <link rel="alternate" hreflang="zh-Hant" href="${absUrl(bare, "zh-hant")}" />\n` +
  `    <link rel="alternate" hreflang="x-default" href="${absUrl(bare, "en")}" />\n`;

const T = (lang: Lang, en: string, zh: string) => (lang === "zh" ? zh : en);

const agentGraph = (lang: Lang, canonical: string, name: string) => [
  { "@type": "RealEstateAgent", "@id": `${SITE_URL}/#agent`, "name": AGENT.name, "alternateName": ["Johor Bahru Property Portal (jbpropertyportal.my)", "Shyan Yee"], "identifier": AGENT.ren,
    "telephone": AGENT.phone, "email": AGENT.email, "url": `${SITE_URL}/`, "image": greenHero("aethera-residences"), "parentOrganization": { "@type": "Organization", "name": AGENT.company },
    "areaServed": ["Johor Bahru", "Johor", "Malaysia"], "address": { "@type": "PostalAddress", "addressLocality": "Johor Bahru", "addressRegion": "Johor", "addressCountry": "MY" }, "sameAs": AGENT.sameAs },
  { "@type": "WebSite", "@id": `${SITE_URL}/#website`, "url": `${SITE_URL}/`, "name": "Johor Bahru Property Portal", "inLanguage": ["en", "zh-CN", "zh-Hant"], "publisher": { "@id": `${SITE_URL}/#agent` } },
  { "@type": "WebPage", "@id": canonical, "url": canonical, "name": name, "inLanguage": HTML_LANG[lang], "isPartOf": { "@id": `${SITE_URL}/#website` } }
];
const crumbs = (items: [string, string][]) => ({ "@type": "BreadcrumbList", "itemListElement": items.map(([n, u], i) => ({ "@type": "ListItem", "position": i + 1, "name": n, ...(u ? { item: u } : {}) })) });

// Minimal markdown -> HTML for article bodies (headings, lists, tables, bold, links, paragraphs)
function md(src: string): string {
  const inline = (s: string) => esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, '<a href="$2" style="color:#047857;font-weight:600">$1</a>');
  const out: string[] = []; let list: string[] = []; let olist: string[] = []; let para: string[] = []; let table: string[] = [];
  const flushList = () => { if (list.length) { out.push(`<ul>${list.map((l) => `<li>${inline(l)}</li>`).join("")}</ul>`); list = []; } if (olist.length) { out.push(`<ol>${olist.map((l) => `<li>${inline(l)}</li>`).join("")}</ol>`); olist = []; } };
  const flushPara = () => { if (para.length) { out.push(`<p>${inline(para.join(" "))}</p>`); para = []; } };
  const flushTable = () => {
    if (!table.length) return;
    const rows = table.map((r) => r.replace(/^\||\|$/g, "").split("|").map((c) => c.trim())).filter((r) => !r.every((c) => /^:?-+:?$/.test(c)));
    const [head, ...body] = rows;
    out.push(`<table style="border-collapse:collapse;width:100%;margin:12px 0;font-size:15px"><thead><tr>${head.map((h) => `<th style="text-align:left;padding:8px;border-bottom:2px solid #e2e8f0">${inline(h)}</th>`).join("")}</tr></thead><tbody>${body.map((r) => `<tr>${r.map((c) => `<td style="padding:8px;border-bottom:1px solid #e2e8f0">${inline(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>`);
    table = [];
  };
  for (const raw of src.split(/\r?\n/)) {
    const line = raw.trim();
    if (line.startsWith("|")) { flushList(); flushPara(); table.push(line); continue; }
    flushTable();
    if (!line) { flushList(); flushPara(); continue; }
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) { flushList(); flushPara(); const lvl = Math.min(Math.max(h[1].length, 2), 4); out.push(`<h${lvl}>${inline(h[2])}</h${lvl}>`); continue; }
    const li = line.match(/^[-*]\s+(.*)$/);
    if (li) { flushPara(); list.push(li[1]); continue; }
    const ol = line.match(/^\d+\.\s+(.*)$/);
    if (ol) { flushPara(); olist.push(ol[1]); continue; }
    flushList(); para.push(line);
  }
  flushTable(); flushList(); flushPara();
  return out.join("\n");
}
// FAQ pairs from "#### question?" followed by an answer paragraph
function faqFromMarkdown(src: string): { q: string; a: string }[] {
  const faqs: { q: string; a: string }[] = []; const lines = src.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].trim().match(/^####\s+(.*[?？])\s*$/);
    if (m) { let j = i + 1; while (j < lines.length && !lines[j].trim()) j++; if (j < lines.length && !/^#/.test(lines[j].trim())) faqs.push({ q: m[1], a: lines[j].trim().replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") }); }
  }
  return faqs;
}
const faqGraph = (c: string, faqs: { q: string; a: string }[]) => faqs.length ? [{ "@type": "FAQPage", "@id": `${c}#faq`, "mainEntity": faqs.map((f) => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })) }] : [];

function applyHead(o: { lang: Lang; bare: string; title: string; desc: string; canonical?: string; image?: string; graph: any[]; body: string }): string {
  const canonical = o.canonical || absUrl(o.bare, o.lang);
  let out = rawHtml;
  out = out.replace(/<html lang="[^"]*">/, `<html lang="${HTML_LANG[o.lang]}">`);
  out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(o.title)}</title>`);
  out = out.replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(o.desc)}" />`);
  out = out.replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${canonical}" />`);
  out = out.replace(/\s*<link rel="alternate" hreflang="[^"]*" href="[^"]*" \/>/g, "");
  out = out.replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${absUrl(o.bare, o.lang)}" />`);
  out = out.replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(o.title)}" />`);
  out = out.replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${esc(o.desc)}" />`);
  if (o.image) { out = out.replace(/<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${esc(o.image)}" />`); out = out.replace(/<meta property="twitter:image" content="[^"]*" \/>/, `<meta property="twitter:image" content="${esc(o.image)}" />`); }
  out = out.replace(/<meta property="twitter:title" content="[^"]*" \/>/, `<meta property="twitter:title" content="${esc(o.title)}" />`);
  out = out.replace(/<meta property="twitter:description" content="[^"]*" \/>/, `<meta property="twitter:description" content="${esc(o.desc)}" />`);
  const ld = JSON.stringify({ "@context": "https://schema.org", "@graph": o.graph }).replace(/<\//g, "<\\/");
  out = out.replace(/<script id="seo-json-ld" type="application\/ld\+json"><\/script>/, `<script id="seo-json-ld" type="application/ld+json">${ld}</script>`);
  out = out.replace("</head>", `${hreflangBlock(o.bare)}  </head>`);
  out = out.replace('<div id="root"></div>', `<div id="root">${o.body}</div>`);
  return out;
}

// ---- page pieces -------------------------------------------------------------------------------
const wrap = (inner: string) => `<div style="max-width:1000px;margin:0 auto;padding:32px 20px;font-family:system-ui,-apple-system,sans-serif;color:#0f172a;line-height:1.7">${inner}</div>`;
const nav = (items: [string, string][]) => `<nav style="font-size:14px;color:#64748b;margin-bottom:20px">${items.map(([n, u], i) => u && i < items.length - 1 ? `<a href="${u}" style="color:#0f766e;text-decoration:none">${esc(n)}</a>` : `<span>${esc(n)}</span>`).join(" › ")}</nav>`;
const h2 = (t: string) => `<h2 style="font-size:22px;font-weight:700;margin-top:28px">${esc(t)}</h2>`;
const table = (heads: string[], rows: string[][]) => `<table style="border-collapse:collapse;width:100%;margin:12px 0;font-size:15px"><thead><tr>${heads.map((h) => `<th style="text-align:left;padding:8px;border-bottom:2px solid #e2e8f0">${esc(h)}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td style="padding:8px;border-bottom:1px solid #e2e8f0">${c}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
const link = (href: string, text: string) => `<a href="${href}" style="color:#047857;text-decoration:none;font-weight:600">${esc(text)}</a>`;
const agentLine = (lang: Lang) => `<p style="font-size:13px;color:#64748b;margin-top:32px">${T(lang, `Written by licensed real estate negotiator ${AGENT.name} (${AGENT.ren}), ${AGENT.company}. WhatsApp`, `作者：持牌房产经纪 ${AGENT.name}（${AGENT.ren}），${AGENT.company}。WhatsApp`)} <a href="https://wa.me/60108278932">${AGENT.phoneDisplay}</a> · <a href="mailto:${AGENT.email}">${AGENT.email}</a>. ${T(lang, "Figures come from developer records and OpenStreetMap measurements; no yield or price forecasts.", "数字来自发展商记录和 OpenStreetMap 测距，不做回酬或涨幅预测。")}</p>`;

const gLang = (lang: Lang) => (lang === "zh" ? "zh" : "en");
const km = (lang: Lang, v?: number) => (v !== undefined ? kmText(v, lang) : T(lang, "pending", "待确认"));
/** Listing box with photo, distance and link to jbproperties.my */
function listingsBlock(slugs: string[], lang: Lang, title?: string): string {
  const items = slugs.map((s) => ({ s, p: greenProject(s) })).filter((x) => x.p);
  if (!items.length) return "";
  return `<section style="margin-top:28px;border:1px solid #a7f3d0;background:#ecfdf5;border-radius:12px;padding:16px 20px">
    <h2 style="font-size:18px;font-weight:700;margin:0 0 4px">${esc(title || T(lang, "Projects in this guide — official listings on jbproperties.my", UI_ZH.listingsTitle))}</h2>
    <p style="font-size:13px;color:#64748b;margin:0 0 12px">${esc(T(lang, "Floor plans, prices and photos are on the official listing site.", UI_ZH.listingsNote))}</p>
    <ul style="list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px">${items.map(({ s, p }) => {
      const d = distanceToBukitChagar(s); const hero = greenHero(s, 400);
      return `<li style="display:flex;gap:12px;align-items:center">${hero ? `<img src="${esc(hero)}" alt="${esc(`${p!.project_name}, ${p!.area}`)}" width="88" height="60" loading="lazy" style="width:88px;height:60px;object-fit:cover;border-radius:8px;background:#e2e8f0" />` : ""}<span><a href="${greenUrl(s, gLang(lang))}" style="color:#047857;font-weight:600">${esc(p!.project_name)}</a><br /><span style="font-size:13px;color:#64748b">${esc(p!.area)}${d !== undefined ? ` · ${T(lang, "Bukit Chagar", "离武吉查加站")} ${kmText(d, lang)}` : ""}</span></span></li>`;
    }).join("")}</ul>
    <p style="margin:12px 0 0;font-size:13px"><a href="${greenHome(gLang(lang))}" style="color:#047857;font-weight:600">${esc(T(lang, "All Johor Bahru listings on jbproperties.my →", UI_ZH.allListings))}</a></p></section>`;
}
/** Measured-distance table for a set of listings */
function measuredTable(slugs: string[], lang: Lang): string {
  const rows = slugs.map((s) => ({ s, p: greenProject(s) })).filter((x) => x.p);
  if (!rows.length) return "";
  return h2(T(lang, "Listed projects here, measured", UI_ZH.areaProjects)) + table(
    [T(lang, "Project", UI_ZH.project), T(lang, "To Bukit Chagar", UI_ZH.toStation), T(lang, "To checkpoint", UI_ZH.toCiq), T(lang, "From", UI_ZH.from), T(lang, "Completion", UI_ZH.completion)],
    rows.map(({ s, p }) => [link(greenUrl(s, gLang(lang)), p!.project_name), esc(km(lang, distanceToBukitChagar(s))), esc(km(lang, nearestCheckpoint(s)?.km)), esc(p!.price_min), esc(p!.completion_year)])
  ) + `<p style="font-size:13px;color:#64748b">${esc(T(lang, "Straight-line distances measured on OpenStreetMap from the project coordinates; a walk is longer. Prices are the developers' indicative prices.", UI_ZH.distanceNote))}</p>`;
}
const postFor = (slug: string, lang: Lang) => { const p = blogPosts.find((b) => b.slug === slug)!; if (lang === "en") return p; const z = blogPostsZh[slug]; return z ? { ...p, ...z, category: CATEGORY_ZH[p.category] || p.category } : p; };
const areaFor = (a: (typeof areaGuides)[number], lang: Lang) => (lang === "zh" && areaGuidesZh[a.slug] ? { ...a, ...areaGuidesZh[a.slug] } : a);
const devFor = (d: (typeof developerProfiles)[number], lang: Lang) => (lang === "zh" && developerProfilesZh[d.slug] ? { ...d, ...developerProfilesZh[d.slug] } : d);
const articleList = (lang: Lang) => `<ul>${blogPosts.map((b) => { const p = postFor(b.slug, lang); return `<li><a href="${absUrl(`/blog/${b.slug}`, lang)}">${esc(p.title)}</a> — ${esc(p.summary)}</li>`; }).join("")}</ul>`;
const areaList = (lang: Lang) => `<ul>${areaGuides.map((a) => { const g = areaFor(a, lang); return `<li><a href="${absUrl(`/area/${a.slug}`, lang)}">${esc(g.name)}</a> — ${esc(g.where)}</li>`; }).join("")}</ul>`;
const devList = (lang: Lang) => `<ul>${developerProfiles.map((d) => { const g = devFor(d, lang); return `<li><a href="${absUrl(`/developer/${d.slug}`, lang)}">${esc(g.name)}</a></li>`; }).join("")}</ul>`;
const homeLabel = (lang: Lang) => T(lang, "Home", UI_ZH.home);
const guidesLabel = (lang: Lang) => T(lang, "Guides", UI_ZH.blog);

function write(rel: string, html: string) { const dir = path.join(distPath, rel); if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); fs.writeFileSync(path.join(dir, "index.html"), html, "utf-8"); }

// ---- renderers (return HTML for one language) --------------------------------------------------
function renderHome(lang: Lang): string {
  const bare = "/"; const c = absUrl(bare, lang); const seo = lang === "zh" ? HOME_SEO_ZH : HOME_SEO;
  const body = wrap(`<h1>${esc(T(lang, "Johor Bahru buying guides for Singapore and foreign buyers", "给新加坡和外国买家的新山置业指南"))}</h1><p>${esc(seo.description)}</p>
    ${h2(T(lang, "Guides", "指南"))}${articleList(lang)}
    ${h2(T(lang, "Buying guides by profile", "按买家身份"))}<ul>${buyingGuides.map((g) => `<li><a href="${absUrl(`/buying-guides/${g.type}`, lang)}">${esc(g.title[lang === "zh" ? "ZH" : "EN"])}</a></li>`).join("")}</ul>
    ${h2(T(lang, "Area guides", "区域指南"))}${areaList(lang)}
    ${h2(T(lang, "Developers", "发展商"))}${devList(lang)}
    ${listingsBlock(GREEN_PROJECTS.map((p) => p.greenSlug), lang, T(lang, "The nine listed projects — official listings on jbproperties.my", "九个挂牌项目：jbproperties.my 官方挂牌页"))}${agentLine(lang)}`);
  return applyHead({ lang, bare, title: seo.title, desc: seo.description, graph: [...agentGraph(lang, c, seo.title),
    { "@type": "ItemList", "@id": `${c}#guides`, "name": T(lang, "Johor Bahru property guides", "新山置业指南"), "itemListElement": blogPosts.map((b, i) => ({ "@type": "ListItem", "position": i + 1, "name": postFor(b.slug, lang).title, "url": absUrl(`/blog/${b.slug}`, lang) })) }], body, image: greenHero("aethera-residences") });
}
function renderStatic(key: string, lang: Lang): string {
  const bare = `/${key}`; const c = absUrl(bare, lang); const s = (lang === "zh" ? STATIC_SEO_ZH : STATIC_SEO)[key];
  let inner = `<h1>${esc(s.title.split(" | ")[0])}</h1><p>${esc(s.description)}</p>`;
  if (key === "blog") inner += articleList(lang);
  else if (key === "buying-guides") inner += `<ul>${buyingGuides.map((g) => `<li><a href="${absUrl(`/buying-guides/${g.type}`, lang)}">${esc(g.title[lang === "zh" ? "ZH" : "EN"])}</a> — ${esc(g.intro[lang === "zh" ? "ZH" : "EN"])}</li>`).join("")}</ul>` + articleList(lang);
  else inner += measuredTable(GREEN_PROJECTS.map((p) => p.greenSlug), lang) + listingsBlock(GREEN_PROJECTS.map((p) => p.greenSlug), lang);
  return applyHead({ lang, bare, title: s.title, desc: s.description, graph: [...agentGraph(lang, c, s.title), crumbs([[homeLabel(lang), absUrl("/", lang)], [s.title.split(" | ")[0], c]])], body: wrap(nav([[homeLabel(lang), absUrl("/", lang)], [s.title.split(" | ")[0], ""]]) + inner + agentLine(lang)) });
}
function renderBuyingGuide(g: (typeof buyingGuides)[number], lang: Lang): string {
  const L = lang === "zh" ? "ZH" : "EN"; const bare = `/buying-guides/${g.type}`; const c = absUrl(bare, lang);
  const title = `${g.title[L]} | jbpropertyportal.my`; const desc = g.intro[L];
  const body = wrap(`${nav([[homeLabel(lang), absUrl("/", lang)], [T(lang, "Buying guides", "置业指南"), absUrl("/buying-guides", lang)], [g.title[L], ""]])}<p style="font-size:13px;color:#64748b">${esc(g.label[L])}</p><h1>${esc(g.title[L])}</h1><p>${esc(g.intro[L])}</p>
    ${g.sections.map((s) => `${h2(s.heading[L])}<p>${esc(s.body[L])}</p>`).join("")}
    ${h2(T(lang, "Read next", "相关文章"))}<ul>${g.articles.map((slug) => `<li><a href="${absUrl(`/blog/${slug}`, lang)}">${esc(postFor(slug, lang).title)}</a></li>`).join("")}</ul>${agentLine(lang)}`);
  return applyHead({ lang, bare, title, desc, graph: [...agentGraph(lang, c, title), crumbs([[homeLabel(lang), absUrl("/", lang)], [T(lang, "Buying guides", "置业指南"), absUrl("/buying-guides", lang)], [g.title[L], c]])], body });
}
function renderPost(b0: (typeof blogPosts)[number], lang: Lang): string {
  const b = postFor(b0.slug, lang); const bare = `/blog/${b0.slug}`; const c = absUrl(bare, lang); const s = blogSeo(b); const faqs = faqFromMarkdown(b.content || "");
  const graph: any[] = [...agentGraph(lang, c, s.title), crumbs([[homeLabel(lang), absUrl("/", lang)], [guidesLabel(lang), absUrl("/blog", lang)], [b.title, c]]),
    { "@type": "BlogPosting", "@id": `${c}#article`, "headline": b.title, "description": s.description, "image": b0.image ? [b0.image] : undefined, "datePublished": toIso(b0.date), "dateModified": toIso(b0.updated || b0.date), "inLanguage": HTML_LANG[lang],
      "author": { "@type": "Person", "name": `${AGENT.name} (${AGENT.ren})`, "url": `${SITE_URL}/` }, "publisher": { "@id": `${SITE_URL}/#agent` }, "mainEntityOfPage": { "@type": "WebPage", "@id": c }, "articleSection": b.category },
    ...faqGraph(c, faqs)];
  const body = wrap(`${nav([[homeLabel(lang), absUrl("/", lang)], [guidesLabel(lang), absUrl("/blog", lang)], [b.title, ""]])}<p style="font-size:13px;color:#64748b">${esc(b.category)} · ${T(lang, "Published", UI_ZH.published)} ${esc(b0.date)}${b0.updated ? ` · ${T(lang, "Updated", "更新")} ${esc(lang === "zh" ? UI_ZH.updated : b0.updated)}` : ""} · ${esc(b.readTime)}</p><h1>${esc(b.title)}</h1><p style="font-size:18px;color:#334155">${esc(b.summary)}</p>
    ${b0.image ? `<img src="${esc(b0.image)}" alt="${esc(b0.imageAlt || b.title)}" width="1000" height="560" style="width:100%;height:auto;border-radius:12px;margin:12px 0" />` : ""}
    ${md(b.content || "")}
    ${listingsBlock(b0.relatedProjects || [], lang)}
    ${h2(T(lang, "More guides", "更多指南"))}<ul>${blogPosts.filter((x) => x.slug !== b0.slug).slice(0, 4).map((x) => `<li><a href="${absUrl(`/blog/${x.slug}`, lang)}">${esc(postFor(x.slug, lang).title)}</a></li>`).join("")}</ul>${agentLine(lang)}`);
  return applyHead({ lang, bare, title: s.title, desc: s.description, image: b0.image, graph, body });
}
function renderArea(a0: (typeof areaGuides)[number], lang: Lang): string {
  const a = areaFor(a0, lang); const bare = `/area/${a0.slug}`; const c = absUrl(bare, lang); const s = areaSeo(a, lang === "zh" ? "ZH" : "EN");
  const faqs: { q: string; a: string }[] = [];
  const nearest = a0.projectSlugs.map((sl) => ({ sl, d: distanceToBukitChagar(sl) })).filter((x) => x.d !== undefined).sort((x, y) => x.d! - y.d!)[0];
  if (nearest) faqs.push({ q: T(lang, `Which listed project in ${a.name} is closest to Bukit Chagar RTS station?`, `${a.name}里哪个挂牌项目离武吉查加捷运站最近？`), a: `${greenProject(nearest.sl)!.project_name} — ${T(lang, "about", "直线约")} ${kmText(nearest.d!, lang)}${T(lang, " in a straight line from the project coordinates (OpenStreetMap).", "（从项目坐标量，OpenStreetMap）。")}` });
  faqs.push({ q: T(lang, `Where is ${a.name}?`, `${a.name}在哪里？`), a: a.where });
  const body = wrap(`${nav([[homeLabel(lang), absUrl("/", lang)], [T(lang, "Areas", UI_ZH.areas), absUrl("/", lang)], [a.name, ""]])}<p style="font-size:13px;color:#64748b">${esc(T(lang, "Area guide", "区域指南"))}</p><h1>${esc(a.name)}</h1><p style="font-size:18px;color:#334155">${esc(a.where)}</p><p>${esc(a.description)}</p>
    ${measuredTable(a0.projectSlugs, lang)}
    ${h2(T(lang, "Key facts", "重点事实"))}<ul>${a.highlights.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>
    ${h2(T(lang, "FAQ", UI_ZH.faq))}${faqs.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join("")}
    ${listingsBlock(a0.projectSlugs, lang, T(lang, `Official listings in ${a.name}`, `${a.name}：官方挂牌页`))}
    ${h2(T(lang, "Other areas", "其他区域"))}${areaList(lang)}<p style="font-size:13px;color:#64748b">${T(lang, "Updated", "更新")} ${esc(lang === "zh" ? UI_ZH.updated : a0.updated || "")}</p>${agentLine(lang)}`);
  return applyHead({ lang, bare, title: s.title, desc: s.description, image: a0.projectSlugs[0] ? greenHero(a0.projectSlugs[0]) : undefined, graph: [...agentGraph(lang, c, s.title), crumbs([[homeLabel(lang), absUrl("/", lang)], [a.name, c]]), { "@type": "Place", "@id": `${c}#place`, "name": a.name, "description": a.where, "address": { "@type": "PostalAddress", "addressLocality": "Johor Bahru", "addressRegion": "Johor", "addressCountry": "MY" } }, ...faqGraph(c, faqs)], body });
}
function renderDeveloper(d0: (typeof developerProfiles)[number], lang: Lang): string {
  const d = devFor(d0, lang); const bare = `/developer/${d0.slug}`; const c = absUrl(bare, lang); const s = developerSeo(d, lang === "zh" ? "ZH" : "EN");
  const body = wrap(`${nav([[homeLabel(lang), absUrl("/", lang)], [T(lang, "Developers", UI_ZH.developers), absUrl("/", lang)], [d.name, ""]])}<p style="font-size:13px;color:#64748b">${esc(T(lang, "Developer", "发展商"))}</p><h1>${esc(d.name)}</h1><p>${esc(d.description)}</p>
    ${measuredTable(d0.projectSlugs, lang)}
    ${listingsBlock(d0.projectSlugs, lang, T(lang, `${d.name} projects in Johor Bahru — official listings`, `${d.name}${UI_ZH.developerProjects}`))}
    ${h2(T(lang, "Other developers", "其他发展商"))}${devList(lang)}<p style="font-size:13px;color:#64748b">${T(lang, "Updated", "更新")} ${esc(lang === "zh" ? UI_ZH.updated : d0.updated || "")}</p>${agentLine(lang)}`);
  return applyHead({ lang, bare, title: s.title, desc: s.description, image: d0.projectSlugs[0] ? greenHero(d0.projectSlugs[0]) : undefined, graph: [...agentGraph(lang, c, s.title), crumbs([[homeLabel(lang), absUrl("/", lang)], [d.name, c]]), { "@type": "Organization", "@id": `${c}#org`, "name": d.name, "description": d.description }], body });
}

// ---- write: English + Simplified, then Traditional twins converted from the Simplified pages -----
const toHant: (x: string) => string = (OpenCC as any).Converter({ from: "cn", to: "twp" });
const pages: { bare: string; html: Record<Lang, string> }[] = [];
const add = (bare: string, render: (lang: Lang) => string) => pages.push({ bare, html: { en: render("en"), zh: render("zh") } });
add("/", renderHome);
for (const key of Object.keys(STATIC_SEO)) add(`/${key}`, (l) => renderStatic(key, l));
for (const g of buyingGuides) add(`/buying-guides/${g.type}`, (l) => renderBuyingGuide(g, l));
for (const b of blogPosts) add(`/blog/${b.slug}`, (l) => renderPost(b, l));
for (const a of areaGuides) add(`/area/${a.slug}`, (l) => renderArea(a, l));
for (const d of developerProfiles) add(`/developer/${d.slug}`, (l) => renderDeveloper(d, l));

let n = 0;
const SITE_RE = SITE_URL.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
for (const pg of pages) {
  write(pg.bare.replace(/^\//, ""), pg.html.en); n++;
  write(path.join("zh", pg.bare.replace(/^\//, "")), pg.html.zh); n++;
  const hant = toHant(pg.html.zh)
    .replace(/<html lang="zh-CN">/, '<html lang="zh-Hant">')
    .replace(new RegExp(`(<link rel="canonical" href="${SITE_RE})/zh(/|")`), "$1/zh-hant$2")
    .replace(new RegExp(`(<meta property="og:url" content="${SITE_RE})/zh(/|")`), "$1/zh-hant$2")
    .replace(new RegExp(`href="${SITE_RE}/zh(/|")`, "g"), (m, tail) => `href="${SITE_URL}/zh-hant${tail}`)
    .replace(new RegExp(`(hreflang="zh-CN" href="${SITE_RE})/zh-hant(/|")`, "g"), "$1/zh$2")
    .replace(/https:\/\/www\.jbproperties\.my\/zh\//g, "https://www.jbproperties.my/zh-hant/")
    .replace(/https:\/\/www\.jbproperties\.my\/zh"/g, 'https://www.jbproperties.my/zh-hant"')
    .replace(/"inLanguage":"zh-CN"/g, '"inLanguage":"zh-Hant"');
  write(path.join("zh-hant", pg.bare.replace(/^\//, "")), hant); n++;
}
// Project pages: English only, canonical -> official listing on jbproperties.my
for (const p of projectsData as any[]) {
  const bare = `/projects/${p.slug}`; const c = absUrl(bare, "en"); const official = greenProjectUrl(p.slug); const gs = official.split("/").pop() || "";
  const title = p.seo_title || `${p.project_name} Johor Bahru`; const desc = p.seo_description || `${p.project_name} in ${p.area}, Johor Bahru by ${p.developer}. Full listing on jbproperties.my.`;
  const specs: [string, string][] = [["Developer", p.developer], ["Area", p.area], ["Tenure", p.tenure], ["Price range", [p.price_min, p.price_max].filter(Boolean).join(" – ")], ["Built-up", p.built_up_min ? `${p.built_up_min} – ${p.built_up_max} sq ft` : ""], ["Completion", [p.completion_status, p.completion_year].filter(Boolean).join(" ")]];
  const body = wrap(`${nav([["Home", absUrl("/", "en")], ["Projects", absUrl("/projects", "en")], [p.project_name, ""]])}<p style="background:#ecfdf5;border:1px solid #a7f3d0;border-radius:12px;padding:12px 16px">Full listing with floor plans, prices and photos: <a href="${official}" style="color:#047857;font-weight:600">${esc(p.project_name)} on jbproperties.my</a></p>
    <h1>${esc(p.project_name)}</h1><p>${esc(desc)}</p><ul>${specs.filter(([, v]) => v).map(([k, v]) => `<li><strong>${k}:</strong> ${esc(v)}</li>`).join("")}</ul>${p.description ? `<p>${esc(p.description)}</p>` : ""}${listingsBlock([gs], "en", "Official listing")}${agentLine("en")}`);
  const html = applyHead({ lang: "en", bare, title, desc, canonical: official, image: greenHero(gs), graph: [...agentGraph("en", c, title), crumbs([["Home", absUrl("/", "en")], ["Projects", absUrl("/projects", "en")], [p.project_name, c]])], body })
    .replace(/\s*<link rel="alternate" hreflang="[^"]*" href="[^"]*" \/>/g, "");
  write(path.join("projects", p.slug), html); n++;
}
// llms.txt over the copy vite put in dist (same text generate-sitemap.ts writes to public/)
if (fs.existsSync(path.join(cwd, "public", "llms.txt"))) fs.copyFileSync(path.join(cwd, "public", "llms.txt"), path.join(distPath, "llms.txt"));
console.log(`✅ [SEO Static Build] ${n} pages written: ${pages.length} pages × 3 languages (en, zh, zh-hant) + ${projectsData.length} English project pages; ${blogPosts.length} articles, ${areaGuides.length} areas, ${developerProfiles.length} developers, ${buyingGuides.length} buyer guides.`);
