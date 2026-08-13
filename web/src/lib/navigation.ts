export const pageKeys = [
  "overview",
  "about",
  "experience",
  "projects",
  "skills",
  "articles",
  "contact",
] as const;

export type PageKey = (typeof pageKeys)[number];

export const sectionKeys = pageKeys.filter(
  (key): key is Exclude<PageKey, "overview"> => key !== "overview",
);

export const pageFiles: Record<PageKey, string> = {
  overview: "Portfolio.cs",
  about: "AboutMe.cs",
  experience: "Experience.cs",
  projects: "Projects.cs",
  skills: "Skills.cs",
  articles: "Articles.cs",
  contact: "Contact.cs",
};

export function pagePath(locale: string, page: PageKey) {
  return page === "overview" ? `/${locale}` : `/${locale}/${page}`;
}

export function isPageKey(value: string): value is PageKey {
  return pageKeys.includes(value as PageKey);
}

export function pageFromPath(pathname: string): PageKey {
  const segment = pathname.split("/").filter(Boolean)[1];
  return segment && isPageKey(segment) ? segment : "overview";
}
