import { describe, expect, it } from "vitest";

import { dictionaries } from "@/i18n/dictionaries";
import { hasLocale, locales, replacePathLocale } from "@/lib/i18n";
import { pageKeys } from "@/lib/navigation";

describe("portfolio localization", () => {
  it("has a complete typed dictionary for every supported locale", () => {
    expect(Object.keys(dictionaries)).toEqual([...locales]);
    for (const locale of locales) {
      expect(Object.keys(dictionaries[locale].nav)).toEqual([...pageKeys]);
      expect(dictionaries[locale].pages.overview.title.length).toBeGreaterThan(10);
      expect(dictionaries[locale].content.principles).toHaveLength(4);
    }
  });

  it("replaces only the locale while preserving a deep route", () => {
    expect(replacePathLocale("/en/articles/portfolio-workbench-case-study", "fa"))
      .toBe("/fa/articles/portfolio-workbench-case-study");
    expect(replacePathLocale("/projects", "de")).toBe("/de/projects");
  });

  it("narrows supported locale values", () => {
    expect(hasLocale("nl")).toBe(true);
    expect(hasLocale("xx")).toBe(false);
  });
});
