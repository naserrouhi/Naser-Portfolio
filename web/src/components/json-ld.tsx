import type {
  BreadcrumbList,
  Graph,
  Person,
  ProfilePage,
  WebSite,
} from "schema-dts";

import type { Locale } from "@/lib/i18n";
import { localeDetails, locales } from "@/lib/i18n";
import { pagePath, type PageKey } from "@/lib/navigation";
import type { PortfolioOverview } from "@/lib/portfolio-data";
import { siteName, siteUrl } from "@/lib/site";

const websiteUrl = new URL("/", siteUrl).toString();

export const structuredDataIds = Object.freeze({
  person: new URL("/#naser-rouhi", siteUrl).toString(),
  website: new URL("/#website", siteUrl).toString(),
});

export function createPersonEntity(portfolio: PortfolioOverview): Person {
  const currentExperience = portfolio.experience.find((experience) => !experience.end);
  const education = portfolio.profile.education;
  return {
    "@type": "Person",
    "@id": structuredDataIds.person,
    name: portfolio.profile.name,
    alternateName: portfolio.profile.github.handle,
    identifier: portfolio.profile.github.handle,
    givenName: "Naser",
    familyName: "Rouhi",
    jobTitle: portfolio.profile.headline,
    description: portfolio.profile.summary,
    image: new URL("/naser-rouhi.jpg", siteUrl).toString(),
    url: new URL("/en/about", siteUrl).toString(),
    email: `mailto:${portfolio.profile.email}`,
    telephone: portfolio.profile.phone,
    homeLocation: { "@type": "Place", name: portfolio.profile.location },
    sameAs: [portfolio.profile.github.url, portfolio.profile.linkedinUrl],
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: education.institution,
      address: education.location,
    },
    knowsAbout: portfolio.skills.flatMap((group) => group.items),
    knowsLanguage: portfolio.profile.languages.map((language) => language.name),
    award: portfolio.profile.awards.map(
      (award) => `${award.title}, ${award.organization} (${award.years.join(" & ")})`,
    ),
    ...(currentExperience
      ? {
          worksFor: {
            "@type": "Organization" as const,
            name: currentExperience.company,
          },
        }
      : {}),
  };
}

export function createPortfolioEntityGraph(portfolio: PortfolioOverview): Graph {
  const website: WebSite = {
    "@type": "WebSite",
    "@id": structuredDataIds.website,
    url: websiteUrl,
    name: siteName,
    alternateName: "Naser Rouhi Portfolio",
    description: portfolio.profile.summary,
    inLanguage: locales.map((locale) => localeDetails[locale].htmlLang),
    author: { "@id": structuredDataIds.person },
    publisher: { "@id": structuredDataIds.person },
  };

  return {
    "@context": "https://schema.org",
    "@graph": [website, createPersonEntity(portfolio)],
  };
}

type SectionStructuredDataOptions = {
  locale: Locale;
  section: Exclude<PageKey, "overview">;
  homeName: string;
  sectionName: string;
  sectionDescription: string;
  portfolio: PortfolioOverview;
};

export function createSectionEntityGraph({
  locale,
  section,
  homeName,
  sectionName,
  sectionDescription,
  portfolio,
}: SectionStructuredDataOptions): Graph {
  const homeUrl = new URL(pagePath(locale, "overview"), siteUrl).toString();
  const sectionUrl = new URL(pagePath(locale, section), siteUrl).toString();
  const breadcrumbId = `${sectionUrl}#breadcrumb`;

  const breadcrumb: BreadcrumbList = {
    "@type": "BreadcrumbList",
    "@id": breadcrumbId,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: homeName,
        item: homeUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: sectionName,
        item: sectionUrl,
      },
    ],
  };

  const graph: Graph["@graph"][number][] = [breadcrumb];

  if (section === "about") {
    const profilePage: ProfilePage = {
      "@type": "ProfilePage",
      "@id": `${sectionUrl}#profile-page`,
      url: sectionUrl,
      name: sectionName,
      description: sectionDescription,
      inLanguage: localeDetails[locale].htmlLang,
      isPartOf: { "@id": structuredDataIds.website },
      mainEntity: { "@id": structuredDataIds.person },
      breadcrumb: { "@id": breadcrumbId },
    };
    graph.push(profilePage, createPersonEntity(portfolio));
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

export function JsonLd({ data, id }: { data: object; id?: string }) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
