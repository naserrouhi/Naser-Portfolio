"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type PortfolioTheme = "dark" | "light";

type ThemeContextValue = {
  resolvedTheme: PortfolioTheme;
  setTheme: (theme: PortfolioTheme) => void;
  theme: PortfolioTheme;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const storageKey = "theme";
const themeCookieMaxAge = 60 * 60 * 24 * 365;

function isPortfolioTheme(value: string | null): value is PortfolioTheme {
  return value === "dark" || value === "light";
}

function themeFromDocument(): PortfolioTheme {
  return document.documentElement.classList.contains("light") ? "light" : "dark";
}

function applyTheme(theme: PortfolioTheme) {
  const root = document.documentElement;
  const transitionGuard = document.createElement("style");
  transitionGuard.textContent =
    "*,*::before,*::after{transition:none!important;animation-duration:0s!important}";
  document.head.appendChild(transitionGuard);

  root.classList.remove("dark", "light");
  root.classList.add(theme);
  root.style.colorScheme = theme;

  window.getComputedStyle(document.body);
  window.setTimeout(() => transitionGuard.remove(), 0);
}

export function PortfolioThemeProvider({
  children,
  initialTheme,
}: {
  children: React.ReactNode;
  initialTheme: PortfolioTheme;
}) {
  const [theme, setThemeState] = useState<PortfolioTheme>(initialTheme);

  const setTheme = useCallback((nextTheme: PortfolioTheme) => {
    applyTheme(nextTheme);
    setThemeState(nextTheme);

    try {
      localStorage.setItem(storageKey, nextTheme);
    } catch {}

    document.cookie = `${storageKey}=${nextTheme}; Path=/; Max-Age=${themeCookieMaxAge}; SameSite=Lax`;
  }, []);

  useEffect(() => {
    const synchronizationFrame = window.requestAnimationFrame(() => {
      let storedTheme: string | null = null;
      try {
        storedTheme = localStorage.getItem(storageKey);
      } catch {}

      const nextTheme = isPortfolioTheme(storedTheme)
        ? storedTheme
        : themeFromDocument();
      if (nextTheme !== themeFromDocument()) applyTheme(nextTheme);
      setThemeState(nextTheme);
      document.cookie = `${storageKey}=${nextTheme}; Path=/; Max-Age=${themeCookieMaxAge}; SameSite=Lax`;
    });

    function synchronizeTheme(event: StorageEvent) {
      if (event.key !== storageKey) return;
      const nextTheme = isPortfolioTheme(event.newValue) ? event.newValue : "dark";
      applyTheme(nextTheme);
      setThemeState(nextTheme);
    }

    window.addEventListener("storage", synchronizeTheme);
    return () => {
      window.cancelAnimationFrame(synchronizationFrame);
      window.removeEventListener("storage", synchronizeTheme);
    };
  }, []);

  const value = useMemo(
    () => ({ theme, resolvedTheme: theme, setTheme }),
    [setTheme, theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within PortfolioThemeProvider.");
  return context;
}
