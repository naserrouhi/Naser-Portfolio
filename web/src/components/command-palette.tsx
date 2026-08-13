"use client";

import { useMemo, useState } from "react";
import {
  Box,
  Braces,
  FileCode2,
  Pin,
  PinOff,
  Search,
  WholeWord,
} from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import type { Dictionary } from "@/i18n/dictionaries";
import { localeDetails, locales, replacePathLocale, type Locale } from "@/lib/i18n";
import { pageFiles, pageKeys, pagePath } from "@/lib/navigation";

import styles from "./command-palette.module.scss";

type CommandPaletteProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dictionary: Dictionary;
  locale: Locale;
  onNavigate: (path: string) => void;
  onTheme: () => void;
  onTour: () => void;
};

type SearchScope = "all" | "files" | "types" | "members" | "text";
type ResultScope = Exclude<SearchScope, "all">;

type SearchResult = {
  id: string;
  label: string;
  context?: string;
  fileName: string;
  scope: ResultScope;
  keywords: string;
  run: () => void;
};

type SearchCopy = {
  title: string;
  all: string;
  files: string;
  types: string;
  members: string;
  text: string;
  pin: string;
  unpin: string;
  results: string;
  navigationHint: string;
};

const searchCopy: Record<Locale, SearchCopy> = {
  en: { title: "Code Search", all: "All", files: "Files", types: "Types", members: "Members", text: "Text", pin: "Pin search window", unpin: "Unpin search window", results: "results", navigationHint: "↑↓ Navigate   Enter Open   Esc Close" },
  fa: { title: "جست‌وجوی کد", all: "همه", files: "فایل‌ها", types: "نوع‌ها", members: "اعضا", text: "متن", pin: "سنجاق کردن پنجره جست‌وجو", unpin: "برداشتن سنجاق پنجره", results: "نتیجه", navigationHint: "↑↓ پیمایش   Enter باز کردن   Esc بستن" },
  de: { title: "Codesuche", all: "Alle", files: "Dateien", types: "Typen", members: "Member", text: "Text", pin: "Suchfenster anheften", unpin: "Suchfenster lösen", results: "Ergebnisse", navigationHint: "↑↓ Navigieren   Enter Öffnen   Esc Schließen" },
  fr: { title: "Recherche de code", all: "Tout", files: "Fichiers", types: "Types", members: "Membres", text: "Texte", pin: "Épingler la recherche", unpin: "Détacher la recherche", results: "résultats", navigationHint: "↑↓ Naviguer   Entrée Ouvrir   Échap Fermer" },
  nl: { title: "Code zoeken", all: "Alles", files: "Bestanden", types: "Typen", members: "Leden", text: "Tekst", pin: "Zoekvenster vastmaken", unpin: "Zoekvenster losmaken", results: "resultaten", navigationHint: "↑↓ Navigeren   Enter Openen   Esc Sluiten" },
  es: { title: "Búsqueda de código", all: "Todo", files: "Archivos", types: "Tipos", members: "Miembros", text: "Texto", pin: "Anclar búsqueda", unpin: "Desanclar búsqueda", results: "resultados", navigationHint: "↑↓ Navegar   Intro Abrir   Esc Cerrar" },
  ar: { title: "البحث في التعليمات البرمجية", all: "الكل", files: "الملفات", types: "الأنواع", members: "الأعضاء", text: "النص", pin: "تثبيت نافذة البحث", unpin: "إلغاء تثبيت النافذة", results: "نتيجة", navigationHint: "↑↓ تنقّل   Enter فتح   Esc إغلاق" },
  tr: { title: "Kod Arama", all: "Tümü", files: "Dosyalar", types: "Türler", members: "Üyeler", text: "Metin", pin: "Arama penceresini sabitle", unpin: "Arama penceresini ayır", results: "sonuç", navigationHint: "↑↓ Gezin   Enter Aç   Esc Kapat" },
};

