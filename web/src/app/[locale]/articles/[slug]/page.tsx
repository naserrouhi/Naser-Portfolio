import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type {
  BlogPosting,
  BreadcrumbList,
  WithContext,
} from "schema-dts";

import { JsonLd } from "@/components/json-ld";
import { ArticleDetail } from "@/components/portfolio-pages";
import { getDictionary } from "@/i18n/dictionaries";
import { articleContentLocale, publishedArticleSlugs } from "@/lib/article-routes";
import { hasLocale, locales, type Locale } from "@/lib/i18n";
import type { Article } from "@/lib/portfolio-data";
import { getArticle } from "@/lib/portfolio-api";
import { openGraphLocale, siteName, siteUrl } from "@/lib/site";

type ArticleParams = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

const articleTranslationLocales = ["en", "fa", "de", "fr", "nl"] as const satisfies readonly Locale[];

function supportedArticleLocale(language: string): (typeof articleTranslationLocales)[number] | null {
  const normalizedLanguage = language.toLowerCase().split("-")[0];
  return articleTranslationLocales.find((locale) => locale === normalizedLanguage) ?? null;
}

function articlePath(locale: Locale, slug: string) {
  return `/${locale}/articles/${slug}`;
}

function absoluteUrl(path: string) {
  return new URL(path, siteUrl).toString();
}

export function buildArticleMetadata(
  article: Article,
  requestedLocale: Locale,
  availableTranslations: readonly Locale[],
): Metadata {
  const title = `${article.title} | Naser Rouhi`;
  const canonicalLocale = articleContentLocale(article.language);
  const canonicalPath = articlePath(canonicalLocale, article.slug);
  const canonicalUrl = absoluteUrl(canonicalPath);
  const socialImage = absoluteUrl(`/${canonicalLocale}/opengraph-image`);
  const isFallbackCopy = requestedLocale !== canonicalLocale;
  const truthfulLocales = [...new Set([canonicalLocale, ...availableTranslations])]
    .filter((locale) => articleTranslationLocales.includes(locale as (typeof articleTranslationLocales)[number]));
  const languageAlternates = Object.fromEntries(
    truthfulLocales.map((locale) => [locale, absoluteUrl(articlePath(locale, article.slug))]),
  );
  const defaultAlternate = languageAlternates.en ?? canonicalUrl;

  return {
    title: { absolute: title },
    description: article.excerpt,
    authors: [{ name: "Naser Rouhi", url: absoluteUrl("/en/about") }],
    alternates: {
      canonical: canonicalUrl,
      languages: { ...languageAlternates, "x-default": defaultAlternate },
    },
    robots: {
      index: !isFallbackCopy,
      follow: true,
      googleBot: {
        index: !isFallbackCopy,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "article",
      locale: openGraphLocale(canonicalLocale),
      alternateLocale: truthfulLocales
        .filter((locale) => locale !== canonicalLocale)
        .map(openGraphLocale),
      title: article.title,
      description: article.excerpt,
      url: canonicalUrl,
      publishedTime: article.publishedAt,
      modifiedTime: article.publishedAt,
      authors: [absoluteUrl("/en/about")],
      siteName,
      images: [{
        url: socialImage,
        width: 1200,
        height: 630,
        alt: `${article.title} — Naser Rouhi`,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [socialImage],
    },
  };
}

export function buildArticleStructuredData(
  article: Article,
  canonicalLocale: Locale,
  breadcrumbLabels: { home: string; articles: string },
) {
  const canonicalUrl = absoluteUrl(articlePath(canonicalLocale, article.slug));
  const socialImage = absoluteUrl(`/${canonicalLocale}/opengraph-image`);
  const author = {
    "@type": "Person" as const,
    "@id": absoluteUrl("/#naser-rouhi"),
    name: "Naser Rouhi",
    url: absoluteUrl("/en/about"),
  };
  const articleJsonLd: WithContext<BlogPosting> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${canonicalUrl}#article`,
    url: canonicalUrl,
    headline: article.title,
    description: article.excerpt,
    inLanguage: canonicalLocale,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    mainEntityOfPage: canonicalUrl,
    image: {
      "@type": "ImageObject",
      url: socialImage,
      contentUrl: socialImage,
      width: "1200",
      height: "630",
    },
    author,
    publisher: author,
    isPartOf: { "@id": absoluteUrl("/#website") },
    articleBody: article.sections?.flatMap((section) => section.paragraphs).join("\n\n"),
  };
  const breadcrumbJsonLd: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: breadcrumbLabels.home,
        item: absoluteUrl(`/${canonicalLocale}`),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: breadcrumbLabels.articles,
        item: absoluteUrl(`/${canonicalLocale}/articles`),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: canonicalUrl,
      },
    ],
  };

  return { articleJsonLd, breadcrumbJsonLd };
}

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    publishedArticleSlugs.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({ params }: ArticleParams): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) return {};

  const article = await getArticle(slug, locale)
    ?? (locale === "en" ? null : await getArticle(slug, "en"));
  if (!article) return {};

  const availableTranslations = (article.availableLanguages ?? [article.language])
    .map(supportedArticleLocale)
    .filter((translationLocale): translationLocale is (typeof articleTranslationLocales)[number] => (
      translationLocale !== null
    ));

  return buildArticleMetadata(article, locale, availableTranslations);
}

export default async function ArticleRoute({ params }: ArticleParams) {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) notFound();
  const article = await getArticle(slug, locale) ?? (locale === "en" ? null : await getArticle(slug, "en"));
  if (!article) notFound();
  const canonicalLocale = articleContentLocale(article.language);
  const canonicalDictionary = getDictionary(canonicalLocale);
  const { articleJsonLd, breadcrumbJsonLd } = buildArticleStructuredData(
    article,
    canonicalLocale,
    {
      home: canonicalDictionary.nav.overview,
      articles: canonicalDictionary.nav.articles,
    },
  );

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <ArticleDetail dictionary={getDictionary(locale)} locale={locale} article={article} />
    </>
  );
}
