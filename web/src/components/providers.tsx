"use client";

import {
  PortfolioThemeProvider,
  type PortfolioTheme,
} from "@/components/theme-provider";

export function Providers({
  children,
  initialTheme,
}: {
  children: React.ReactNode;
  initialTheme: PortfolioTheme;
}) {
  return (
    <PortfolioThemeProvider initialTheme={initialTheme}>
      {children}
    </PortfolioThemeProvider>
  );
}
