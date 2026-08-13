import "server-only";

import {
  localPortfolio,
  portfolioWorkbenchArticle,
  type Article,
  type PortfolioOverview,
} from "@/lib/portfolio-data";

const apiBaseUrl =
  process.env.API_INTERNAL_URL ??
  process.env.PORTFOLIO_API_URL ??
  process.env.NEXT_PUBLIC_API_URL;

type WireSocialLink = { platform: string; url: string };
type WireExperience = {
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string | null;
  summary: string;
  highlights: string[];
  technologies: string[];
};
type WireSkillGroup = { name: string; skills: string[] };
type WireEducation = {
  institution: string;
  degree: string;
  field: string;
  location: string;
  startYear: string;
  endYear: string;
  description: string;
};
type WireSpokenLanguage = { name: string; proficiency: string };
type WireAward = { title: string; issuer: string; date: string };
type WireMetric = { value: string; label: string; context: string };
type WireCaseStudy = {
  slug: string;
  name: string;
  description: string;
  role: string;
  period?: string;
  technologies: string[];
  externalUrl: string | null;
};
type WireProfile = {
  name: string;
  headline: string;
  summary: string;
  location: string;
  email: string;
  phone: string;
  yearsOfExperience: number;
  socialLinks: WireSocialLink[];
  experience: WireExperience[];
  education?: WireEducation;
  awards?: WireAward[];
  languages?: WireSpokenLanguage[];
  skillGroups: WireSkillGroup[];
  impact: WireMetric[];
  keyProjects?: WireCaseStudy[];
  selectedWork?: WireCaseStudy[];
};
type WireProject = {
  slug: string;
  name: string;
  summary: string;
  repositoryUrl: string;
  liveUrl: string | null;
  primaryLanguage: string;
  technologies: string[];
  stars: number | null;
  isFeatured: boolean;
  evidence: string;
};
type WireOverview = {
  profile: WireProfile;
  githubRepositories?: WireProject[];
  projects?: WireProject[];
};
type WireArticleSummary = {
  slug: string;
  title: string;
  summary: string;
  language: string;
  availableLanguages?: string[];
  publishedAtUtc: string;
  readingTimeMinutes: number;
};
type WireArticleDetails = WireArticleSummary & { body: string };

function apiUrl(path: string) {
  return `${apiBaseUrl?.replace(/\/$/, "")}${path}`;
}

