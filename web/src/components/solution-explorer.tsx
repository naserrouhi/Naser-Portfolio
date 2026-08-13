"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  GitBranch,
  MoreHorizontal,
  Pin,
  Search,
  Settings2,
  X,
} from "lucide-react";

import {
  VisualStudioCSharpFileIcon,
  VisualStudioDockerfileIcon,
  VisualStudioFolderIcon,
  VisualStudioJsonFileIcon,
  VisualStudioProjectIcon,
  VisualStudioSolutionIcon,
} from "@/components/visual-studio-icons";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/lib/i18n";
import { pageFiles, pageKeys, pagePath, type PageKey } from "@/lib/navigation";
import { cn } from "@/lib/utils";

const sourceProjects: ReadonlyArray<{
  name: string;
  pages: readonly PageKey[];
}> = [
  { name: "NaserPortfolio.Api", pages: ["overview", "contact"] },
  { name: "NaserPortfolio.Application", pages: ["about", "experience", "skills"] },
  { name: "NaserPortfolio.Domain", pages: ["articles"] },
  { name: "NaserPortfolio.Infrastructure", pages: ["projects"] },
];

function TreeFile({
  page,
  locale,
  activePage,
  onNavigate,
  onOpenPage,
}: {
  page: PageKey;
  locale: Locale;
  activePage: PageKey;
  onNavigate?: () => void;
  onOpenPage?: (page: PageKey) => void;
}) {
  return (
    <li>
      <Link
        href={pagePath(locale, page)}
        onClick={() => { onOpenPage?.(page); onNavigate?.(); }}
        className={cn("tree-link tree-depth-4", page === activePage && "is-active")}
        aria-current={page === activePage ? "page" : undefined}
      >
        <VisualStudioCSharpFileIcon />
        <span>{pageFiles[page]}</span>
      </Link>
    </li>
  );
}

export function SolutionExplorer({
  dictionary,
  locale,
  activePage,
  onNavigate,
  onOpenPage,
  onClose,
  onTogglePin,
  pinned,
}: {
  dictionary: Dictionary;
  locale: Locale;
  activePage: PageKey;
  onNavigate?: () => void;
  onOpenPage?: (page: PageKey) => void;
  onClose?: () => void;
  onTogglePin?: () => void;
  pinned?: boolean;
}) {
  const [query, setQuery] = useState("");
  const visiblePages = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase(locale);
    if (!normalized) return pageKeys;
    return pageKeys.filter((page) =>
      `${dictionary.nav[page]} ${pageFiles[page]}`.toLocaleLowerCase(locale).includes(normalized),
    );
  }, [dictionary, locale, query]);

  return (
    <div className="explorer-panel">
      <div className="panel-heading">
        <span>{dictionary.shell.explorer}</span>
        <div className="panel-window-controls">
          <button type="button" aria-label="Explorer options"><MoreHorizontal /></button>
          {onTogglePin && (
            <button type="button" aria-label={pinned ? "Unpin Solution Explorer" : "Pin Solution Explorer"} aria-pressed={pinned} onClick={onTogglePin}>
              <Pin className={cn(pinned && "is-pinned")} />
            </button>
          )}
          {onClose && <button type="button" aria-label={`Close ${dictionary.shell.explorer}`} onClick={onClose}><X /></button>}
        </div>
      </div>

      <div className="solution-toolbar" aria-label="Solution Explorer commands">
        <button type="button" aria-label="Solution Explorer settings"><Settings2 /></button>
        <button type="button" aria-label="Refresh solution"><span className="refresh-glyph">↻</span></button>
        <button type="button" aria-label="Collapse all"><span className="collapse-glyph">⊟</span></button>
      </div>

      <label className="explorer-search">
        <Search className="size-3.5" aria-hidden="true" />
        <span className="sr-only">{dictionary.shell.filterExplorer}</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={`${dictionary.shell.filterExplorer} (Ctrl+;)`}
          type="search"
        />
      </label>

      <nav className="solution-tree" aria-label={dictionary.shell.explorer}>
        <details open>
          <summary className="solution-summary">
            <ChevronRight className="tree-chevron" aria-hidden="true" />
            <VisualStudioSolutionIcon />
            <span>Solution &apos;NaserPortfolio&apos; (4 of 4 projects)</span>
          </summary>
          <div className="tree-contents">
            <details open className="tree-depth-1">
              <summary><ChevronRight className="tree-chevron" /><VisualStudioFolderIcon /><span>src</span></summary>
              <div>
                {sourceProjects.map((project) => {
                  const projectPages = project.pages.filter((page) => visiblePages.includes(page));
                  if (query && projectPages.length === 0) return null;
                  return (
                    <details open key={project.name} className="tree-depth-2">
                      <summary><ChevronRight className="tree-chevron" /><VisualStudioProjectIcon /><strong>{project.name}</strong></summary>
                      <ul>
                        {projectPages.map((page) => <TreeFile key={page} page={page} locale={locale} activePage={activePage} onNavigate={onNavigate} onOpenPage={onOpenPage} />)}
                        {!query && project.name === "NaserPortfolio.Api" && (
                          <>
                            <li className="tree-static-row tree-depth-4"><VisualStudioJsonFileIcon /><span>appsettings.json</span></li>
                            <li className="tree-static-row tree-depth-4"><VisualStudioDockerfileIcon /><span>Dockerfile</span></li>
                            <li className="tree-static-row tree-depth-4"><VisualStudioCSharpFileIcon /><span>Program.cs</span></li>
                          </>
                        )}
                      </ul>
                    </details>
                  );
                })}
              </div>
            </details>

          </div>
        </details>
      </nav>

      <div className="tool-window-tabs">
        <button type="button" className="is-active">{dictionary.shell.explorer}</button>
        <button type="button"><GitBranch /> Git Changes</button>
      </div>
    </div>
  );
}
