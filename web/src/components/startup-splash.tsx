"use client";

import { useEffect, useState } from "react";

import { VisualStudioLogo } from "@/components/visual-studio-icons";

export const startupSplashDuration = 500;

export function StartupSplash() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const dismissalTimer = window.setTimeout(() => {
      setVisible(false);
    }, startupSplashDuration);

    return () => window.clearTimeout(dismissalTimer);
  }, []);

  if (!visible) return null;

  return (
    <div className="startup-splash" aria-hidden="true">
      <div className="startup-splash-window">
        <span className="startup-splash-ribbon startup-splash-ribbon-top" />
        <span className="startup-splash-ribbon startup-splash-ribbon-bottom" />
        <div className="startup-splash-brand">
          <div className="startup-splash-wordmark">
            <VisualStudioLogo className="startup-splash-logo" />
            <strong>Portfolio Workbench</strong>
          </div>
          <span className="startup-splash-signature">Naser Rouhi</span>
        </div>
        <span className="startup-splash-year">2026</span>
        <span className="startup-splash-progress" />
      </div>
    </div>
  );
}
