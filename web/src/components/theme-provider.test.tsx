import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  PortfolioThemeProvider,
  useTheme,
} from "@/components/theme-provider";

function ThemeProbe() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <div>
      <span>{resolvedTheme}</span>
      <button type="button" onClick={() => setTheme("light")}>Use light</button>
    </div>
  );
}

describe("PortfolioThemeProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    document.cookie = "theme=; Path=/; Max-Age=0";
    document.documentElement.className = "dark";
    document.documentElement.style.colorScheme = "dark";
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("applies and persists a selected theme", async () => {
    const user = userEvent.setup();
    render(<PortfolioThemeProvider initialTheme="dark"><ThemeProbe /></PortfolioThemeProvider>);

    await user.click(screen.getByRole("button", { name: "Use light" }));

    expect(document.documentElement).toHaveClass("light");
    expect(document.documentElement).not.toHaveClass("dark");
    expect(document.documentElement.style.colorScheme).toBe("light");
    expect(localStorage.getItem("theme")).toBe("light");
    expect(document.cookie).toContain("theme=light");
    expect(screen.getByText("light")).toBeInTheDocument();
  });

  it("adopts a previously stored theme after hydration", async () => {
    document.documentElement.className = "light";
    document.documentElement.style.colorScheme = "light";
    localStorage.setItem("theme", "light");

    render(<PortfolioThemeProvider initialTheme="dark"><ThemeProbe /></PortfolioThemeProvider>);

    await waitFor(() => expect(screen.getByText("light")).toBeInTheDocument());
    expect(document.documentElement).toHaveClass("light");
  });
});
