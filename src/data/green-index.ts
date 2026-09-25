/**
 * Index of the official listings on jbproperties.my (data copied in green-projects.ts), keyed by the
 * slug used in the listing URL: https://www.jbproperties.my/project/<slug>. The guides link to these
 * pages and borrow their photos and measured distances, so this site never repeats the listing itself.
 */
import { fallbackProjects } from "./green-projects";
import { NEARBY_OSM, OsmPlace } from "./nearbyOsm.generated";

export const GREEN_SITE_URL = "https://www.jbproperties.my";

/** Same rule as jbproperties.my uses to build its URLs. */
export function greenSlugOf(projectName: string): string {
  const lower = (projectName || "").toLowerCase();
  if (lower.includes("aethera")) return "aethera-residences";
  if (lower.includes("axis")) return "axis-tower";
  if (lower.includes("brixton")) return "brixton-tower";
  if (lower.includes("dover")) return "dover-tower";
  if (lower.includes("coronade")) return "coronade-twins";
  if (lower.includes("gen sphere")) return "gen-sphere";
  if (lower.includes("minori")) return "m-grand-minori";
  if (lower.includes("phase 2")) return "princess-cove-phase-2";
  if (lower.includes("phase 3")) return "princess-cove-phase-3";
  return lower.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export type GreenProject = (typeof fallbackProjects)[number] & { greenSlug: string };

export const GREEN_PROJECTS: GreenProject[] = fallbackProjects.map((p) => ({ ...p, greenSlug: greenSlugOf(p.project_name) }));
const BY_SLUG = new Map(GREEN_PROJECTS.map((p) => [p.greenSlug, p]));

export const greenProject = (slug: string): GreenProject | undefined => BY_SLUG.get(slug);
export const greenUrl = (slug: string, lang: "en" | "zh" | "zh-hant" = "en") =>
  lang === "en" ? `${GREEN_SITE_URL}/project/${slug}` : `${GREEN_SITE_URL}/${lang}/project/${slug}`;
export const greenHome = (lang: "en" | "zh" | "zh-hant" = "en") => (lang === "en" ? `${GREEN_SITE_URL}/` : `${GREEN_SITE_URL}/${lang}`);

/** Cover photo of a listing (Google Drive), sized for a card or an article header. */
export function greenHero(slug: string, width = 1200): string {
  const p = BY_SLUG.get(slug);
  const url = p?.images?.hero || p?.images?.facade?.[0] || p?.images?.gallery?.[0] || "";
  return url ? url.replace(/=w\d+$/, "") + `=w${width}` : "";
}

/**
 * Projects whose sheet coordinates do not match the address (the point falls in another area), so
 * their measured distances are withheld until the sheet is corrected.
 */
export const COORDINATE_PENDING = new Set<string>(["gen-sphere"]);

/** Measured straight-line distances (OpenStreetMap) for a listing, or [] when withheld. */
export function greenNearby(slug: string): OsmPlace[] {
  if (COORDINATE_PENDING.has(slug)) return [];
  return (NEARBY_OSM as Record<string, OsmPlace[]>)[slug] || [];
}
/** Nearest real border checkpoint (OSM tags a few buildings "@ CIQ"; those are not checkpoints). */
export function nearestCheckpoint(slug: string): OsmPlace | undefined {
  return greenNearby(slug).filter((r) => r.category === "Border checkpoints" && /^Johor Bahru/i.test(r.name)).sort((a, b) => a.km - b.km)[0];
}
export function distanceToBukitChagar(slug: string): number | undefined {
  return greenNearby(slug).find((r) => r.category === "Train stations" && r.name === "Bukit Chagar")?.km;
}
export const kmText = (km: number, lang: "en" | "zh" = "en") =>
  km < 1 ? `${Math.round(km * 1000)} ${lang === "zh" ? "米" : "m"}` : `${km.toFixed(1)} ${lang === "zh" ? "公里" : "km"}`;
