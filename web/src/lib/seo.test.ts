import { afterEach, describe, expect, it, vi } from "vitest";

import sitemap from "@/app/sitemap";
import { getDictionary } from "@/i18n/dictionaries";
import { locales, type Locale } from "@/lib/i18n";
import { pageKeys, pagePath, type PageKey } from "@/lib/navigation";
import { portfolioWorkbenchArticle } from "@/lib/portfolio-data";
import {
  localizedPageTitle,
  openGraphLocale,
  pageMetadata,
  searchEngineRobots,
  siteUrl,
} from "@/lib/site";

import nextConfig from "../../next.config";

afterEach(() => {
  vi.unstubAllEnvs();
});

const expectedTitles = {
  en: {
    overview: "Naser Rouhi | Senior .NET Engineer",
    about: "About Naser Rouhi | .NET Engineer",
    experience: ".NET Experience | Naser Rouhi",
    projects: ".NET Projects | Naser Rouhi",
    skills: ".NET Skills | Naser Rouhi",
    articles: ".NET Articles | Naser Rouhi",
    contact: "Contact Naser Rouhi | .NET Engineer",
  },
  fa: {
    overview: "Naser Rouhi | نمونه‌کار",
    about: "درباره | Naser Rouhi",
    experience: "تجربه | Naser Rouhi",
    projects: "پروژه‌ها | Naser Rouhi",
    skills: "مهارت‌ها | Naser Rouhi",
    articles: "مقالات | Naser Rouhi",
    contact: "تماس | Naser Rouhi",
  },
  de: {
    overview: "Naser Rouhi | Portfolio",
    about: "Über mich | Naser Rouhi",
    experience: "Berufserfahrung | Naser Rouhi",
    projects: "Projekte | Naser Rouhi",
    skills: "Kompetenzen | Naser Rouhi",
    articles: "Artikel | Naser Rouhi",
    contact: "Kontakt | Naser Rouhi",
  },
  fr: {
    overview: "Naser Rouhi | Portfolio",
    about: "À propos | Naser Rouhi",
    experience: "Expérience | Naser Rouhi",
    projects: "Projets | Naser Rouhi",
    skills: "Compétences | Naser Rouhi",
    articles: "Articles | Naser Rouhi",
    contact: "Contact | Naser Rouhi",
  },
  nl: {
    overview: "Naser Rouhi | Portfolio",
    about: "Over mij | Naser Rouhi",
    experience: "Ervaring | Naser Rouhi",
    projects: "Projecten | Naser Rouhi",
    skills: "Vaardigheden | Naser Rouhi",
    articles: "Artikelen | Naser Rouhi",
    contact: "Contact | Naser Rouhi",
  },
  es: {
    overview: "Naser Rouhi | Portafolio",
    about: "Sobre mí | Naser Rouhi",
    experience: "Experiencia | Naser Rouhi",
    projects: "Proyectos | Naser Rouhi",
    skills: "Habilidades | Naser Rouhi",
    articles: "Artículos | Naser Rouhi",
    contact: "Contacto | Naser Rouhi",
  },
  ar: {
    overview: "Naser Rouhi | معرض الأعمال",
    about: "نبذة عني | Naser Rouhi",
    experience: "الخبرة | Naser Rouhi",
    projects: "المشاريع | Naser Rouhi",
    skills: "المهارات | Naser Rouhi",
    articles: "المقالات | Naser Rouhi",
    contact: "التواصل | Naser Rouhi",
  },
  tr: {
    overview: "Naser Rouhi | Portföy",
    about: "Hakkımda | Naser Rouhi",
    experience: "Deneyim | Naser Rouhi",
    projects: "Projeler | Naser Rouhi",
    skills: "Yetenekler | Naser Rouhi",
    articles: "Makaleler | Naser Rouhi",
    contact: "İletişim | Naser Rouhi",
  },
} satisfies Record<Locale, Record<PageKey, string>>;

