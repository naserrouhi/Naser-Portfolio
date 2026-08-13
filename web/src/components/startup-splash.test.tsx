import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  StartupSplash,
  startupSplashDuration,
} from "@/components/startup-splash";

describe("startup splash", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("uses Naser Rouhi branding and removes itself within two seconds", () => {
    vi.useFakeTimers();
    const { container } = render(<StartupSplash />);

    expect(startupSplashDuration).toBeLessThan(2_000);
    expect(screen.getByText("Portfolio Workbench")).toBeInTheDocument();
    expect(screen.getByText("Naser Rouhi")).toBeInTheDocument();
    expect(container.querySelector(".startup-splash")).toHaveAttribute("aria-hidden", "true");

    act(() => vi.advanceTimersByTime(startupSplashDuration));

    expect(container.querySelector(".startup-splash")).not.toBeInTheDocument();
  });
});