async function fetchJson<T>(path: string): Promise<T | null> {
  if (!apiBaseUrl) return null;

  try {
    const response = await fetch(apiUrl(path), {
      headers: { Accept: "application/json" },
      next: { revalidate: 900 },
      signal: AbortSignal.timeout(5500),
    });

    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function isWireOverview(value: unknown): value is WireOverview {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<WireOverview>;
  const repositories = candidate.githubRepositories ?? candidate.projects;
  return Boolean(
    candidate.profile?.name &&
      Array.isArray(candidate.profile.experience) &&
      Array.isArray(candidate.profile.skillGroups) &&
      Array.isArray(candidate.profile.impact) &&
      Array.isArray(repositories) &&
      repositories.every((project) => project?.slug && project?.name),
  );
}

function isWireArticle(value: unknown): value is WireArticleSummary {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<WireArticleSummary>;
  return Boolean(candidate.slug && candidate.title && candidate.summary);
}

function mapOverview(wire: WireOverview): PortfolioOverview {
  const githubUrl =
    wire.profile.socialLinks.find((link) => link.platform.toLowerCase() === "github")?.url ??
    localPortfolio.profile.github.url;
  const linkedinUrl =
    wire.profile.socialLinks.find((link) => link.platform.toLowerCase() === "linkedin")?.url ??
    localPortfolio.profile.linkedinUrl;

  const githubRepositories = (wire.githubRepositories ?? wire.projects ?? []).map((project) => ({
    kind: "github-repository" as const,
    slug: project.slug,
    name: project.name,
    description: project.summary,
    stack: project.technologies.length > 0
      ? project.technologies
      : [project.primaryLanguage],
    repositoryUrl: project.repositoryUrl,
    websiteUrl: project.liveUrl ?? undefined,
    featured: project.isFeatured,
    note: project.evidence,
  }));

  const keyProjects = (wire.profile.keyProjects ?? wire.profile.selectedWork ?? [])
    .map((work) => ({
      kind: "resume-project" as const,
      slug: work.slug,
      name: work.name,
      description: work.description,
      stack: work.technologies,
      websiteUrl: work.externalUrl ?? undefined,
      note: work.period ?? `Professional case study · ${work.role}`,
    }));

  const education = wire.profile.education;
  const languages = wire.profile.languages?.length
    ? [...wire.profile.languages].sort((left, right) =>
        Number(right.name.toLowerCase() === "english") - Number(left.name.toLowerCase() === "english"))
    : localPortfolio.profile.languages;

  return {
    profile: {
      name: wire.profile.name,
      headline: wire.profile.headline,
      summary: wire.profile.summary,
      location: wire.profile.location,
      email: wire.profile.email,
      phone: wire.profile.phone,
      yearsOfExperience: `${wire.profile.yearsOfExperience}+`,
      github: { ...localPortfolio.profile.github, url: githubUrl },
      linkedinUrl,
      education: education
        ? {
            degree: education.field
              ? `${education.degree} in ${education.field}`
              : education.degree,
            institution: education.institution,
            startYear: education.startYear,
            endYear: education.endYear,
            location: education.location,
            note: education.description,
          }
        : localPortfolio.profile.education,
      languages,
      awards: wire.profile.awards?.length
        ? wire.profile.awards.map((award) => ({
            title: award.title,
            organization: award.issuer,
            years: award.date.split(/\s*(?:&|,)\s*/).filter(Boolean),
          }))
        : localPortfolio.profile.awards,
    },
    metrics: wire.profile.impact.map((metric) => ({
      value: metric.value,
      label: metric.label,
      context: metric.context,
    })),
    experience: wire.profile.experience.map((experience) => ({
      company: experience.company,
      role: experience.role.replace(/\s*\(Part-time\)$/i, ""),
      location: experience.location,
      start: experience.startDate,
      end: experience.endDate ?? undefined,
      employmentType: /part-time/i.test(experience.role) ? "Part-time" : "Full-time",
      summary: experience.summary,
      highlights: experience.highlights,
      technologies: experience.technologies,
    })),
    keyProjects: keyProjects.length ? keyProjects : localPortfolio.keyProjects,
    githubRepositories,
    skills: wire.profile.skillGroups.map((group) => ({
      name: group.name,
      items: group.skills,
    })),
    articles: localPortfolio.articles,
  };
}

function articleSections(body: string) {
  const paragraphs = body
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return [
    {
      heading: "Portfolio Workbench",
      paragraphs: paragraphs.length > 0 ? paragraphs : [body],
    },
  ];
}

function mapArticle(wire: WireArticleSummary, body?: string): Article {
  return {
    slug: wire.slug,
    title: wire.title,
    excerpt: wire.summary,
    language: wire.language,
    availableLanguages: wire.availableLanguages,
    status: "case-study",
    publishedAt: wire.publishedAtUtc,
    readingMinutes: wire.readingTimeMinutes,
    sections: body ? articleSections(body) : undefined,
  };
}

export async function getPortfolioOverview(): Promise<PortfolioOverview> {
  const remote = await fetchJson<unknown>("/api/v1/overview");
  return isWireOverview(remote) ? mapOverview(remote) : localPortfolio;
}

export async function getArticles(language: string): Promise<readonly Article[]> {
  const remote = await fetchJson<unknown>(
    `/api/v1/articles?language=${encodeURIComponent(language)}`,
  );
  return Array.isArray(remote) && remote.every(isWireArticle)
    ? remote.map((article) => mapArticle(article))
    : localPortfolio.articles;
}

export async function getArticle(
  slug: string,
  language: string,
): Promise<Article | null> {
  const remote = await fetchJson<unknown>(
    `/api/v1/articles/${encodeURIComponent(slug)}?language=${encodeURIComponent(language)}`,
  );
  if (isWireArticle(remote) && typeof (remote as Partial<WireArticleDetails>).body === "string") {
    const details = remote as WireArticleDetails;
    return mapArticle(details, details.body);
  }

  if (slug === portfolioWorkbenchArticle.slug) return portfolioWorkbenchArticle;
  return null;
}
