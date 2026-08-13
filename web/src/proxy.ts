import { type NextRequest, NextResponse } from "next/server";

import { isPublishedArticleSlug } from "@/lib/article-routes";
import { hasLocale } from "@/lib/i18n";
import { sectionKeys } from "@/lib/navigation";

const localizedRoutes = new Set<string>([...sectionKeys, "opengraph-image"]);

function notFoundResponse(request: NextRequest) {
  return NextResponse.rewrite(new URL("/_not-found", request.url), { status: 404 });
}

export function proxy(request: NextRequest) {
  const segments = request.nextUrl.pathname.split("/").filter(Boolean);
  const [locale, section, slug] = segments;

  if (!hasLocale(locale)) return NextResponse.next();

  if (segments.length === 2 && !localizedRoutes.has(section)) {
    return notFoundResponse(request);
  }

  if (segments.length === 3 && section === "articles" && !isPublishedArticleSlug(slug)) {
    return notFoundResponse(request);
  }

  return NextResponse.next();
}

// These are the localized dynamic shapes where the shared workbench layout can
// begin streaming before a nested route reports that its segment does not exist.
export const config = {
  matcher: ["/:locale/:section", "/:locale/articles/:slug"],
};
