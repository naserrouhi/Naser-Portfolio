"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Command,
  ContactRound,
  Download,
  ExternalLink,
  FileText,
  FolderTree,
  GitBranch,
  Languages,
  Menu,
  PanelBottom,
  PanelRight,
  Pin,
  Play,
  Plus,
  Printer,
  Search,
  X,
} from "lucide-react";
import { CSharpEditor } from "@/components/csharp-editor";
import { CommandPalette } from "@/components/command-palette";
import { OutputPanel, type OutputMode } from "@/components/output-panel";
import { SolutionExplorer } from "@/components/solution-explorer";
import { StartupSplash } from "@/components/startup-splash";
import { useTheme } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { VisualStudioCSharpFileIcon, VisualStudioLogo } from "@/components/visual-studio-icons";
import { Button } from "@/components/ui/button";
import { Dialog, DialogDescription, DialogTitle, SheetContent } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { Dictionary } from "@/i18n/dictionaries";
import { localeDetails, locales, replacePathLocale, type Locale } from "@/lib/i18n";
import { pageFiles, pageFromPath, pageKeys, pagePath, type PageKey } from "@/lib/navigation";
import type { PortfolioOverview } from "@/lib/portfolio-data";

type WorkbenchShellProps = {
  children: React.ReactNode;
  dictionary: Dictionary;
  locale: Locale;
  portfolio: PortfolioOverview;
};

type MenuItem = { label: string; icon?: React.ComponentType<{ className?: string }>; action: () => void };
type ActivePane = "editor" | "explorer" | "output";
type PageEditorTab = { id: string; kind: "page"; name: string; page: PageKey };
type ClassEditorTab = { content: string; id: string; kind: "class"; name: string };
type EditorTab = PageEditorTab | ClassEditorTab;

const explorerMinWidth = 240;
const explorerMaxWidth = 560;
const outputMinHeight = 120;
const outputMaxHeight = 420;

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

function pageEditorTab(page: PageKey): PageEditorTab {
  return { id: `page:${page}`, kind: "page", name: pageFiles[page], page };
}

