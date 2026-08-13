import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  createPortfolioEntityGraph,
  createSectionEntityGraph,
  JsonLd,
  structuredDataIds,
} from "@/components/json-ld";
import { localPortfolio } from "@/lib/portfolio-data";

function hasSchemaType(entity: unknown, type: string): entity is Record<string, unknown> {
  return typeof entity === "object"
    && entity !== null
    && "@type" in entity
    && entity["@type"] === type;
}

describe("portfolio structured data", () => {
  it("uses one stable website and person identity throughout the site graph", () => {
    const graph = createPortfolioEntityGraph(localPortfolio);
    const website = graph["@graph"].find((entity) => hasSchemaType(entity, "WebSite"));
    const person = graph["@graph"].find((entity) => hasSchemaType(entity, "Person"));

    expect(structuredDataIds.website).toMatch(/\/#website$/);
    expect(structuredDataIds.person).toMatch(/\/#naser-rouhi$/);
    expect(website).toMatchObject({
      "@id": structuredDataIds.website,
      name: "Naser Rouhi",
      alternateName: "Naser Rouhi Portfolio",
      author: { "@id": structuredDataIds.person },
      publisher: { "@id": structuredDataIds.person },
    });
    expect(person).toMatchObject({
      "@id": structuredDataIds.person,
      name: "Naser Rouhi",
      alternateName: "naserrouhi",
      identifier: "naserrouhi",
      sameAs: [
        "https://github.com/naserrouhi",
        "https://www.linkedin.com/in/naser-rouhi-nomonia/",
      ],
      alumniOf: { name: "Shahid Beheshti University" },
      worksFor: { name: "Frontline Data Solutions" },
    });
    expect(person).toHaveProperty("knowsAbout");
    expect(person).toHaveProperty("knowsLanguage", ["English", "Persian"]);
  });

  it("links an About ProfilePage and localized breadcrumb to the same entities", () => {
    const graph = createSectionEntityGraph({
      locale: "en",
      section: "about",
      homeName: "Overview",
      sectionName: "About",
      sectionDescription: "About Naser Rouhi.",
      portfolio: localPortfolio,
    });
    const breadcrumb = graph["@graph"].find((entity) =>
      hasSchemaType(entity, "BreadcrumbList"));
    const profilePage = graph["@graph"].find((entity) =>
      hasSchemaType(entity, "ProfilePage"));

    expect(breadcrumb).toMatchObject({
      itemListElement: [
        { position: 1, name: "Overview" },
        { position: 2, name: "About" },
      ],
    });
    expect(profilePage).toMatchObject({
      mainEntity: { "@id": structuredDataIds.person },
      isPartOf: { "@id": structuredDataIds.website },
      breadcrumb: { "@id": expect.stringMatching(/#breadcrumb$/) },
      inLanguage: "en",
    });
    expect(profilePage).not.toHaveProperty("dateCreated");
    expect(profilePage).not.toHaveProperty("dateModified");
    expect(graph["@graph"].find((entity) => hasSchemaType(entity, "Person"))).toMatchObject({
      "@id": structuredDataIds.person,
      name: "Naser Rouhi",
    });
  });

  it("adds breadcrumbs without inventing ProfilePage entities on other sections", () => {
    const graph = createSectionEntityGraph({
      locale: "de",
      section: "projects",
      homeName: "Übersicht",
      sectionName: "Projekte",
      sectionDescription: "Projekte von Naser Rouhi.",
      portfolio: localPortfolio,
    });

    expect(graph["@graph"]).toHaveLength(1);
    expect(graph["@graph"][0]).toMatchObject({
      "@type": "BreadcrumbList",
      itemListElement: [
        { position: 1, name: "Übersicht", item: expect.stringMatching(/\/de$/) },
        { position: 2, name: "Projekte", item: expect.stringMatching(/\/de\/projects$/) },
      ],
    });
  });

  it("serializes JSON-LD safely without changing its data", () => {
    const data = { "@context": "https://schema.org", description: "</script><script>" };
    const { container } = render(<JsonLd id="safe-json-ld" data={data} />);
    const script = container.querySelector<HTMLScriptElement>("#safe-json-ld");

    expect(script).toHaveAttribute("type", "application/ld+json");
    expect(script?.textContent).not.toContain("</script>");
    expect(JSON.parse(script?.textContent ?? "{}")).toEqual(data);
  });
});
