# Architecture

Naser Portfolio is one deployable product with two runtime processes: a server-rendered
Next.js experience and an ASP.NET Core content API. The split is deliberate: Next.js owns
the document experience and search-engine-facing HTML, while .NET demonstrates the same
domain and application design used in production backend systems.

```text
Browser / crawler
       |
       v
Next.js web (SSR, locale routes, metadata, interaction islands)
       |
       v
ASP.NET Core API (HTTP delivery and composition)
       |
       v
Application (portfolio queries and ports)
       |
       +-------------------------+
       v                         v
Domain                      Infrastructure
(Article aggregate)         (profile, article, GitHub adapters)
```

Dependencies always point inward:

```text
Api -> Application -> Domain
Api -> Infrastructure -> Application / Domain
```

The web application communicates only with the API contract. It also carries a small,
typed fallback snapshot so a temporary GitHub/API outage cannot make a résumé page blank.

## Domain model

`Article` is the aggregate root for the Portfolio Publishing context. It protects these
invariants:

- a valid, stable slug is required;
- English title, summary, and body are always present as the canonical fallback;
- public queries expose only published articles;
- publication and withdrawal happen through explicit aggregate operations;
- a successful publication records an `ArticlePublished` domain event.

`Slug` and `LocalizedText` are immutable value objects. Article repositories are ports
defined inward and implemented by infrastructure. Profile and GitHub project data are
read-oriented supporting subdomains, so they intentionally use lighter application ports
instead of artificial aggregates.

## Context boundaries

| Context | Responsibility | Integration style |
| --- | --- | --- |
| Portfolio Publishing | Article lifecycle and localization fallback | Domain aggregate and repository port |
| Professional Profile | Résumé facts, experience, skills, education | Immutable read model |
| Public Code Catalog | Public GitHub repositories and volatile metrics | Anti-corruption adapter with cache and fallback |
| Workbench Experience | Routes, theme, locale, panels, accessibility | Next.js Server Components plus small client islands |

GitHub wire DTOs never cross the infrastructure boundary. Volatile network data is mapped
to the portfolio's own `ProjectSummary` language.

## Quality strategy

- Domain unit tests exercise valid and rejected aggregate transitions.
- Application unit tests prove orchestration and fallback behavior with test doubles.
- API integration tests verify real routing, serialization, status codes, and composition.
- Reqnroll features express visitor-facing behavior in executable Gherkin.
- Vitest and React Testing Library cover interactive components and locale utilities.
- Playwright smoke scenarios cover the rendered navigation contract.
- The CI workflow builds and tests both stacks, then verifies both container images build.

## Runtime resilience

The GitHub adapter uses a bounded HTTP timeout, response validation, memory caching, and a
curated fallback. The frontend API client likewise renders a typed local snapshot when the
API is unavailable. This is graceful degradation for a public document, not silent error
suppression: development output still exposes whether live data was used.

## Security and privacy

Only information present in the supplied résumé or public profiles is rendered. The résumé
email and phone are exposed only in the Contact document. The supplied cover letter is not
served as a public asset. External links use safe opener attributes, JSON-LD values are
serialized safely, and no API tokens or secrets are required.