function ChromeMenu({ label, items }: { label: string; items: readonly MenuItem[] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="chrome-menu-trigger">{label}</DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {items.map((item) => (
          <DropdownMenuItem key={item.label} onSelect={item.action}>
            {item.icon && <item.icon className="size-3.5" />}
            <span>{item.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function IconAction({ label, children, onClick }: { label: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button type="button" variant="ghost" size="icon" aria-label={label} onClick={onClick}>
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

export function WorkbenchShell({ children, dictionary, locale, portfolio }: WorkbenchShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const activePage = pageFromPath(pathname);
  const [explorerVisible, setExplorerVisible] = useState(true);
  const [outputVisible, setOutputVisible] = useState(true);
  const [commandOpen, setCommandOpen] = useState(false);
  const [mobileExplorerOpen, setMobileExplorerOpen] = useState(false);
  const [mobileOutputOpen, setMobileOutputOpen] = useState(false);
  const [outputMode, setOutputMode] = useState<OutputMode>("output");
  const [announcement, setAnnouncement] = useState("");
  const [activePane, setActivePane] = useState<ActivePane>("editor");
  const [explorerPinned, setExplorerPinned] = useState(true);
  const [outputPinned, setOutputPinned] = useState(true);
  const [explorerWidth, setExplorerWidth] = useState(330);
  const [outputHeight, setOutputHeight] = useState(190);
  const [editorTabs, setEditorTabs] = useState<EditorTab[]>(() =>
    [...new Set<PageKey>(["overview", activePage, "projects", "articles"])].map(pageEditorTab),
  );
  const [activeEditorTabId, setActiveEditorTabId] = useState<string | null>(`page:${activePage}`);
  const [pinnedTabs, setPinnedTabs] = useState<ReadonlySet<string>>(() => new Set(["page:overview"]));
  const newClassSequence = useRef(1);
  const suppressedRoutePage = useRef<PageKey | null>(null);

  const openPage = useCallback((page: PageKey) => {
    suppressedRoutePage.current = null;
    const nextTab = pageEditorTab(page);
    setEditorTabs((current) => current.some((tab) => tab.id === nextTab.id) ? current : [...current, nextTab]);
    setActiveEditorTabId(nextTab.id);
  }, []);

  const navigate = useCallback((path: string) => {
    openPage(pageFromPath(path));
    router.push(path);
    setMobileExplorerOpen(false);
    setMobileOutputOpen(false);
  }, [openPage, router]);

  const changeTheme = useCallback(() => {
    setTheme(resolvedTheme === "light" ? "dark" : "light");
    setAnnouncement(dictionary.shell.changeTheme);
  }, [dictionary.shell.changeTheme, resolvedTheme, setTheme]);

  const toggleExplorer = useCallback(() => {
    if (window.matchMedia("(max-width: 1023px)").matches) setMobileExplorerOpen(true);
    else setExplorerVisible((visible) => !visible);
  }, []);

  const toggleOutput = useCallback(() => {
    if (window.matchMedia("(max-width: 767px)").matches) setMobileOutputOpen(true);
    else setOutputVisible((visible) => !visible);
  }, []);

  const runTour = useCallback(() => {
    setOutputMode("output");
    setOutputVisible(true);
    setMobileOutputOpen(false);
    setAnnouncement(dictionary.content.tourStarted);
    navigate(pagePath(locale, "about"));
  }, [dictionary.content.tourStarted, locale, navigate]);

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      const commandKey = event.metaKey || event.ctrlKey;
      if (commandKey && !event.shiftKey && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen(true);
      }
      if (commandKey && event.shiftKey && event.key.toLowerCase() === "e") {
        event.preventDefault();
        toggleExplorer();
      }
      if (commandKey && event.key.toLowerCase() === "j") {
        event.preventDefault();
        toggleOutput();
      }
    }
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [toggleExplorer, toggleOutput]);

  useEffect(() => {
    const synchronizationFrame = window.requestAnimationFrame(() => {
      if (suppressedRoutePage.current === activePage) return;
      openPage(activePage);
    });
    return () => window.cancelAnimationFrame(synchronizationFrame);
  }, [activePage, openPage]);

  const activeEditorTab = useMemo(
    () => editorTabs.find((tab) => tab.id === activeEditorTabId) ?? null,
    [activeEditorTabId, editorTabs],
  );

  const createClassTab = useCallback(() => {
    const sequence = newClassSequence.current++;
    const className = `Class${sequence}`;
    const tab: ClassEditorTab = {
      id: `class:${sequence}`,
      kind: "class",
      name: `${className}.cs`,
      content: `namespace NaserPortfolio;\n\npublic class ${className}\n{\n}\n`,
    };
    setEditorTabs((current) => [...current, tab]);
    setActiveEditorTabId(tab.id);
  }, []);

  const updateClassTab = useCallback((id: string, content: string) => {
    setEditorTabs((current) => current.map((tab) =>
      tab.id === id && tab.kind === "class" ? { ...tab, content } : tab,
    ));
  }, []);

  const closeTab = useCallback((id: string) => {
    const closingIndex = editorTabs.findIndex((tab) => tab.id === id);
    if (closingIndex < 0) return;

    const remainingTabs = editorTabs.filter((tab) => tab.id !== id);
    setEditorTabs(remainingTabs);
    setPinnedTabs((current) => {
      const next = new Set(current);
      next.delete(id);
      return next;
    });

    if (activeEditorTabId !== id) return;
    const nextActive = remainingTabs[Math.min(closingIndex, remainingTabs.length - 1)] ?? null;
    suppressedRoutePage.current = activePage;
    setActiveEditorTabId(nextActive?.id ?? null);
    if (nextActive?.kind === "page") router.push(pagePath(locale, nextActive.page));
  }, [activeEditorTabId, activePage, editorTabs, locale, router]);

  const closeAllTabs = useCallback(() => {
    suppressedRoutePage.current = activePage;
    setEditorTabs([]);
    setActiveEditorTabId(null);
    setPinnedTabs(new Set());
  }, [activePage]);

  const closeTabWithMiddleButton = useCallback((event: React.MouseEvent<HTMLElement>, id: string) => {
    if (event.button !== 1) return;
    event.preventDefault();
    event.stopPropagation();
    closeTab(id);
  }, [closeTab]);

  const toggleTabPin = useCallback((id: string) => {
    setPinnedTabs((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const beginExplorerResize = useCallback((event: React.PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = explorerWidth;
    const directionMultiplier = document.documentElement.dir === "rtl" ? 1 : -1;
    const resize = (moveEvent: PointerEvent) => {
      setExplorerWidth(clamp(startWidth + (moveEvent.clientX - startX) * directionMultiplier, explorerMinWidth, explorerMaxWidth));
    };
    const finish = () => {
      window.removeEventListener("pointermove", resize);
      window.removeEventListener("pointerup", finish);
    };
    window.addEventListener("pointermove", resize);
    window.addEventListener("pointerup", finish, { once: true });
  }, [explorerWidth]);

  const beginOutputResize = useCallback((event: React.PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const startY = event.clientY;
    const startHeight = outputHeight;
    const resize = (moveEvent: PointerEvent) => {
      setOutputHeight(clamp(startHeight - (moveEvent.clientY - startY), outputMinHeight, outputMaxHeight));
    };
    const finish = () => {
      window.removeEventListener("pointermove", resize);
      window.removeEventListener("pointerup", finish);
    };
    window.addEventListener("pointermove", resize);
    window.addEventListener("pointerup", finish, { once: true });
  }, [outputHeight]);

  const pageMenuItems = pageKeys.map((page) => ({
    label: dictionary.nav[page],
    action: () => navigate(pagePath(locale, page)),
  }));

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(portfolio.profile.email);
      setAnnouncement(`${dictionary.shell.copyEmail}: ${portfolio.profile.email}`);
    } catch {
      window.location.href = `mailto:${portfolio.profile.email}`;
    }
  }

  function openExternal(url: string) {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function printResume() {
    const resumeWindow = window.open("/resume.pdf", "_blank");
    if (!resumeWindow) return;
    resumeWindow.addEventListener("load", () => resumeWindow.print(), { once: true });
  }

  function setLocale(nextLocale: Locale) {
    router.push(replacePathLocale(pathname, nextLocale));
  }

  const fileItems: MenuItem[] = [
    { label: "New C# Class", icon: Plus, action: createClassTab },
    { label: dictionary.shell.openResume, icon: FileText, action: () => openExternal("/resume.pdf") },
    { label: dictionary.shell.downloadResume, icon: Download, action: () => {
      const anchor = document.createElement("a");
      anchor.href = "/resume.pdf";
      anchor.download = "Naser-Rouhi-Resume.pdf";
      anchor.click();
    } },
    { label: dictionary.shell.print, icon: Printer, action: printResume },
    { label: dictionary.nav.contact, action: () => navigate(pagePath(locale, "contact")) },
  ];
  const editItems: MenuItem[] = [
    { label: dictionary.shell.copyEmail, action: () => void copyEmail() },
    { label: dictionary.shell.commandPalette, icon: Command, action: () => setCommandOpen(true) },
  ];
  const viewItems: MenuItem[] = [
    { label: dictionary.shell.toggleExplorer, icon: PanelRight, action: toggleExplorer },
    { label: dictionary.shell.toggleOutput, icon: PanelBottom, action: toggleOutput },
    { label: dictionary.shell.changeTheme, action: changeTheme },
  ];
  const windowItems: MenuItem[] = [
    ...viewItems,
    { label: "Close All Documents", icon: X, action: closeAllTabs },
  ];

  const explorer = (
    <SolutionExplorer
      dictionary={dictionary}
      locale={locale}
      activePage={activePage}
      onNavigate={() => setMobileExplorerOpen(false)}
      onOpenPage={openPage}
      onClose={() => { setExplorerVisible(false); setMobileExplorerOpen(false); }}
      onTogglePin={() => setExplorerPinned((value) => !value)}
      pinned={explorerPinned}
    />
  );

  const output = (
    <OutputPanel
      dictionary={dictionary}
      portfolio={portfolio}
      mode={outputMode}
      onModeChange={setOutputMode}
      announcement={announcement}
      onClose={() => { setOutputVisible(false); setMobileOutputOpen(false); }}
      onTogglePin={() => setOutputPinned((value) => !value)}
      pinned={outputPinned}
    />
  );

  return (
    <>
      <StartupSplash />
      <TooltipProvider delayDuration={450}>
        <a href="#portfolio-content" className="skip-link">{dictionary.content.skipToContent}</a>
        <div
        className={`workbench-shell startup-workbench ${explorerVisible ? "" : "explorer-collapsed"} ${outputVisible ? "" : "output-collapsed"}`}
        style={{
          "--explorer-width": `${explorerWidth}px`,
          "--output-height": `${outputHeight}px`,
        } as CSSProperties}
      >
        <header className="title-menubar desktop-chrome">
          <Link href={`/${locale}`} className="brand-mark" aria-label={`${portfolio.profile.name} — ${dictionary.nav.overview}`}>
            <VisualStudioLogo />
          </Link>
          <nav className="chrome-menus" aria-label={dictionary.shell.openMenu}>
            <ChromeMenu label={dictionary.shell.file} items={fileItems} />
            <ChromeMenu label={dictionary.shell.edit} items={editItems} />
            <ChromeMenu label={dictionary.shell.view} items={viewItems} />
            <ChromeMenu label={dictionary.shell.git} items={[{ label: "GitHub", icon: GitBranch, action: () => openExternal(portfolio.profile.github.url) }]} />
            <ChromeMenu label="Project" items={pageMenuItems} />
            <ChromeMenu label="Build" items={[{ label: "Build Solution", icon: Play, action: () => { setOutputMode("output"); setOutputVisible(true); setAnnouncement("Build succeeded: 0 errors, 0 warnings."); } }]} />
            <ChromeMenu label="Debug" items={[{ label: dictionary.shell.runTour, icon: Play, action: runTour }]} />
            <ChromeMenu label="Test" items={[{ label: "Run All Tests", action: () => navigate(pagePath(locale, "skills")) }]} />
            <ChromeMenu label={dictionary.shell.tools} items={[{ label: dictionary.shell.changeLanguage, icon: Languages, action: () => setCommandOpen(true) }, { label: dictionary.shell.changeTheme, action: changeTheme }, { label: dictionary.shell.commandPalette, icon: Command, action: () => setCommandOpen(true) }]} />
            <ChromeMenu label="Extensions" items={[{ label: dictionary.nav.articles, action: () => navigate(pagePath(locale, "articles")) }]} />
            <ChromeMenu label="Window" items={windowItems} />
            <ChromeMenu label={dictionary.shell.help} items={[{ label: "LinkedIn", icon: ContactRound, action: () => openExternal(portfolio.profile.linkedinUrl) }, { label: dictionary.shell.shortcuts, icon: Command, action: () => setCommandOpen(true) }]} />
          </nav>

          <button type="button" className="title-search" onClick={() => setCommandOpen(true)}>
            <Search aria-hidden="true" />
            <span>{dictionary.shell.search}</span>
            <kbd>Ctrl K</kbd>
          </button>

          <strong className="title-solution-name">NaserPortfolio</strong>

          <div className="title-actions">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label={dictionary.shell.changeLanguage}><Languages className="size-4" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{dictionary.shell.changeLanguage}</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={locale} onValueChange={(value) => setLocale(value as Locale)}>
                  {locales.map((item) => <DropdownMenuRadioItem key={item} value={item}>{localeDetails[item].label}</DropdownMenuRadioItem>)}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <ThemeToggle label={dictionary.shell.changeTheme} />
            <a href={portfolio.profile.github.url} target="_blank" rel="noreferrer" className="title-external" aria-label={`GitHub — ${dictionary.shell.externalLink}`}><GitBranch /></a>
          </div>
        </header>

        <div className="command-toolbar desktop-chrome" role="toolbar" aria-label="Portfolio commands">
          <IconAction label={dictionary.shell.back} onClick={() => window.history.back()}><ArrowLeft className="rtl:rotate-180" /></IconAction>
          <IconAction label={dictionary.shell.forward} onClick={() => window.history.forward()}><ArrowRight className="rtl:rotate-180" /></IconAction>
          <span className="toolbar-separator" />
          <IconAction label={dictionary.shell.toggleExplorer} onClick={toggleExplorer}><PanelRight /></IconAction>
          <IconAction label={dictionary.shell.toggleOutput} onClick={toggleOutput}><PanelBottom /></IconAction>
          <span className="toolbar-separator" />
          <button type="button" className="configuration-selector">Debug <ChevronDown /></button>
          <button type="button" className="configuration-selector">Any CPU <ChevronDown /></button>
          <DropdownMenu>
            <DropdownMenuTrigger className="project-selector">
              <VisualStudioCSharpFileIcon /><span>NaserPortfolio.Api</span><ChevronDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>{dictionary.common.professionalProjects}</DropdownMenuLabel>
              {portfolio.keyProjects.map((project) => (
                <DropdownMenuItem key={`resume-${project.slug}`} onSelect={() => navigate(`${pagePath(locale, "projects")}#${project.slug}`)}>
                  <VisualStudioCSharpFileIcon />{project.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel>{dictionary.common.githubRepositories}</DropdownMenuLabel>
              {portfolio.githubRepositories.map((project) => (
                <DropdownMenuItem key={`github-${project.slug}`} onSelect={() => navigate(`${pagePath(locale, "projects")}#${project.slug}`)}>
                  <VisualStudioCSharpFileIcon />{project.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button type="button" variant="ghost" size="sm" className="run-button" onClick={runTour}>
            <Play className="size-3.5 fill-current" />{dictionary.shell.runTour}
          </Button>
          <span className="toolbar-spacer" />
          <a className="toolbar-link" href={portfolio.profile.linkedinUrl} target="_blank" rel="noreferrer"><ContactRound />LinkedIn<ExternalLink /></a>
          <a className="toolbar-link" href={portfolio.profile.github.url} target="_blank" rel="noreferrer"><GitBranch />GitHub<ExternalLink /></a>
        </div>

        <header className="mobile-appbar">
          <Link href={`/${locale}`} className="brand-mark" aria-label={portfolio.profile.name}><VisualStudioLogo /></Link>
          <strong>{dictionary.shell.workbench}</strong>
          <button type="button" onClick={() => setCommandOpen(true)} aria-label={dictionary.shell.search}><Search /></button>
          <DropdownMenu>
            <DropdownMenuTrigger aria-label={dictionary.shell.openMenu}><Menu /></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {pageMenuItems.map((item) => <DropdownMenuItem key={item.label} onSelect={item.action}>{item.label}</DropdownMenuItem>)}
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={changeTheme}>{dictionary.shell.changeTheme}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <section className="document-workspace">
          <section
            className={`editor-pane pane-surface ${activePane === "editor" ? "is-pane-active" : ""}`}
            role="region"
            aria-label="Document editor"
            data-pane-active={activePane === "editor"}
            tabIndex={0}
            onFocusCapture={() => setActivePane("editor")}
            onPointerDownCapture={() => setActivePane("editor")}
          >
            <nav className="document-tabs" aria-label="Open portfolio documents">
            {editorTabs.map((tab) => (
              <div
                key={tab.id}
                className={`document-tab ${activeEditorTabId === tab.id ? "is-active" : ""}`}
                onMouseDown={(event) => {
                  if (event.button === 1) event.preventDefault();
                }}
                onAuxClick={(event) => closeTabWithMiddleButton(event, tab.id)}
              >
                {tab.kind === "page" ? (
                  <Link href={pagePath(locale, tab.page)} aria-current={activeEditorTabId === tab.id ? "page" : undefined} onClick={() => setActiveEditorTabId(tab.id)}>
                    <VisualStudioCSharpFileIcon /><span>{tab.name}</span>
                  </Link>
                ) : (
                  <button type="button" className="tab-document-trigger" onClick={() => setActiveEditorTabId(tab.id)}>
                    <VisualStudioCSharpFileIcon /><span>{tab.name}</span><i aria-label="Unsaved changes">●</i>
                  </button>
                )}
                <button type="button" className="tab-window-action" aria-label={pinnedTabs.has(tab.id) ? `Unpin ${tab.name}` : `Pin ${tab.name}`} aria-pressed={pinnedTabs.has(tab.id)} onClick={() => toggleTabPin(tab.id)}><Pin className={pinnedTabs.has(tab.id) ? "is-pinned" : ""} /></button>
                <button type="button" className="tab-window-action" aria-label={`Close ${tab.name}`} onClick={() => closeTab(tab.id)}><X /></button>
              </div>
            ))}
            <span className="document-tab-spacer" />
            <button type="button" className="document-strip-action" aria-label="New C# class" onClick={createClassTab}><Plus /></button>
            <button type="button" className="document-strip-action" aria-label="Close all tabs" disabled={editorTabs.length === 0} onClick={closeAllTabs}><X /></button>
            </nav>
            <div className="breadcrumb-bar" aria-label="Breadcrumb">
              {activeEditorTab ? (
                <><span>NaserPortfolio</span><ChevronDown className="-rotate-90 rtl:rotate-90" /><span>src</span><ChevronDown className="-rotate-90 rtl:rotate-90" /><span>{activeEditorTab.kind === "class" ? "NaserPortfolio" : "NaserPortfolio.Application"}</span><ChevronDown className="-rotate-90 rtl:rotate-90" /><VisualStudioCSharpFileIcon /><strong>{activeEditorTab.name}</strong></>
              ) : <span>No document is open</span>}
            </div>
            <main id="portfolio-content" className="document-scroll" tabIndex={-1}>
              {activeEditorTab?.kind === "class" ? (
                <CSharpEditor fileName={activeEditorTab.name} content={activeEditorTab.content} onChange={(content) => updateClassTab(activeEditorTab.id, content)} />
              ) : activeEditorTab?.kind === "page" ? (
                <div key={pathname} className="editor-document-motion">
                  {children}
                </div>
              ) : (
                <section className="empty-editor">
                  <VisualStudioLogo />
                  <h1>No files are open</h1>
                  <p>Open a portfolio class from Solution Explorer or create a new C# class.</p>
                  <button type="button" onClick={createClassTab}><Plus /> New C# Class</button>
                </section>
              )}
            </main>
          </section>
          <button type="button" className="horizontal-splitter" role="separator" aria-label="Resize Output" aria-orientation="horizontal" aria-valuemin={outputMinHeight} aria-valuemax={outputMaxHeight} aria-valuenow={outputHeight} onPointerDown={beginOutputResize} onDoubleClick={() => setOutputHeight(190)} onKeyDown={(event) => {
            if (event.key === "ArrowUp") setOutputHeight((value) => clamp(value + 16, outputMinHeight, outputMaxHeight));
            if (event.key === "ArrowDown") setOutputHeight((value) => clamp(value - 16, outputMinHeight, outputMaxHeight));
          }} />
          <div
            className={`desktop-output pane-surface ${activePane === "output" ? "is-pane-active" : ""}`}
            role="region"
            aria-label={dictionary.shell.output}
            data-pane-active={activePane === "output"}
            tabIndex={0}
            onFocusCapture={() => setActivePane("output")}
            onPointerDownCapture={() => setActivePane("output")}
          >
            {output}
          </div>
        </section>

        <button type="button" className="vertical-splitter" role="separator" aria-label="Resize Solution Explorer" aria-orientation="vertical" aria-valuemin={explorerMinWidth} aria-valuemax={explorerMaxWidth} aria-valuenow={explorerWidth} onPointerDown={beginExplorerResize} onDoubleClick={() => setExplorerWidth(330)} onKeyDown={(event) => {
          if (event.key === "ArrowLeft") setExplorerWidth((value) => clamp(value + 16, explorerMinWidth, explorerMaxWidth));
          if (event.key === "ArrowRight") setExplorerWidth((value) => clamp(value - 16, explorerMinWidth, explorerMaxWidth));
        }} />

        <aside
          className={`desktop-explorer pane-surface ${activePane === "explorer" ? "is-pane-active" : ""}`}
          aria-label={dictionary.shell.explorer}
          data-pane-active={activePane === "explorer"}
          tabIndex={0}
          onFocusCapture={() => setActivePane("explorer")}
          onPointerDownCapture={() => setActivePane("explorer")}
        >
          {explorer}
        </aside>

        <footer className="status-bar">
          <span key={announcement || "ready"} className={`status-ready ${announcement ? "has-feedback" : ""}`}><CheckCircle2 />{dictionary.shell.ready}</span>
          <span className="status-spacer" />
          <span>.NET · C#</span><span>{locale.toUpperCase()}</span><span>{resolvedTheme === "light" ? "Light" : "Dark"}</span><span>UTC+03:30</span>
        </footer>

        <nav className="mobile-dock" aria-label="Workbench panels">
          <button type="button" onClick={() => setMobileExplorerOpen(true)}><FolderTree /><span>{dictionary.shell.explorer}</span></button>
          <button type="button" onClick={() => setCommandOpen(true)}><Search /><span>{dictionary.shell.search}</span></button>
          <button type="button" onClick={() => setMobileOutputOpen(true)}><PanelBottom /><span>{dictionary.shell.output}</span></button>
          <ThemeToggle label={dictionary.shell.changeTheme} />
        </nav>
      </div>

      <Dialog open={mobileExplorerOpen} onOpenChange={setMobileExplorerOpen}>
        <SheetContent closeLabel={dictionary.shell.close}>
          <DialogTitle className="sr-only">{dictionary.shell.explorer}</DialogTitle>
          <DialogDescription className="sr-only">{dictionary.shell.explorer}</DialogDescription>
          {explorer}
        </SheetContent>
      </Dialog>
      <Dialog open={mobileOutputOpen} onOpenChange={setMobileOutputOpen}>
        <SheetContent side="bottom" closeLabel={dictionary.shell.close}>
          <DialogTitle className="sr-only">{dictionary.shell.output}</DialogTitle>
          <DialogDescription className="sr-only">{dictionary.shell.output}</DialogDescription>
          {output}
        </SheetContent>
      </Dialog>

      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} dictionary={dictionary} locale={locale} onNavigate={navigate} onTheme={changeTheme} onTour={runTour} />
        <p className="sr-only" aria-live="polite">{announcement}</p>
      </TooltipProvider>
    </>
  );
}
