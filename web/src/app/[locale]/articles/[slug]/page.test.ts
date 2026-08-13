import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/portfolio-api", () => ({ getArticle: vi.fn() }));

import {
  buildArticleMetadata,
  buildArticleStructuredData,
  generateMetadata,
} from "@/app/[locale]/articles/[slug]/page";
import { getArticle } from "@/lib/portfolio-api";
import { portfolioWorkbenchArticle } from "@/lib/portfolio-data";
import { siteUrl } from "@/lib/site";

const absoluteUrl = (path: string) => new URL(path, siteUrl).toString();

describe("article SEO", () => {
  afterEach(() => vi.mocked(getArticle).mockReset());

  it("canonicalizes an untranslated locale fallback to the content language", () => {
    const metadata = buildArticleMetadata(
      portfolioWorkbenchArticle,
      "es",
      ["en", "fa", "de", "fr", "nl"],
    );

    expect(metadata.title).toEqual({
      absolute: `${portfolioWorkbenchArticle.title} | Naser Rouhi`,
    });
    expect(metadata.alternates?.canonical).toBe(
      absoluteUrl("/en/articles/portfolio-workbench-case-study"),
    );
    expect(metadata.robots).toMatchObject({ index: false, follow: true });
    expect(metadata.alternates?.languages).toMatchObject({
      en: absoluteUrl("/en/articles/portfolio-workbench-case-study"),
      fa: absoluteUrl("/fa/articles/portfolio-workbench-case-study"),
      "x-default": absoluteUrl("/en/articles/portfolio-workbench-case-study"),
    });
  });

  it("indexes a genuine translation and provides a 1200 by 630 social image", () => {
    const article = { ...portfolioWorkbenchArticle, language: "fa" };
    const metadata = buildArticleMetadata(article, "fa", ["en", "fa"]);

    expect(metadata.alternates?.canonical).toBe(
      absoluteUrl("/fa/articles/portfolio-workbench-case-study"),
    );
    expect(metadata.robots).toMatchObject({ index: true, follow: true });
    expect(metadata.openGraph).toMatchObject({
      locale: "fa_IR",
      alternateLocale: ["en_US"],
      siteName: "Naser Rouhi",
      images: [{
        url: absoluteUrl("/fa/opengraph-image"),
        width: 1200,
        height: 630,
      }],
    });
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      images: [absoluteUrl("/fa/opengraph-image")],
    });
  });

  it("only advertises translation probes whose returned language matches", async () => {
    vi.mocked(getArticle).mockImplementation(async () => portfolioWorkbenchArticle);

    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: "es", slug: portfolioWorkbenchArticle.slug }),
    });

    expect(metadata.alternates?.languages).toEqual({
      en: absoluteUrl("/en/articles/portfolio-workbench-case-study"),
      "x-default": absoluteUrl("/en/articles/portfolio-workbench-case-study"),
    });
    expect(metadata.robots).toMatchObject({ index: false, follow: true });
    expect(getArticle).toHaveBeenCalledTimes(1);
  });

  it("connects Article and Breadcrumb entities to one stable author and canonical URL", () => {
    const { articleJsonLd, breadcrumbJsonLd } = buildArticleStructuredData(
      { ...portfolioWorkbenchArticle, language: "fr" },
      "fr",
      { home: "Accueil", articles: "Articles" },
    );

    expect(articleJsonLd).toMatchObject({
      "@type": "BlogPosting",
      "@id": `${absoluteUrl("/fr/articles/portfolio-workbench-case-study")}#article`,
      inLanguage: "fr",
      datePublished: "2026-08-08",
      dateModified: "2026-08-08",
      author: {
        "@id": absoluteUrl("/#naser-rouhi"),
        name: "Naser Rouhi",
        url: absoluteUrl("/en/about"),
      },
      publisher: { "@id": absoluteUrl("/#naser-rouhi") },
      isPartOf: { "@id": absoluteUrl("/#website") },
      image: {
        url: absoluteUrl("/fr/opengraph-image"),
        width: "1200",
        height: "630",
      },
    });
    expect(breadcrumbJsonLd.itemListElement).toEqual([
      expect.objectContaining({ position: 1, name: "Accueil", item: absoluteUrl("/fr") }),
      expect.objectContaining({ position: 2, name: "Articles", item: absoluteUrl("/fr/articles") }),
      expect.objectContaining({
        position: 3,
        name: portfolioWorkbenchArticle.title,
        item: absoluteUrl("/fr/articles/portfolio-workbench-case-study"),
      }),
    ]);
  });
});
