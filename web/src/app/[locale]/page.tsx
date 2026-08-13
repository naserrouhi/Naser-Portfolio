import { notFound } from "next/navigation";

import { createPortfolioEntityGraph, JsonLd } from "@/components/json-ld";
import { OverviewPage } from "@/components/portfolio-pages";
import { getDictionary } from "@/i18n/dictionaries";
import { hasLocale } from "@/lib/i18n";
import { getPortfolioOverview } from "@/lib/portfolio-api";

export default async function OverviewRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const portfolio = await getPortfolioOverview();
  return (
    <>
      {locale === "en" && (
        <JsonLd id="portfolio-entity-graph" data={createPortfolioEntityGraph(portfolio)} />
      )}
      <OverviewPage dictionary={getDictionary(locale)} locale={locale} portfolio={portfolio} />
    </>
  );
}
