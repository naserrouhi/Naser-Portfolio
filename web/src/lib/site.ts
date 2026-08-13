import type { Metadata } from "next";

import type { Dictionary } from "@/i18n/dictionaries";
import { locales, type Locale } from "@/lib/i18n";
import { pagePath, type PageKey } from "@/lib/navigation";

export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://naserrouhi.github.io",
);

export const siteName = "Naser Rouhi";

const openGraphLocales = {
  en: "en_US",
  fa: "fa_IR",
  de: "de_DE",
  fr: "fr_FR",
  nl: "nl_NL",
  es: "es_ES",
  ar: "ar_SA",
  tr: "tr_TR",
} satisfies Record<Locale, string>;

const localizedPageTitles = {
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

export const siteTitle = localizedPageTitles.en.overview;

export const searchEngineRobots = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
} satisfies Metadata["robots"];

export function localizedPageTitle(locale: Locale, page: PageKey) {
  return localizedPageTitles[locale][page];
}

export function openGraphLocale(locale: Locale) {
  return openGraphLocales[locale];
}

function socialImage(locale: Locale) {
  return {
    url: new URL(`/${locale}/opengraph-image`, siteUrl).toString(),
    width: 1200,
    height: 630,
    alt: localizedPageTitle(locale, "overview"),
  };
}

export function languageAlternates(page: PageKey = "overview") {
  const alternates = Object.fromEntries(
    locales.map((locale) => [locale, new URL(pagePath(locale, page), siteUrl).toString()]),
  );
  return { ...alternates, "x-default": alternates.en };
}

export function pageMetadata(
  locale: Locale,
  dictionary: Dictionary,
  page: PageKey,
): Metadata {
  const copy = dictionary.pages[page];
  const canonical = pagePath(locale, page);
  const title = localizedPageTitle(locale, page);
  const image = socialImage(locale);
  return {
    title: { absolute: title },
    description: copy.summary,
    alternates: {
      canonical,
      languages: languageAlternates(page),
    },
    openGraph: {
      type: "website",
      locale: openGraphLocale(locale),
      alternateLocale: locales
        .filter((alternateLocale) => alternateLocale !== locale)
        .map(openGraphLocale),
      url: canonical,
      title,
      description: copy.summary,
      siteName,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: copy.summary,
      images: [image],
    },
  };
}
