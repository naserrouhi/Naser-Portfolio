"use client";

import Link from "next/link";
import { CircleCheck, FileText, MoreHorizontal, Pin, Terminal, X } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";

import type { Dictionary } from "@/i18n/dictionaries";
import { articleContentLocale } from "@/lib/article-routes";
import type { PortfolioOverview } from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";

export type OutputMode = "output" | "timeline" | "articles";

type OutputTypewriterStyle = CSSProperties & {
  "--output-character-count": number;
  "--output-write-delay": string;
  "--output-write-duration": string;
};

function OutputTypewriter({
  children,
  lineIndex,
  text,
  variant,
}: {
  children: ReactNode;
  lineIndex: number;
  text: string;
  variant: "article" | "log" | "timeline";
}) {
  const characterCount = Math.max(1, Array.from(text).length);
  const style: OutputTypewriterStyle = {
    "--output-character-count": Math.min(characterCount, 90),
    "--output-write-delay": `${55 + lineIndex * 115}ms`,
    "--output-write-duration": `${Math.min(900, Math.max(360, characterCount * 14))}ms`,
  };

  return (
    <span className={`output-typewriter output-typewriter-${variant}`} dir="ltr" style={style}>
      <span className="output-typewriter-ink">{children}</span>
    </span>
  );
}

export function OutputPanel({
  dictionary,
  portfolio,
  mode,
  onModeChange,
  announcement,
  onClose,
  onTogglePin,
  pinned,
}: {
  dictionary: Dictionary;
  portfolio: PortfolioOverview;
  mode: OutputMode;
  onModeChange: (mode: OutputMode) => void;
  announcement: string;
  onClose?: () => void;
  onTogglePin?: () => void;
  pinned?: boolean;
}) {
  const title = mode === "timeline"
    ? dictionary.shell.timeline
    : mode === "articles"
      ? dictionary.nav.articles
      : dictionary.shell.output;

  return (
    <section className="output-panel" aria-label={title}>
      <div className="panel-heading output-heading">
        <span>{title}</span>
        <div className="panel-window-controls">
          <button type="button" aria-label="Output options"><MoreHorizontal /></button>
          {onTogglePin && (
            <button type="button" aria-label={pinned ? "Unpin Output" : "Pin Output"} aria-pressed={pinned} onClick={onTogglePin}>
              <Pin className={cn(pinned && "is-pinned")} />
            </button>
          )}
          {onClose && <button type="button" aria-label={`Close ${title}`} onClick={onClose}><X /></button>}
        </div>
      </div>
      <div className="output-content">
        {mode === "output" && (
          <div className="output-log" role="log" aria-live="polite">
            <p>
              <OutputTypewriter lineIndex={0} text={`12:00:00 [portfolio] ${dictionary.shell.ready}.`} variant="log">
                <span className="log-time">12:00:00</span>
                <CircleCheck aria-hidden="true" className="log-success" />
                <span className="log-channel">[portfolio]</span>
                <span className="log-message" dir="auto">{dictionary.shell.ready}.</span>
              </OutputTypewriter>
            </p>
            <p>
              <OutputTypewriter
                lineIndex={1}
                text={`12:00:01 [profile] ${portfolio.profile.headline} · ${portfolio.profile.yearsOfExperience} ${dictionary.content.years}.`}
                variant="log"
              >
                <span className="log-time">12:00:01</span>
                <Terminal aria-hidden="true" />
                <span className="log-channel">[profile]</span>
                <span className="log-message" dir="auto">{portfolio.profile.headline} · {portfolio.profile.yearsOfExperience} {dictionary.content.years}.</span>
              </OutputTypewriter>
            </p>
            <p>
              <OutputTypewriter lineIndex={2} text="12:00:02 [build] .NET · C# · DDD · Clean Architecture · TDD." variant="log">
                <span className="log-time">12:00:02</span>
                <CircleCheck aria-hidden="true" className="log-success" />
                <span className="log-channel">[build]</span>
                <span className="log-message" dir="auto">.NET · C# · DDD · Clean Architecture · TDD.</span>
              </OutputTypewriter>
            </p>
            {announcement && (
              <p key={announcement} className="log-announcement">
                <OutputTypewriter lineIndex={0} text={`[command] ${announcement}`} variant="log">
                  <span className="log-channel">[command]</span>
                  <span className="log-message" dir="auto">{announcement}</span>
                </OutputTypewriter>
              </p>
            )}
          </div>
        )}
        {mode === "timeline" && (
          <ol className="output-timeline">
            {portfolio.experience.map((item, index) => (
              <li key={`${item.company}-${item.start}`}>
                <OutputTypewriter
                  lineIndex={index}
                  text={`${item.start.slice(0, 4)} ${item.role} ${item.company}`}
                  variant="timeline"
                >
                  <span>{item.start.slice(0, 4)}</span>
                  <strong>{item.role}</strong>
                  <span>{item.company}</span>
                </OutputTypewriter>
              </li>
            ))}
          </ol>
        )}
        {mode === "articles" && (
          <ul className="output-articles">
            {portfolio.articles.map((article, index) => (
              <li key={article.slug}>
                <OutputTypewriter
                  lineIndex={index}
                  text={`${article.title} ${article.status === "case-study" ? dictionary.common.caseStudy : dictionary.common.planned}`}
                  variant="article"
                >
                  <FileText aria-hidden="true" />
                  {article.status === "case-study" ? (
                    <Link href={`/${articleContentLocale(article.language)}/articles/${article.slug}`}>{article.title}</Link>
                  ) : <span>{article.title}</span>}
                  <small>{article.status === "case-study" ? dictionary.common.caseStudy : dictionary.common.planned}</small>
                </OutputTypewriter>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="output-tabs" role="tablist" aria-label={dictionary.shell.output}>
        {([
          ["output", dictionary.shell.output],
          ["timeline", dictionary.shell.timeline],
          ["articles", dictionary.nav.articles],
        ] as const).map(([value, label]) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={mode === value}
            className={cn(mode === value && "is-active")}
            onClick={() => onModeChange(value)}
          >
            {label}
          </button>
        ))}
      </div>
    </section>
  );
}
