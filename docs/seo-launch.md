# Production SEO launch checklist

The application emits crawlable server-rendered HTML, canonical links, localized alternates,
structured data, social previews, `robots.txt`, and `sitemap.xml`. Those signals are only valid
after one public HTTPS origin has been selected and configured.

## Before building the production image

1. Set `NEXT_PUBLIC_SITE_URL` to the exact public origin, for example
   `https://portfolio.example.com`. Do not include a trailing slash or path.
2. Set `CORS_ALLOWED_ORIGIN` to the same browser-facing origin.
3. Optionally set `GOOGLE_SITE_VERIFICATION` to the HTML verification token supplied by
   Google Search Console. Prefer DNS property verification when DNS access is available.
4. Optionally set `SITE_LAST_MODIFIED` to a truthful ISO-8601 timestamp for the last
   significant main-page content update. If it is unknown, leave it unset; the sitemap omits
   guessed dates. Published articles use their own publication dates.
5. Build the web image after setting the canonical origin because public metadata is included
   in the production build.

## Validate the deployed origin

Check these public responses before requesting indexing:

- `/en` returns HTTP 200 and contains the production-domain canonical.
- `/` permanently redirects to `/en`.
- `/robots.txt` allows crawling and references the production sitemap.
- `/sitemap.xml` contains only production HTTPS URLs.
- Each indexed page has one descriptive title and one visible `h1`.
- Article language alternates point only to genuine translations.
- Unknown sections and unpublished article slugs return HTTP 404.

Validate the deployed home, About, and article URLs with Google's Rich Results Test and use
Search Console URL Inspection to confirm that rendered HTML contains the visible portfolio
content and JSON-LD.

## Make Google discover the site

1. Add the HTTPS property to Google Search Console.
2. Submit `/sitemap.xml` in the Sitemaps report.
3. Inspect `/en` and request indexing after the first deployment.
4. Add the production URL to the GitHub profile, LinkedIn contact information, résumé, and
   relevant repository READMEs so those established profiles link back to the portfolio.

## Maintain search quality

- Publish first-hand project case studies and technical articles with concrete decisions,
  trade-offs, evidence, and outcomes; do not create thin pages merely to target keywords.
- Add a URL to the sitemap only when the corresponding content is actually published.
- Keep canonical URLs stable. Use permanent redirects if the domain or path changes.
- Use truthful publication and modification dates.
- Monitor indexing, Core Web Vitals, structured-data warnings, and manual actions in Search
  Console after each substantial release.
