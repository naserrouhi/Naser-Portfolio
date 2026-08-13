import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";

import { Providers } from "@/components/providers";
import { WorkbenchShell } from "@/components/workbench-shell";
import { getDictionary } from "@/i18n/dictionaries";
import { hasLocale, localeDetails, locales } from "@/lib/i18n";
import { getPortfolioOverview } from "@/lib/portfolio-api";
import {
  languageAlternates,
  localizedPageTitle,
  openGraphLocale,
  searchEngineRobots,
  siteName,
  siteUrl,
} from "@/lib/site";

import "../globals.css";
import "@/styles/workbench.scss";
import "@/styles/content-motion.scss";

export const revalidate = 900;

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#1c1c1c" },
    { media: "(prefers-color-scheme: light)", color: "#f1f1f3" },
  ],
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const dictionary = getDictionary(locale);
  const title = localizedPageTitle(locale, "overview");
  const socialImage = {
    url: new URL(`/${locale}/opengraph-image`, siteUrl).toString(),
    width: 1200,
    height: 630,
    alt: title,
  };
  const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION?.trim();

  return {
    metadataBase: siteUrl,
    title: { default: title, template: "%s | Naser Rouhi" },
    description: dictionary.pages.overview.summary,
    applicationName: dictionary.shell.workbench,
    authors: [{ name: "Naser Rouhi", url: "/en/about" }],
    creator: "Naser Rouhi",
    category: "technology",
    alternates: { canonical: `/${locale}`, languages: languageAlternates() },
    openGraph: {
      type: "profile",
      title,
      description: dictionary.pages.overview.summary,
      url: `/${locale}`,
      siteName,
      locale: openGraphLocale(locale),
      alternateLocale: locales
        .filter((alternateLocale) => alternateLocale !== locale)
        .map(openGraphLocale),
      firstName: "Naser",
      lastName: "Rouhi",
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: dictionary.pages.overview.summary,
      images: [socialImage],
    },
    robots: searchEngineRobots,
    verification: googleSiteVerification
      ? { google: googleSiteVerification }
      : undefined,
    manifest: "/manifest.webmanifest",
    icons: {
      icon: [{ url: "/favicon.svg", type: "image/svg+xml", sizes: "any" }],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  const portfolio = await getPortfolioOverview();
  const dictionary = getDictionary(locale);

  return (
    <html
      lang={localeDetails[locale].htmlLang}
      dir={localeDetails[locale].direction}
      className="dark"
      style={{ colorScheme: "dark" }}
      suppressHydrationWarning
    >
      <head>
        <script
          id="theme-initializer"
          dangerouslySetInnerHTML={{
            __html: "try{const t=localStorage.getItem('theme');if(t==='light'||t==='dark'){document.documentElement.className=t;document.documentElement.style.colorScheme=t}}catch{}",
          }}
        />
      </head>
      <body>
        <Providers initialTheme="dark">
          <WorkbenchShell dictionary={dictionary} locale={locale} portfolio={portfolio}>
            {children}
          </WorkbenchShell>
        </Providers>
      </body>
    </html>
  );
}
