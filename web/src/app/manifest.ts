import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Naser Rouhi · Portfolio Workbench",
    short_name: "NR Workbench",
    description: "Senior Software Engineer portfolio for Naser Rouhi.",
    start_url: "/en",
    display: "standalone",
    background_color: "#1f1f1f",
    theme_color: "#1c1c1c",
    icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
