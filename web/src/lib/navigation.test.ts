import { describe, expect, it } from "vitest";

import { pageFromPath, pagePath } from "@/lib/navigation";

describe("localized navigation", () => {
  it("builds localized overview and section paths", () => {
    expect(pagePath("en", "overview")).toBe("/en");
    expect(pagePath("fa", "projects")).toBe("/fa/projects");
  });

  it("derives the active document from nested routes", () => {
    expect(pageFromPath("/de/articles/portfolio-workbench-case-study")).toBe("articles");
    expect(pageFromPath("/en")).toBe("overview");
  });
});
