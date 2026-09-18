import React from "react";
import { Project } from "../types";
import { greenProjectUrl, GREEN_SITE_URL } from "../utils/seo-texts";

interface Props {
  projects: Project[];
  title?: string;
}

/** Links readers of a guide/area/developer page to the official project listings on jbproperties.my. */
export const RelatedProjectsBox: React.FC<Props> = ({ projects, title = "Project listings on jbproperties.my" }) => {
  if (!projects || projects.length === 0) return null;
  return (
    <div className="mt-10 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6">
      <h3 className="text-sm font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 mb-4">Floor plans, prices and photos are on the official listing site (English, 中文, Bahasa).</p>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
        {projects.map((p) => (
          <li key={p.slug}>
            <a href={greenProjectUrl(p.slug)} className="text-emerald-700 hover:text-emerald-900 underline underline-offset-2">
              {p.project_name}
            </a>
            <span className="text-slate-400 text-xs"> — {p.area}</span>
          </li>
        ))}
      </ul>
      <a href={`${GREEN_SITE_URL}/`} className="inline-block mt-4 text-xs font-semibold text-emerald-700 hover:text-emerald-900">
        All Johor Bahru listings on jbproperties.my &rarr;
      </a>
    </div>
  );
};

export default RelatedProjectsBox;
