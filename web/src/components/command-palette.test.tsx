import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { CommandPalette } from "@/components/command-palette";
import { dictionaries } from "@/i18n/dictionaries";

afterEach(cleanup);

function renderPalette(overrides: Partial<React.ComponentProps<typeof CommandPalette>> = {}) {
  const props: React.ComponentProps<typeof CommandPalette> = {
    open: true,
    onOpenChange: vi.fn(),
    dictionary: dictionaries.en,
    locale: "en",
    onNavigate: vi.fn(),
    onTheme: vi.fn(),
    onTour: vi.fn(),
    ...overrides,
  };

  render(<CommandPalette {...props} />);
  return props;
}

describe("CommandPalette", () => {
  it("presents Visual Studio code-search scopes and C# file metadata", () => {
    renderPalette();

    expect(screen.getByRole("dialog")).toBeVisible();
    expect(screen.getByRole("heading", { name: "Code Search" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Files" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "Types" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Members" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Text" })).toBeVisible();
    expect(screen.getAllByText("Portfolio.cs").length).toBeGreaterThan(0);
    expect(screen.getByText("Ctrl+K")).toBeVisible();
  });

  it("filters results by scope and opens the selected C# document", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    const onOpenChange = vi.fn();
    renderPalette({ onNavigate, onOpenChange });

    await user.click(screen.getByRole("button", { name: "Files" }));
    expect(screen.getByRole("button", { name: "Files" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.queryByText("class Experience")).not.toBeInTheDocument();

    const input = screen.getByPlaceholderText("Type a page, project, or action…");
    await user.type(input, "Experience");
    await user.keyboard("{Enter}");

    expect(onNavigate).toHaveBeenCalledWith("/en/experience");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("keeps the Visual Studio search window open when it is pinned", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    const onOpenChange = vi.fn();
    renderPalette({ onNavigate, onOpenChange });

    await user.click(screen.getByRole("button", { name: "Pin search window" }));
    await user.type(screen.getByPlaceholderText("Type a page, project, or action…"), "Deutsch");
    await user.keyboard("{Enter}");

    expect(onNavigate).toHaveBeenCalledWith("/de");
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
    expect(screen.getByRole("button", { name: "Unpin search window" })).toHaveAttribute("aria-pressed", "true");
  });
});