const scopes: readonly SearchScope[] = ["all", "files", "types", "members", "text"];
const resultScopes: readonly ResultScope[] = ["files", "types", "members", "text"];

function ResultIcon({ scope }: { scope: ResultScope }) {
  if (scope === "files") {
    return (
      <span className={styles.csharpFileIcon} aria-hidden="true">
        <FileCode2 />
        <i>C#</i>
      </span>
    );
  }

  const Icon = scope === "types" ? Box : scope === "members" ? Braces : WholeWord;
  return <Icon className={styles.resultIcon} aria-hidden="true" />;
}

export function CommandPalette({
  open,
  onOpenChange,
  dictionary,
  locale,
  onNavigate,
  onTheme,
  onTour,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<SearchScope>("all");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [pinned, setPinned] = useState(false);
  const copy = searchCopy[locale];

  const results = useMemo<SearchResult[]>(() => {
    const files = pageKeys.map((page) => ({
      id: `file-${page}`,
      label: dictionary.nav[page],
      context: "NaserRouhi.Portfolio",
      fileName: pageFiles[page],
      scope: "files" as const,
      keywords: `${dictionary.pages[page].title} ${dictionary.pages[page].summary}`,
      run: () => onNavigate(pagePath(locale, page)),
    }));

    const types = pageKeys.map((page) => {
      const typeName = pageFiles[page].replace(/\.cs$/, "");
      return {
        id: `type-${page}`,
        label: `class ${typeName}`,
        context: "NaserRouhi.Portfolio.Presentation",
        fileName: pageFiles[page],
        scope: "types" as const,
        keywords: `${dictionary.nav[page]} ${dictionary.pages[page].title}`,
        run: () => onNavigate(pagePath(locale, page)),
      };
    });

    const members: SearchResult[] = [
      {
        id: "member-theme",
        label: "ChangeTheme()",
        context: dictionary.shell.changeTheme,
        fileName: "ThemeService.cs",
        scope: "members",
        keywords: `${dictionary.shell.changeTheme} dark light`,
        run: onTheme,
      },
      {
        id: "member-tour",
        label: "RunPortfolioTour()",
        context: dictionary.shell.runTour,
        fileName: "PortfolioTour.cs",
        scope: "members",
        keywords: dictionary.shell.runTour,
        run: onTour,
      },
      ...locales.map((nextLocale) => ({
        id: `member-locale-${nextLocale}`,
        label: `SetCulture(\"${localeDetails[nextLocale].label}\")`,
        context: dictionary.shell.changeLanguage,
        fileName: "Localization.cs",
        scope: "members" as const,
        keywords: `${localeDetails[nextLocale].label} ${nextLocale} ${dictionary.shell.changeLanguage}`,
        run: () => onNavigate(replacePathLocale(window.location.pathname, nextLocale)),
      })),
    ];

    const text = pageKeys.map((page) => ({
      id: `text-${page}`,
      label: dictionary.pages[page].title,
      context: dictionary.nav[page],
      fileName: pageFiles[page],
      scope: "text" as const,
      keywords: dictionary.pages[page].summary,
      run: () => onNavigate(pagePath(locale, page)),
    }));

    return [...files, ...types, ...members, ...text];
  }, [dictionary, locale, onNavigate, onTheme, onTour]);

  const normalizedQuery = query.trim().toLocaleLowerCase(locale);
  const filtered = results.filter((item) => {
    if (scope !== "all" && item.scope !== scope) return false;
    if (!normalizedQuery) return true;
    return `${item.label} ${item.context ?? ""} ${item.fileName} ${item.keywords}`
      .toLocaleLowerCase(locale)
      .includes(normalizedQuery);
  });
  const activeIndex = filtered.length === 0 ? -1 : Math.min(selectedIndex, filtered.length - 1);

  function closeAndReset(nextOpen: boolean) {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      setQuery("");
      setScope("all");
      setSelectedIndex(0);
    }
  }

  function execute(item: SearchResult) {
    item.run();
    if (!pinned) closeAndReset(false);
  }

  function selectScope(nextScope: SearchScope) {
    setScope(nextScope);
    setSelectedIndex(0);
  }

  function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" && filtered.length > 0) {
      event.preventDefault();
      setSelectedIndex((index) => (Math.min(index, filtered.length - 1) + 1) % filtered.length);
    } else if (event.key === "ArrowUp" && filtered.length > 0) {
      event.preventDefault();
      setSelectedIndex((index) => (Math.min(index, filtered.length - 1) - 1 + filtered.length) % filtered.length);
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      execute(filtered[activeIndex]);
    }
  }

  return (
    <Dialog open={open} onOpenChange={closeAndReset}>
      <DialogContent className={`${styles.dialog} p-0`} closeLabel={dictionary.shell.close}>
        <header className={styles.titleBar}>
          <DialogTitle className={styles.title}>{copy.title}</DialogTitle>
          <button
            type="button"
            className={styles.pinButton}
            aria-label={pinned ? copy.unpin : copy.pin}
            aria-pressed={pinned}
            title={pinned ? copy.unpin : copy.pin}
            onClick={() => setPinned((value) => !value)}
          >
            {pinned ? <PinOff aria-hidden="true" /> : <Pin aria-hidden="true" />}
          </button>
        </header>

        <DialogDescription className="sr-only">{dictionary.shell.searchPlaceholder}</DialogDescription>

        <div className={styles.searchArea}>
          <label className={styles.searchInput}>
            <Search aria-hidden="true" />
            <span className="sr-only">{dictionary.shell.search}</span>
            <input
              autoFocus
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleInputKeyDown}
              placeholder={dictionary.shell.searchPlaceholder}
              spellCheck={false}
              autoComplete="off"
            />
            <kbd>Ctrl+K</kbd>
          </label>

          <nav className={styles.filters} aria-label={copy.title}>
            {scopes.map((item) => {
              const Icon = item === "files" ? FileCode2 : item === "types" ? Box : item === "members" ? Braces : item === "text" ? WholeWord : Search;
              return (
                <button
                  key={item}
                  type="button"
                  className={scope === item ? styles.activeFilter : undefined}
                  aria-pressed={scope === item}
                  onClick={() => selectScope(item)}
                >
                  <Icon aria-hidden="true" />
                  <span>{copy[item]}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className={styles.results} aria-live="polite">
          {filtered.length === 0 ? (
            <p className={styles.empty}>{dictionary.content.noMatchingCommand}</p>
          ) : resultScopes.map((resultScope) => {
            const scopedResults = filtered.filter((item) => item.scope === resultScope);
            if (scopedResults.length === 0) return null;

            return (
              <section key={resultScope} className={styles.resultGroup} aria-labelledby={`code-search-${resultScope}`}>
                <h3 id={`code-search-${resultScope}`}>
                  <span>{copy[resultScope]}</span>
                  <small>{scopedResults.length}</small>
                </h3>
                {scopedResults.map((item) => {
                  const itemIndex = filtered.indexOf(item);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={itemIndex === activeIndex ? styles.selectedResult : undefined}
                      onMouseMove={() => setSelectedIndex(itemIndex)}
                      onFocus={() => setSelectedIndex(itemIndex)}
                      onClick={() => execute(item)}
                    >
                      <ResultIcon scope={item.scope} />
                      <span className={styles.resultText}>
                        <strong>{item.label}</strong>
                        {item.context && <small>{item.context}</small>}
                      </span>
                      <code>{item.fileName}</code>
                    </button>
                  );
                })}
              </section>
            );
          })}
        </div>

        <footer className={styles.statusBar}>
          <span>{filtered.length} {copy.results}</span>
          <span>{copy.navigationHint}</span>
        </footer>
      </DialogContent>
    </Dialog>
  );
}
