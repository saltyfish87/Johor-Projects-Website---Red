import React from "react";
import { greenProject, greenUrl, greenHome, greenHero, distanceToBukitChagar, kmText } from "../data/green-index";
import { UI_ZH as UI_ZH_CN } from "../data/blog-data.zh";
import { uiHant } from "../data/blog-data.zh-hant.generated";

interface Props {
  /** Listing slugs on jbproperties.my */
  slugs: string[];
  title?: string;
  language?: string; // "EN" | "ZH"
  hant?: boolean; // Traditional Chinese page: link to /zh-hant on the listing site
}

/**
 * Links readers of a guide, area or developer page to the official listings on jbproperties.my,
 * with the listing's own cover photo and its measured distance to Bukit Chagar station.
 */
export const RelatedProjectsBox: React.FC<Props> = ({ slugs, title, language = "EN", hant = false }) => {
  const zh = language === "ZH";
  const lang = zh ? (hant ? "zh-hant" : "zh") : "en";
  const UI_ZH: typeof UI_ZH_CN = hant ? uiHant : UI_ZH_CN;
  const items = (slugs || []).map((s) => ({ slug: s, p: greenProject(s) })).filter((x) => x.p);
  if (items.length === 0) return null;
  return (
    <div className="mt-10 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6">
      <h3 className="text-sm font-bold text-slate-900 mb-1">{title || (zh ? UI_ZH.listingsTitle : "Projects in this guide — official listings on jbproperties.my")}</h3>
      <p className="text-xs text-slate-500 mb-4">{zh ? UI_ZH.listingsNote : "Floor plans, prices and photos are on the official listing site (English, 中文, Bahasa)."}</p>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        {items.map(({ slug, p }) => {
          const km = distanceToBukitChagar(slug);
          const hero = greenHero(slug, 400);
          return (
            <li key={slug} className="flex items-center gap-3">
              {hero && <img src={hero} alt={`${p!.project_name}, ${p!.area}`} width={88} height={60} loading="lazy" className="h-[60px] w-[88px] rounded-lg object-cover bg-slate-100 shrink-0" referrerPolicy="no-referrer" />}
              <div className="min-w-0">
                <a href={greenUrl(slug, lang)} className="text-emerald-700 hover:text-emerald-900 underline underline-offset-2 font-semibold block truncate">
                  {p!.project_name}
                </a>
                <span className="text-slate-500 text-xs block">
                  {p!.area}
                  {km !== undefined && <> · {zh ? "离武吉查加站" : "Bukit Chagar"} {kmText(km, zh ? "zh" : "en")}</>}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
      <a href={greenHome(lang)} className="inline-block mt-4 text-xs font-semibold text-emerald-700 hover:text-emerald-900">
        {zh ? UI_ZH.allListings : "All Johor Bahru listings on jbproperties.my →"}
      </a>
    </div>
  );
};

export default RelatedProjectsBox;
