import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { OutputPanel, type OutputMode } from "@/components/output-panel";
import { dictionaries } from "@/i18n/dictionaries";
import { localPortfolio } from "@/lib/portfolio-data";

describe("output panel", () => {
  function renderPanel(mode: OutputMode) {
    return render(
      <OutputPanel
        dictionary={dictionaries.en}
        portfolio={localPortfolio}
        mode={mode}
        onModeChange={vi.fn()}
        announcement=""
      />,
    );
  }

  it("keeps complete log text accessible while marking every line for a writing reveal", () => {
    const { container } = renderPanel("output");
    const log = screen.getByRole("log");
    const lines = container.querySelectorAll<HTMLElement>(".output-typewriter");

    expect(log).toHaveAttribute("aria-live", "polite");
    expect(log).toHaveTextContent("[profile]");
    expect(log).toHaveTextContent(localPortfolio.profile.headline);
    expect(log).toHaveTextContent("Clean Architecture");
    expect(lines).toHaveLength(3);
    expect(lines[0].style.getPropertyValue("--output-character-count")).not.toBe("");
    expect(lines[0].style.getPropertyValue("--output-write-duration")).toMatch(/ms$/);
  });

  it("applies the same reveal to timeline and article rows without breaking article links", () => {
    const view = renderPanel("timeline");

    expect(view.container.querySelector(".output-heading")).toHaveTextContent("Timeline");
    expect(view.container.querySelectorAll(".output-typewriter-timeline")).toHaveLength(
      localPortfolio.experience.length,
    );
    expect(view.container).toHaveTextContent(localPortfolio.experience[0].company);

    view.rerender(
      <OutputPanel
        dictionary={dictionaries.en}
        portfolio={localPortfolio}
        mode="articles"
        onModeChange={vi.fn()}
        announcement=""
      />,
    );

    expect(view.container.querySelector(".output-heading")).toHaveTextContent("Articles");
    expect(view.container.querySelectorAll(".output-typewriter-article")).toHaveLength(
      localPortfolio.articles.length,
    );
    expect(screen.getByRole("link", { name: localPortfolio.articles[0].title })).toHaveAttribute(
      "href",
      `/en/articles/${localPortfolio.articles[0].slug}`,
    );
  });
});
