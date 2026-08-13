import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  AboutPage,
  ArticlesPage,
  ContactPage,
  ExperiencePage,
  ProjectsPage,
  SkillsPage,
} from "@/components/portfolio-pages";
import { createSectionEntityGraph, JsonLd } from "@/components/json-ld";
import { getDictionary } from "@/i18n/dictionaries";
import { hasLocale } from "@/lib/i18n";
import { isPageKey, sectionKeys } from "@/lib/navigation";
import { getArticles, getPortfolioOverview } from "@/lib/portfolio-api";
import { pageMetadata } from "@/lib/site";

type SectionParams = { params: Promise<{ locale: string; section: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return sectionKeys.map((section) => ({ section }));
}

export async function generateMetadata({ params }: SectionParams): Promise<Metadata> {
  const { locale, section } = await params;
  if (!hasLocale(locale) || !isPageKey(section) || section === "overview") return {};
  return pageMetadata(locale, getDictionary(locale), section);
}

export default async function SectionRoute({ params }: SectionParams) {
  const { locale, section } = await params;
  if (!hasLocale(locale) || !isPageKey(section) || section === "overview") notFound();

  const [basePortfolio, articles] = await Promise.all([
    getPortfolioOverview(),
    section === "articles" ? getArticles(locale) : Promise.resolve(null),
  ]);
  const portfolio = articles ? { ...basePortfolio, articles } : basePortfolio;
  const dictionary = getDictionary(locale);
  const props = { dictionary, locale, portfolio };
  const entityGraph = createSectionEntityGraph({
    locale,
    section,
    homeName: dictionary.nav.overview,
    sectionName: dictionary.nav[section],
    sectionDescription: dictionary.pages[section].summary,
    portfolio: basePortfolio,
  });

  let content: React.ReactNode;

  switch (section) {
    case "about": content = <AboutPage {...props} />; break;
    case "experience": content = <ExperiencePage {...props} />; break;
    case "projects": content = <ProjectsPage {...props} />; break;
    case "skills": content = <SkillsPage {...props} />; break;
    case "articles": content = <ArticlesPage {...props} />; break;
    case "contact": content = <ContactPage {...props} />; break;
    default: notFound();
  }

  return (
    <>
      <JsonLd id={`${section}-entity-graph`} data={entityGraph} />
      {content}
    </>
  );
}
