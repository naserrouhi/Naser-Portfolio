# Naser Rouhi — Portfolio Workbench

A multilingual, dark-first engineering portfolio presented as a high-fidelity Visual Studio 2022 workbench.
It combines a .NET 10 Clean Architecture API with a server-rendered Next.js 16 / React 19
frontend, executable BDD scenarios, unit and integration tests, production containers, and
search-engine-ready locale routes.

The source material is Naser Rouhi's supplied résumé and cover letter plus his public
[LinkedIn](https://www.linkedin.com/in/naser-rouhi-nomonia/) and
[GitHub](https://github.com/naserrouhi) profiles.

## Highlights

- Visual Studio-inspired workbench with real menus, editor tabs, explorer, output panel,
  command palette, shortcuts, responsive sheets, and print mode
- English, Persian, German, French, Dutch, Spanish, Arabic, and Turkish routes
- correct right-to-left behavior for Persian and Arabic
- dark default plus persistent light mode
- semantic server-rendered content with canonical URLs, `hreflang`, Open Graph images,
  JSON-LD, robots, manifest, and localized sitemap
- DDD article aggregate, Clean Architecture boundaries, SOLID ports/adapters, and a cached
  GitHub anti-corruption adapter with offline fallback
- xUnit domain/application/integration coverage and executable Reqnroll Gherkin scenarios
- Vitest + React Testing Library component tests and Playwright browser smoke scenarios
- multi-stage, non-root Docker images and a one-command Compose environment
- CI for backend, frontend, and container builds

## Run locally

Requirements: .NET 10 SDK and Node.js 24+.

Start the API:

```powershell
dotnet run --project src/NaserPortfolio.Api --urls http://localhost:5100
```

In a second terminal, start the web application:

```powershell
Set-Location web
$env:API_INTERNAL_URL = "http://localhost:5100"
& npm.cmd run dev
```

Open <http://localhost:3000>; the root redirects to the canonical English route at `/en`.

## Run with Docker

```powershell
docker compose up --build
```

The web application is exposed at <http://localhost:3000> and the API at
<http://localhost:5100>. Override `NEXT_PUBLIC_SITE_URL` with the real HTTPS origin before a
production deployment so canonical and social metadata use the deployed host. Set
`CORS_ALLOWED_ORIGIN` to that same browser-facing origin. The production indexing and
Search Console checklist is documented in [docs/seo-launch.md](docs/seo-launch.md).

## Verify

```powershell
dotnet restore NaserPortfolio.slnx
dotnet build NaserPortfolio.slnx --configuration Release --no-restore
dotnet test NaserPortfolio.slnx --configuration Release --no-build

Set-Location web
& npm.cmd ci
& npm.cmd run lint
& npm.cmd run typecheck
& npm.cmd run test:run
& npm.cmd run build
```

Browser smoke tests run against the built standalone output and require Playwright's
Chromium installation, so run `npm run build` first:

```powershell
Set-Location web
& npx.cmd playwright install chromium
& npm.cmd run test:e2e
```

If Chromium is already installed locally, the suite can use it without a download:

```powershell
$env:PLAYWRIGHT_BROWSER_EXECUTABLE = "C:\Program Files\Google\Chrome\Application\chrome.exe"
& npm.cmd run test:e2e
```

## Structure

```text
src/
  NaserPortfolio.Domain/          aggregate behavior and value objects
  NaserPortfolio.Application/     use cases, DTOs, and inward-facing ports
  NaserPortfolio.Infrastructure/  résumé, article, cache, and GitHub adapters
  NaserPortfolio.Api/             HTTP delivery and composition root
tests/
  NaserPortfolio.Domain.Tests/
  NaserPortfolio.Application.Tests/
  NaserPortfolio.Infrastructure.Tests/
  NaserPortfolio.Api.IntegrationTests/
  NaserPortfolio.AcceptanceTests/ executable Gherkin scenarios
web/
  src/app/                        locale routes and SEO metadata
  src/components/                 workbench and Shadcn-style primitives
  src/lib/                        dictionaries, contracts, API/fallback data
docs/                             architecture, localization, and decisions
```

The architectural rationale and domain boundaries are documented in
[docs/architecture.md](docs/architecture.md). The Visual Studio presentation decision is recorded in
[ADR 0001](docs/decisions/0001-portfolio-workbench.md), and production search setup is covered by
[the SEO launch checklist](docs/seo-launch.md).

## Content and privacy

The résumé is copied into `web/public` so viewing, downloading, and printing it do not depend
on a third-party host. The supplied cover letter is source material only and is deliberately
not published as a downloadable asset. Professional metrics are presented as résumé-reported
outcomes. The résumé email and phone number are shown on the Contact document alongside
LinkedIn and GitHub.

Live GitHub counts are volatile. The UI labels them as current data and falls back to a curated
snapshot when GitHub or the API is unavailable.