describe("SEO metadata", () => {
  it("uses concise branded browser titles in every page language", () => {
    for (const locale of locales) {
      const dictionary = getDictionary(locale);

      for (const page of pageKeys) {
        const title = expectedTitles[locale][page];
        const metadata = pageMetadata(locale, dictionary, page);

        expect(title.length).toBeLessThanOrEqual(36);
        expect(localizedPageTitle(locale, page)).toBe(title);
        expect(metadata.title).toEqual({ absolute: title });
        expect(metadata.openGraph).toMatchObject({ title });
        expect(metadata.twitter).toMatchObject({ title });
      }
    }
  });

  it("uses a localized 1200 by 630 social image", () => {
    for (const locale of locales) {
      const metadata = pageMetadata(locale, getDictionary(locale), "overview");
      const image = {
        url: new URL(`/${locale}/opengraph-image`, siteUrl).toString(),
        width: 1200,
        height: 630,
        alt: expectedTitles[locale].overview,
      };

      expect(metadata.openGraph).toMatchObject({ images: [image] });
      expect(metadata.twitter).toMatchObject({ images: [image] });
      expect(metadata.openGraph).toMatchObject({
        locale: openGraphLocale(locale),
        alternateLocale: locales
          .filter((alternateLocale) => alternateLocale !== locale)
          .map(openGraphLocale),
      });
    }
  });

  it("allows rich Google previews on indexable pages", () => {
    expect(searchEngineRobots).toEqual({
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    });
  });
});

describe("sitemap", () => {
  it("keeps every localized main page", () => {
    const entries = sitemap();

    for (const page of pageKeys) {
      for (const locale of locales) {
        const url = new URL(pagePath(locale, page), siteUrl).toString();
        expect(entries.some((entry) => entry.url === url)).toBe(true);
      }
    }
  });

  it("publishes article alternates only for genuine translations", () => {
    const entries = sitemap();
    const articleSuffix = `/articles/${portfolioWorkbenchArticle.slug}`;
    const articleEntries = entries.filter((entry) => entry.url.endsWith(articleSuffix));

    expect(articleEntries).toHaveLength(1);
    expect(articleEntries.map((entry) => new URL(entry.url).pathname.split("/")[1])).toEqual([
      "en",
    ]);

    for (const entry of articleEntries) {
      expect(Object.keys(entry.alternates?.languages ?? {})).toEqual([
        "en",
        "x-default",
      ]);
      expect((entry.lastModified as Date).toISOString()).toBe("2026-08-08T00:00:00.000Z");
    }
  });

  it("uses the deployment's configured last-modified value", () => {
    const deploymentTime = "2026-08-10T12:34:56.000Z";
    vi.stubEnv("SITE_LAST_MODIFIED", deploymentTime);
    const entries = sitemap();

    for (const entry of entries.filter((entry) => !entry.url.includes("/articles/portfolio-workbench-case-study"))) {
      expect(entry.lastModified).toBeInstanceOf(Date);
      expect((entry.lastModified as Date).toISOString()).toBe(deploymentTime);
    }
  });

  it("omits guessed modification dates for main pages", () => {
    const entries = sitemap();
    const articleSuffix = `/articles/${portfolioWorkbenchArticle.slug}`;

    for (const entry of entries.filter((candidate) => !candidate.url.endsWith(articleSuffix))) {
      expect(entry.lastModified).toBeUndefined();
    }
  });
});

describe("Next.js SEO routing", () => {
  it("permanently redirects the root route to English", async () => {
    await expect(nextConfig.redirects?.()).resolves.toContainEqual({
      source: "/",
      destination: "/en",
      permanent: true,
    });
  });

  it("keeps the resume accessible but out of the search index", async () => {
    await expect(nextConfig.headers?.()).resolves.toContainEqual({
      source: "/resume.pdf",
      headers: [{ key: "X-Robots-Tag", value: "noindex, follow" }],
    });
  });
});
