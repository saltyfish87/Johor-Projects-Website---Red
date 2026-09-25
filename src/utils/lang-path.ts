/**
 * Language in the URL. English pages have no prefix; Simplified Chinese pages live under /zh and
 * Traditional Chinese under /zh-hant (same as jbproperties.my). Interface languages without their own
 * pages (JA/FR/AR) keep the English URL.
 */
export type PathLang = "en" | "zh" | "zh-hant";

export function langFromPath(pathname: string): PathLang {
  const m = (pathname || "").match(/^\/(zh-hant|zh)(?=\/|$)/i);
  return m ? (m[1].toLowerCase() as PathLang) : "en";
}
export const isHantPath = (pathname: string) => langFromPath(pathname) === "zh-hant";

/** "/zh/blog/x" -> "/blog/x"; "/zh" -> "/" */
export function stripLangPrefix(pathname: string): string {
  return (pathname || "/").replace(/^\/(zh-hant|zh)(?=\/|$)/i, "") || "/";
}

/** Puts the prefix back: localizePath("/blog/x", "zh") -> "/zh/blog/x" */
export function localizePath(pathname: string, lang: PathLang): string {
  const bare = stripLangPrefix(pathname);
  if (lang === "en") return bare;
  return bare === "/" ? `/${lang}` : `/${lang}${bare}`;
}

/** Interface language code (EN/ZH) for a path language. */
export const uiLanguageFor = (lang: PathLang) => (lang === "en" ? "EN" : "ZH");
