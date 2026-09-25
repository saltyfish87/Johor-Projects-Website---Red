/**
 * Language layer for the guides (rewritten 2026-09-25).
 *
 * English lives in data/blog-data.ts, Simplified Chinese in data/blog-data.zh.ts; both are written by
 * hand from the same facts. There is no machine translation and no automatic "expansion" any more.
 * Other interface languages (JA/FR/AR) fall back to the English article, and Traditional Chinese
 * pages (/zh-hant) are produced from the Simplified text by OpenCC at build time and by the
 * HantText component in the browser.
 */
import { BlogPost, AreaGuide, DeveloperProfile } from "../types";
import { blogPostsZh, areaGuidesZh, developerProfilesZh, CATEGORY_ZH } from "../data/blog-data.zh";
import { blogPostsHant, areaGuidesHant, developerProfilesHant, categoryHant } from "../data/blog-data.zh-hant.generated";
import { isHantPath } from "./lang-path";

/** Traditional Chinese page (/zh-hant): use the OpenCC-converted copies of the Chinese texts. */
const hant = () => typeof window !== "undefined" && isHantPath(window.location.pathname);
const postsZh = () => (hant() ? blogPostsHant : blogPostsZh);
const areasZh = () => (hant() ? areaGuidesHant : areaGuidesZh);
const devsZh = () => (hant() ? developerProfilesHant : developerProfilesZh);
const catsZh = () => (hant() ? categoryHant : CATEGORY_ZH);

export const isChinese = (language: string) => (language || "EN").toUpperCase() === "ZH";

export function getTranslatedBlog(post: BlogPost, language: string): BlogPost {
  if (!isChinese(language)) return post;
  const zh = postsZh()[post.slug];
  if (!zh) return post;
  return {
    ...post,
    title: zh.title,
    summary: zh.summary,
    content: zh.content,
    category: catsZh()[post.category] || post.category,
    readTime: zh.readTime || post.readTime,
    seoTitle: zh.seoTitle,
    metaTitle: zh.seoTitle,
    metaDescription: zh.metaDescription
  };
}

export function getTranslatedArea(guide: AreaGuide, language: string): AreaGuide {
  if (!isChinese(language)) return guide;
  const zh = areasZh()[guide.slug];
  return zh ? { ...guide, ...zh } : guide;
}

export function getTranslatedDeveloper(dev: DeveloperProfile, language: string): DeveloperProfile {
  if (!isChinese(language)) return dev;
  const zh = devsZh()[dev.slug];
  return zh ? { ...dev, ...zh } : dev;
}

export const categoryLabel = (category: string, language: string) => (isChinese(language) ? catsZh()[category] || category : category);
