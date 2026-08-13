import type { MetadataRoute } from "next";

import { publishedArticlePublications } from "@/lib/article-routes";
import { locales } from "@/lib/i18n";
import { pageKeys, pagePath } from "@/lib/navigation";
import { siteUrl } from "@/lib/site";

function buildLastModified() {
  const configuredDate =
    process.env.SITE_LAST_MODIFIED ?? process.env.VERCEL_GIT_COMMIT_DATE;
  if (configuredDate) {
    const parsedDate = new Date(configuredDate);
    if (!Number.isNaN(parsedDate.getTime())) return parsedDate;
  }

  const sourceDateEpoch = Number(process.env.SOURCE_DATE_EPOCH);
  if (Number.isFinite(sourceDateEpoch) && sourceDateEpoch > 0) {
    return new Date(sourceDateEpoch * 1_000);
  }

  return undefined;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [];
  const lastModified = buildLastModified();

  for (const page of pageKeys) {
    const localizedAlternates = Object.fromEntries(
      locales.map((locale) => [locale, new URL(pagePath(locale, page), siteUrl).toString()]),
    );
    const alternates = { ...localizedAlternates, "x-default": localizedAlternates.en };
    for (const locale of locales) {
      pages.push({
        url: new URL(pagePath(locale, page), siteUrl).toString(),
        ...(lastModified ? { lastModified } : {}),
        changeFrequency: page === "articles" ? "weekly" : "monthly",
        priority: page === "overview" ? 1 : 0.8,
        alternates: { languages: alternates },
      });
    }
  }

  for (const publication of publishedArticlePublications) {
    const localizedArticleAlternates = Object.fromEntries(
      publication.locales.map((locale) => [
        locale,
        new URL(`/${locale}/articles/${publication.slug}`, siteUrl).toString(),
      ]),
    ) as Record<(typeof publication.locales)[number], string>;
    const articleAlternates = {
      ...localizedArticleAlternates,
      "x-default": localizedArticleAlternates[publication.locales[0]],
    };
    for (const locale of publication.locales) {
      pages.push({
        url: localizedArticleAlternates[locale],
        lastModified: new Date(`${publication.publishedAt}T00:00:00.000Z`),
        changeFrequency: "yearly",
        priority: 0.7,
        alternates: { languages: articleAlternates },
      });
    }
  }

  return pages;
}
