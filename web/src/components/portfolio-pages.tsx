import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpenText,
  CalendarDays,
  CircleDot,
  ContactRound,
  Download,
  ExternalLink,
  GitBranch,
  GraduationCap,
  Languages,
  Mail,
  MapPin,
  Phone,
  Star,
  Trophy,
} from "lucide-react";

import { CopyEmailButton } from "@/components/contact-actions";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/i18n/dictionaries";
import { articleContentLocale } from "@/lib/article-routes";
import { hasLocale, localeDetails, type Locale } from "@/lib/i18n";
import { pagePath, type PageKey } from "@/lib/navigation";
import type { Article, PortfolioOverview, Project } from "@/lib/portfolio-data";
import { siteUrl } from "@/lib/site";

type PageProps = {
  dictionary: Dictionary;
  locale: Locale;
  portfolio: PortfolioOverview;
};

function PageHeader({
  page,
  dictionary,
  locale,
}: {
  page: PageKey;
  dictionary: Dictionary;
  locale: Locale;
}) {
  const copy = dictionary.pages[page];
  return (
    <header className="page-header">
      <nav className="content-breadcrumb" aria-label="Breadcrumb">
        <Link href={pagePath(locale, "overview")}>{dictionary.nav.overview}</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{dictionary.nav[page]}</span>
      </nav>
      <div className="code-signature" dir="ltr">
        <span className="syntax-keyword">public sealed class</span>{" "}
        <span className="syntax-type">{page[0].toUpperCase() + page.slice(1)}</span>{" "}
        <span className="syntax-punctuation">:</span>{" "}
        <span className="syntax-name">IPortfolioDocument</span>
      </div>
      <h1>{copy.title}</h1>
      <p>{copy.summary}</p>
    </header>
  );
}

function ExternalTextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="text-link">
      {children}<ExternalLink aria-hidden="true" />
    </a>
  );
}

function formatPortfolioDate(locale: Locale, value: string) {
  const date = new Date(value.length === 7 ? `${value}-01T00:00:00Z` : `${value}T00:00:00Z`);
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(date);
}

export function OverviewPage({ dictionary, locale, portfolio }: PageProps) {
  const { profile } = portfolio;
  return (
    <article className="portfolio-document overview-document">
      <div className="hero-layout">
        <div>
          <div className="code-signature" dir="ltr"><span className="syntax-keyword">namespace</span> <span className="syntax-name">NaserRouhi.Portfolio</span><span className="syntax-punctuation">;</span></div>
          <p className="hero-kicker"><CircleDot />{profile.headline} · {profile.location}</p>
          <h1>{profile.name}</h1>
          <h2>{dictionary.pages.overview.title}</h2>
          <p className="hero-summary">{dictionary.pages.overview.summary}</p>
          <div className="hero-actions">
            <Button asChild><Link href={pagePath(locale, "projects")}>{dictionary.nav.projects}<ArrowUpRight /></Link></Button>
            <Button asChild variant="secondary"><a href="/resume.pdf" target="_blank">{dictionary.shell.openResume}<Download /></a></Button>
            <Button asChild variant="ghost"><Link href={pagePath(locale, "contact")}>{dictionary.nav.contact}</Link></Button>
          </div>
        </div>
        <div className="portrait-frame">
          <Image src="/naser-rouhi.jpg" alt={dictionary.content.portraitAlt} width={132} height={132} priority sizes="132px" />
        </div>
      </div>

      <section aria-labelledby="outcomes-heading" className="document-section">
        <div className="section-heading"><span className="line-number" aria-hidden="true">21</span><div><p className="section-comment">{"// résumé-attributed impact"}</p><h2 id="outcomes-heading">{dictionary.common.professionalOutcomes}</h2></div></div>
        <div className="metric-grid">
          {portfolio.metrics.slice(0, 4).map((metric) => <div key={metric.label} className="metric"><strong>{metric.value}</strong><span>{metric.label}</span></div>)}
        </div>
        <p className="evidence-note">{dictionary.common.outcomesNote}</p>
      </section>

      <section aria-labelledby="selected-heading" className="document-section">
        <div className="section-heading"><span className="line-number" aria-hidden="true">34</span><div><p className="section-comment">{"// public work"}</p><h2 id="selected-heading">{dictionary.common.selectedWork}</h2></div></div>
        <div className="project-preview-grid">
          {portfolio.keyProjects.slice(0, 3).map((project) => (
            <article key={project.slug} className="project-preview">
              <div className="project-title"><GitBranch /><h3>{project.name}</h3>{project.featured && <span>{dictionary.common.featured}</span>}</div>
              <p>{project.description}</p>
              <div className="tag-list">{project.stack.slice(0, 5).map((item) => <span key={item}>{item}</span>)}</div>
              {project.repositoryUrl && <ExternalTextLink href={project.repositoryUrl}>{dictionary.common.repository}</ExternalTextLink>}
            </article>
          ))}
        </div>
      </section>
    </article>
  );
}

