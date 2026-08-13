import { hasLocale, type Locale } from "@/lib/i18n";

export const portfolioWorkbenchPublication = {
  slug: "portfolio-workbench-case-study",
  locales: ["en"],
  publishedAt: "2026-08-08",
} as const satisfies {
  slug: string;
  locales: readonly Locale[];
  publishedAt: string;
};

export const publishedArticlePublications = [portfolioWorkbenchPublication] as const;
export const publishedArticleSlugs = [portfolioWorkbenchPublication.slug] as const;

const articleContentLocales = new Set<Locale>(["en", "fa", "de", "fr", "nl"]);

export function articleContentLocale(language: string): Locale {
  const normalizedLanguage = language.toLowerCase().split("-")[0];
  return hasLocale(normalizedLanguage) && articleContentLocales.has(normalizedLanguage)
    ? normalizedLanguage
    : "en";
}

export function isPublishedArticleSlug(value: string) {
  return publishedArticleSlugs.some((slug) => slug === value);
}
