import { render, screen, within } from "@testing-library/react";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import {
  AboutPage,
  ArticleDetail,
  ArticlesPage,
  ContactPage,
  ExperiencePage,
  OverviewPage,
  ProjectsPage,
  SkillsPage,
} from "@/components/portfolio-pages";
import { dictionaries } from "@/i18n/dictionaries";
import { localPortfolio } from "@/lib/portfolio-data";

describe("overview document", () => {
  it("renders verified identity, outcomes attribution, and route-backed actions", () => {
    render(
      <OverviewPage
        dictionary={dictionaries.en}
        locale="en"
        portfolio={localPortfolio}
      />,
    );

    expect(screen.getByRole("heading", { level: 1, name: "Naser Rouhi" })).toBeInTheDocument();
    expect(screen.getByText(/Self-reported outcomes from the résumé/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Projects/i })).toHaveAttribute("href", "/en/projects");
    expect(screen.getByAltText("Portrait of Naser Rouhi")).toBeInTheDocument();
    expect(screen.queryByText("Current")).not.toBeInTheDocument();
  });
});

describe("article documents", () => {
  it("links fallback cards to the language of the article content", () => {
    render(
      <ArticlesPage
        dictionary={dictionaries.de}
        locale="de"
        portfolio={localPortfolio}
      />,
    );

    expect(screen.getByRole("link", { name: /Details/i })).toHaveAttribute(
      "href",
      "/en/articles/portfolio-workbench-case-study",
    );
  });

  it("exposes a visible internal author link and semantic publication date", () => {
    const article = localPortfolio.articles[0];
    render(
      <ArticleDetail
        dictionary={dictionaries.en}
        locale="en"
        article={article}
      />,
    );

    expect(screen.getByRole("link", { name: "Naser Rouhi" })).toHaveAttribute("href", "/en/about");
    expect(screen.getByRole("link", { name: "Naser Rouhi" })).toHaveAttribute("rel", "author");
    expect(screen.getByText(".NET Software Engineer")).toBeVisible();
    expect(document.querySelector("time")).toHaveAttribute("datetime", article.publishedAt);
  });
});

describe("résumé documents", () => {
  it("keeps education, English-first languages, and awards in separate cards", () => {
    const { container } = render(
      <AboutPage dictionary={dictionaries.en} locale="en" portfolio={localPortfolio} />,
    );

    const education = screen.getByRole("region", { name: "Education" });
    const languages = screen.getByRole("region", { name: "Spoken languages" });
    const awards = screen.getByRole("region", { name: "Awards" });

    expect(within(education).getByText("B.Sc. in Civil Engineering")).toBeInTheDocument();
    expect(within(education).queryByText(/Mathematics Olympiad/i)).not.toBeInTheDocument();
    expect(within(awards).getByText("4th Place, Regional Mathematics Olympiad")).toBeInTheDocument();
    expect(within(languages).getAllByRole("listitem")[0]).toHaveClass("primary-language");
    expect(within(languages).getAllByRole("listitem")[0]).toHaveTextContent(/^English/);
    expect(container.querySelector(".primary-language strong")).toHaveTextContent("English");
  });

  it("renders the complete six-role timeline with résumé descriptions", () => {
    const { container } = render(
      <ExperiencePage dictionary={dictionaries.en} locale="en" portfolio={localPortfolio} />,
    );

    expect(container.querySelectorAll(".experience-timeline > li")).toHaveLength(6);
    expect(screen.getAllByRole("heading", { name: "Back-End Developer" })).toHaveLength(2);
    expect(screen.getByText(/cutting average issue resolution time by over 40%/i)).toBeInTheDocument();
    expect(screen.getByText(/centralized reporting services integrating SQL Server/i)).toBeInTheDocument();
  });

  it("shows the résumé email and phone and does not publish a cover-letter link", () => {
    render(
      <ContactPage dictionary={dictionaries.en} locale="en" portfolio={localPortfolio} />,
    );

    expect(screen.getByRole("link", { name: "naserrouhi.nomonia@gmail.com" })).toHaveAttribute(
      "href",
      "mailto:naserrouhi.nomonia@gmail.com",
    );
    expect(screen.getByRole("link", { name: "+98 912 806 1286" })).toHaveAttribute(
      "href",
      "tel:+989128061286",
    );
    expect(screen.queryByText("Cover letter")).not.toBeInTheDocument();
    expect(existsSync(resolve(process.cwd(), "public", "cover-letter.pdf"))).toBe(false);
  });

  it("uses the exact résumé skill categories and separates principles from passing tests", () => {
    render(
      <SkillsPage dictionary={dictionaries.en} locale="en" portfolio={localPortfolio} />,
    );

    for (const category of [
      "Languages",
      "Back-End",
      "Front-End",
      "Architecture & Design",
      "Data & Messaging",
      "DevOps & Cloud",
      "Practices",
    ]) {
      expect(screen.getByRole("heading", { name: category })).toBeInTheDocument();
    }

    const architecture = screen.getByRole("region", { name: "Architecture & Design" });
    const tests = screen.getByRole("region", { name: "Engineering practices" });
    expect(architecture).toHaveTextContent("Clean Architecture · SOLID");
    expect(tests).toHaveTextContent("TDD · BDD · Unit & Integration Testing");
    expect(tests).not.toHaveTextContent(/Clean Architecture|SOLID/);
    expect(tests).toHaveTextContent("Passed");
  });

  it("separates all five professional projects from GitHub repositories", () => {
    render(
      <ProjectsPage dictionary={dictionaries.en} locale="en" portfolio={localPortfolio} />,
    );

    const professionalProjects = screen.getByRole("region", { name: "Professional Projects" });
    const repositories = screen.getByRole("region", { name: "GitHub repositories" });
    expect(professionalProjects.querySelectorAll(".project-row")).toHaveLength(5);
    expect(repositories.querySelectorAll(".project-row")).toHaveLength(4);
    expect(within(professionalProjects).getByText(/EHS Suite/)).toBeInTheDocument();
    expect(within(professionalProjects).getByText(/Arobus/)).toBeInTheDocument();
    expect(within(professionalProjects).getByText(/Rebook Pump/)).toBeInTheDocument();
    expect(within(professionalProjects).getByText("Bookkeeping Platform")).toBeInTheDocument();
    expect(within(professionalProjects).getByText(/Agah LMS/)).toBeInTheDocument();
    expect(within(repositories).getByText("Daveslist")).toBeInTheDocument();
  });
});
