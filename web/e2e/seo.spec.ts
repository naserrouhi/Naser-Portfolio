import { expect, test } from "@playwright/test";

import { publishedArticleSlugs } from "../src/lib/article-routes";

const siteOrigin = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://naserrouhi.github.io",
).origin;
const [articleSlug] = publishedArticleSlugs;

test("renders indexable page metadata and structured data without console errors", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  const response = await page.goto("/en/projects");

  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle(".NET Projects | Naser Rouhi");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    `${siteOrigin}/en/projects`,
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    `${siteOrigin}/en/opengraph-image`,
  );
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
    "content",
    "en_US",
  );
  await expect(page.locator("h1")).toHaveCount(1);

  const structuredData = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((scripts) => scripts.map((script) => JSON.parse(script.textContent ?? "{}")));
  expect(structuredData).toHaveLength(1);
  expect(structuredData[0]["@graph"][0]["@type"]).toBe("BreadcrumbList");
  expect(consoleErrors).toEqual([]);
});

test("uses a concise portfolio tab title and personal favicon", async ({ page }) => {
  await page.goto("/en");

  await expect(page).toHaveTitle("Naser Rouhi | Senior .NET Engineer");
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute("href", "/favicon.svg");
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute("type", "image/svg+xml");

  const favicon = await page.request.get("/favicon.svg");
  expect(favicon.status()).toBe(200);
  expect(favicon.headers()["content-type"]).toContain("image/svg+xml");
  expect(await favicon.text()).toContain("Naser Rouhi");
});

test("keeps the complete portfolio content in the server response behind the startup splash", async ({ request }) => {
  const response = await request.get("/en");
  const html = await response.text();

  expect(response.status()).toBe(200);
  expect(html).toContain("Naser Rouhi");
  expect(html).toContain("Engineering systems that scale");
  expect(html).toContain('type="application/ld+json"');
  expect(html).toContain("startup-splash");
});

test("serves crawler controls with truthful status codes and URLs", async ({ request }) => {
  const root = await request.get("/", { maxRedirects: 0 });
  expect(root.status()).toBe(308);
  expect(new URL(root.headers().location, "http://127.0.0.1:3000").pathname).toBe("/en");

  const missingSection = await request.get("/en/not-a-section");
  expect(missingSection.status()).toBe(404);

  const missingArticle = await request.get("/en/articles/not-an-article");
  expect(missingArticle.status()).toBe(404);

  const resume = await request.get("/resume.pdf");
  expect(resume.status()).toBe(200);
  expect(resume.headers()["x-robots-tag"]).toBe("noindex, follow");

  const socialImage = await request.get("/en/opengraph-image");
  expect(socialImage.status()).toBe(200);
  expect(socialImage.headers()["content-type"]).toContain("image/png");
  expect((await socialImage.body()).byteLength).toBeGreaterThan(10_000);

  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain(`Sitemap: ${siteOrigin}/sitemap.xml`);

  const sitemap = await request.get("/sitemap.xml");
  const sitemapXml = await sitemap.text();
  expect(sitemapXml).toContain(`${siteOrigin}/en/articles/${articleSlug}`);
  expect(sitemapXml).not.toContain(`${siteOrigin}/fa/articles/${articleSlug}`);
  expect(sitemapXml).not.toContain(`${siteOrigin}/de/articles/${articleSlug}`);
  expect(sitemapXml).not.toContain(`${siteOrigin}/fr/articles/${articleSlug}`);
  expect(sitemapXml).not.toContain(`${siteOrigin}/nl/articles/${articleSlug}`);
  expect(sitemapXml).not.toContain(`${siteOrigin}/es/articles/${articleSlug}`);
  expect(sitemapXml).not.toContain(`${siteOrigin}/ar/articles/${articleSlug}`);
  expect(sitemapXml).not.toContain(`${siteOrigin}/tr/articles/${articleSlug}`);
});

test("keeps untranslated article fallbacks out of the index", async ({ page }) => {
  const response = await page.goto(`/es/articles/${articleSlug}`);

  expect(response?.status()).toBe(200);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex,\s*follow/,
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    `${siteOrigin}/en/articles/${articleSlug}`,
  );

  const alternateLanguages = await page
    .locator('link[rel="alternate"][hreflang]')
    .evaluateAll((links) => links.map((link) => link.getAttribute("hreflang")));
  expect(alternateLanguages).toContain("en");
  expect(alternateLanguages).not.toContain("es");
  expect(alternateLanguages).not.toContain("ar");
  expect(alternateLanguages).not.toContain("tr");
});