export function AboutPage({ dictionary, locale, portfolio }: PageProps) {
  const { awards, education, languages } = portfolio.profile;
  const englishFirst = [...languages].sort((left, right) =>
    Number(right.name.toLowerCase() === "english") - Number(left.name.toLowerCase() === "english"));

  return (
    <article className="portfolio-document">
      <PageHeader page="about" dictionary={dictionary} locale={locale} />
      <section className="prose-panel">
        <p className="lead">{dictionary.content.aboutDelivery}</p>
      </section>
      <section className="document-section" aria-labelledby="principles-heading">
        <div className="section-heading"><span className="line-number" aria-hidden="true">18</span><div><p className="section-comment">{"// principles"}</p><h2 id="principles-heading">{dictionary.content.engineeringApproach}</h2></div></div>
        <div className="principle-grid">
          {dictionary.content.principles.map((principle, index) => <article key={principle.title}><span>0{index + 1}</span><h3>{principle.title}</h3><p>{principle.description}</p></article>)}
        </div>
      </section>
      <div className="profile-fact-grid">
        <section className="education-card" aria-labelledby="education-heading">
          <GraduationCap />
          <div>
            <h2 id="education-heading">{dictionary.common.education}</h2>
            <strong>{education.degree}</strong>
            <p>{education.institution} · {education.startYear}–{education.endYear}</p>
            <p>{education.location}</p>
            <p className="fact-note">{education.note}</p>
          </div>
        </section>
        <section className="languages-card" aria-labelledby="languages-heading">
          <Languages />
          <div>
            <h2 id="languages-heading">{dictionary.common.spokenLanguages}</h2>
            <ul className="spoken-language-list">
              {englishFirst.map((language, index) => (
                <li key={language.name} className={index === 0 ? "primary-language" : undefined}>
                  {index === 0 ? <strong>{language.name}</strong> : <span>{language.name}</span>}
                  <small>{language.proficiency}</small>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section className="awards-card" aria-labelledby="awards-heading">
          <Trophy />
          <div>
            <h2 id="awards-heading">{dictionary.common.awards}</h2>
            {awards.map((award) => (
              <div className="award-entry" key={`${award.title}-${award.years.join("-")}`}>
                <strong>{award.title}</strong>
                <p>{award.organization} · {award.years.join(" & ")}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}

export function ExperiencePage({ dictionary, locale, portfolio }: PageProps) {
  return (
    <article className="portfolio-document">
      <PageHeader page="experience" dictionary={dictionary} locale={locale} />
      {locale !== "en" && <p className="language-cue">{dictionary.content.canonicalEnglishNote}</p>}
      <ol className="experience-timeline">
        {portfolio.experience.map((item, index) => (
          <li key={`${item.company}-${item.start}`}>
            <span className="timeline-line" aria-hidden="true"><i /></span>
            <article>
              <div className="experience-heading">
                <div><span className="experience-index">{String(index + 1).padStart(2, "0")}</span><h2>{item.role}</h2><p>{item.company}</p></div>
                <div className="experience-meta">
                  <span>
                    <CalendarDays />
                    <time dateTime={item.start}>{formatPortfolioDate(locale, item.start)}</time>
                    {" — "}
                    {item.end
                      ? <time dateTime={item.end}>{formatPortfolioDate(locale, item.end)}</time>
                      : dictionary.common.present}
                  </span>
                  {item.location && <span><MapPin />{item.location}</span>}
                </div>
              </div>
              <div className="tag-list"><span className={item.employmentType === "Part-time" ? "part-time" : undefined}>{item.employmentType === "Part-time" ? dictionary.common.partTime : dictionary.common.fullTime}</span>{item.technologies?.slice(0, 6).map((technology) => <span key={technology}>{technology}</span>)}</div>
              {item.summary && !item.highlights?.length && <p className="experience-summary">{item.summary}</p>}
              {!!item.highlights?.length && <ul className="highlight-list">{item.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>}
            </article>
          </li>
        ))}
      </ol>
    </article>
  );
}

function ProjectCollection({
  dictionary,
  heading,
  icon,
  id,
  projects,
}: {
  dictionary: Dictionary;
  heading: string;
  icon: React.ReactNode;
  id: string;
  projects: readonly Project[];
}) {
  return (
    <section className="project-collection" aria-labelledby={id}>
      <div className="project-collection-heading">
        {icon}
        <h2 id={id}>{heading}</h2>
        <span>{String(projects.length).padStart(2, "0")}</span>
      </div>
      <div className="project-list">
        {projects.map((project, index) => (
          <article key={project.slug} id={project.slug} className="project-row">
            <span className="project-number">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <div className="project-row-heading"><h3>{project.name}</h3>{project.featured && <span><Star />{dictionary.common.featured}</span>}</div>
              <p>{project.description}</p>
              <div className="tag-list">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
              {project.note && <p className="evidence-note">{project.note}</p>}
              <div className="project-links">{project.repositoryUrl && <ExternalTextLink href={project.repositoryUrl}><GitBranch />{dictionary.common.repository}</ExternalTextLink>}{project.websiteUrl && <ExternalTextLink href={project.websiteUrl}>{dictionary.common.liveSite}</ExternalTextLink>}</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ProjectsPage({ dictionary, locale, portfolio }: PageProps) {
  return (
    <article className="portfolio-document">
      <PageHeader page="projects" dictionary={dictionary} locale={locale} />
      {locale !== "en" && <p className="language-cue">{dictionary.content.canonicalEnglishNote}</p>}
      <ProjectCollection dictionary={dictionary} heading={dictionary.common.professionalProjects} icon={<BookOpenText />} id="professional-projects-heading" projects={portfolio.keyProjects} />
      <ProjectCollection dictionary={dictionary} heading={dictionary.common.githubRepositories} icon={<GitBranch />} id="github-repositories-heading" projects={portfolio.githubRepositories} />
      <p className="evidence-note github-snapshot">{dictionary.common.snapshot}: {portfolio.profile.github.publicRepositories} public repositories · {portfolio.profile.github.receivedStars} received stars · {portfolio.profile.github.snapshotDate}. {dictionary.content.snapshotVolatile}</p>
    </article>
  );
}

export function SkillsPage({ dictionary, locale, portfolio }: PageProps) {
  const architecturePrinciples = portfolio.skills
    .find((group) => group.name === "Architecture & Design")
    ?.items.filter((skill) => skill === "Clean Architecture" || skill === "SOLID") ?? [];
  const testPractices = portfolio.skills
    .find((group) => group.name === "Practices")
    ?.items.filter((skill) => /TDD|BDD|Testing/i.test(skill)) ?? [];

  return (
    <article className="portfolio-document">
      <PageHeader page="skills" dictionary={dictionary} locale={locale} />
      <div className="skill-groups">
        {portfolio.skills.map((group, index) => (
          <section key={group.name} className="skill-group">
            <div className="skill-title"><span>{String(index + 1).padStart(2, "0")}</span><h2>{group.name}</h2></div>
            <ul>{group.items.map((skill) => <li key={skill}>{skill}</li>)}</ul>
          </section>
        ))}
      </div>
      <div className="engineering-summaries">
        <section className="architecture-summary" aria-label="Architecture & Design"><span aria-hidden="true">{`{ }`}</span><div><strong>Architecture &amp; Design</strong><p>{architecturePrinciples.join(" · ")}</p></div></section>
        <section className="test-summary" aria-label={dictionary.content.engineeringPractices}><span className="test-success">✓</span><div><strong>{dictionary.content.engineeringPractices}</strong><p>{testPractices.join(" · ")}</p></div><span>{dictionary.content.passed}</span></section>
      </div>
    </article>
  );
}

export function ArticlesPage({ dictionary, locale, portfolio }: PageProps) {
  return (
    <article className="portfolio-document">
      <PageHeader page="articles" dictionary={dictionary} locale={locale} />
      <div className="publication-notice"><BookOpenText /><p><strong>{dictionary.content.publicationNoteTitle}</strong><br />{dictionary.content.publicationNoteBody}</p></div>
      <div className="article-list">
        {portfolio.articles.map((article) => (
          <article key={article.slug} className="article-card">
            <div className="article-meta">
              <span className={article.status}>{article.status === "case-study" ? dictionary.common.caseStudy : dictionary.common.planned}</span>
              {article.publishedAt && (
                <span><time dateTime={article.publishedAt}>{new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(article.publishedAt))}</time></span>
              )}
              {article.language === "en" && locale !== "en" && <span>{dictionary.common.englishContent}</span>}
              {article.readingMinutes && <span>{article.readingMinutes} {dictionary.common.readTime}</span>}
            </div>
            <h2>{article.title}</h2><p>{article.excerpt}</p>
            {article.status === "case-study" ? <Link href={`/${articleContentLocale(article.language)}/articles/${article.slug}`} className="text-link">{dictionary.common.viewDetails}<ArrowUpRight /></Link> : <span className="planned-label">{`// ${dictionary.content.publishingSoon}`}</span>}
          </article>
        ))}
      </div>
    </article>
  );
}

export function ContactPage({ dictionary, locale, portfolio }: PageProps) {
  const { profile } = portfolio;
  return (
    <article className="portfolio-document">
      <PageHeader page="contact" dictionary={dictionary} locale={locale} />
      <div className="contact-layout">
        <section className="contact-primary">
          <span className="available-dot"><i />{dictionary.shell.ready}</span>
          <h2>{dictionary.content.contactHeading}</h2>
          <p>{dictionary.content.contactBody}</p>
          <div className="contact-details">
            <a href={`mailto:${profile.email}`}><Mail /> <span>{profile.email}</span></a>
            {profile.phone && <a href={`tel:${profile.phone.replace(/[^+\d]/g, "")}`}><Phone /> <span>{profile.phone}</span></a>}
          </div>
          <div className="hero-actions"><Button asChild><a href={`mailto:${profile.email}`}><Mail />{dictionary.content.emailNaser}</a></Button><CopyEmailButton email={profile.email} copyLabel={dictionary.common.copy} copiedLabel={dictionary.common.copied} /></div>
          <p className="contact-location"><MapPin />{profile.location}</p>
        </section>
        <aside className="contact-links">
          <ExternalTextLink href={profile.linkedinUrl}><ContactRound />LinkedIn</ExternalTextLink>
          <ExternalTextLink href={profile.github.url}><GitBranch />GitHub</ExternalTextLink>
          <a href="/resume.pdf" target="_blank"><Download />{dictionary.shell.openResume}</a>
        </aside>
      </div>
      <pre className="contact-http" dir="ltr" aria-label="Contact request example"><code><span className="syntax-keyword">POST</span> /conversation HTTP/1.1{"\n"}<span className="syntax-name">Host:</span> {siteUrl.host}{"\n"}<span className="syntax-name">Accept:</span> thoughtful-work{"\n"}<span className="syntax-name">Location:</span> Tehran</code></pre>
    </article>
  );
}

export function ArticleDetail({ dictionary, locale, article }: { dictionary: Dictionary; locale: Locale; article: Article }) {
  const articleDirection = hasLocale(article.language) ? localeDetails[article.language].direction : "ltr";
  return (
    <article className="portfolio-document longform-document" lang={article.language} dir={articleDirection}>
      <header className="article-header">
        <nav className="content-breadcrumb" aria-label="Breadcrumb">
          <Link href={pagePath(locale, "overview")}>{dictionary.nav.overview}</Link>
          <span aria-hidden="true">/</span>
          <Link href={pagePath(locale, "articles")}>{dictionary.nav.articles}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{article.title}</span>
        </nav>
        <div className="article-meta"><span className="case-study">{dictionary.common.caseStudy}</span>{article.publishedAt && <span><time dateTime={article.publishedAt}>{new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(new Date(article.publishedAt))}</time></span>}{article.readingMinutes && <span>{article.readingMinutes} {dictionary.common.readTime}</span>}</div>
        <h1>{article.title}</h1><p>{article.excerpt}</p>
        <div className="article-meta article-byline">
          <Link href={pagePath(locale, "about")} rel="author" className="text-link">Naser Rouhi</Link>
          <span>.NET Software Engineer</span>
        </div>
      </header>
      {article.sections?.map((section, index) => <section key={section.heading} className="article-section"><span className="line-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><div><h2>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></section>)}
    </article>
  );
}
