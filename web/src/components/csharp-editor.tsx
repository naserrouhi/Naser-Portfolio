"use client";

import { useEffect, useRef, useState } from "react";
import type * as Monaco from "monaco-editor";

import { VisualStudioCSharpFileIcon } from "@/components/visual-studio-icons";
import { configureCSharpIntelliSense } from "@/lib/csharp-intellisense";

type MonacoApi = typeof import("monaco-editor");

type MonacoEnvironment = {
  getWorker: (_moduleId: string, _label: string) => Worker;
};

export function CSharpEditor({
  content,
  fileName,
  onChange,
}: {
  content: string;
  fileName: string;
  onChange: (content: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const onChangeRef = useRef(onChange);
  const contentRef = useRef(content);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    contentRef.current = content;
    const model = editorRef.current?.getModel();
    if (model && model.getValue() !== content) model.setValue(content);
  }, [content]);

  useEffect(() => {
    let cancelled = false;
    let editor: Monaco.editor.IStandaloneCodeEditor | null = null;
    let model: Monaco.editor.ITextModel | null = null;
    let languageFeatures: Monaco.IDisposable | null = null;
    let contentSubscription: Monaco.IDisposable | null = null;
    let themeObserver: MutationObserver | null = null;

    async function initializeEditor() {
      const container = containerRef.current;
      if (!container) return;

      const workerEnvironment = globalThis as typeof globalThis & { MonacoEnvironment?: MonacoEnvironment };
      workerEnvironment.MonacoEnvironment = {
        getWorker: () => new Worker(
          new URL("monaco-editor/editor/editor.worker.js", import.meta.url),
          { name: "monaco-editor-worker", type: "module" },
        ),
      };

      const monaco: MonacoApi = await import("monaco-editor");
      if (cancelled || !containerRef.current) return;

      languageFeatures = configureCSharpIntelliSense(monaco);
      const isDarkTheme = () => document.documentElement.classList.contains("dark");
      const setTheme = () => monaco.editor.setTheme(isDarkTheme() ? "naser-vs-dark" : "naser-vs-light");
      setTheme();

      const modelUri = monaco.Uri.parse(`inmemory://naser-portfolio/${encodeURIComponent(fileName)}`);
      monaco.editor.getModel(modelUri)?.dispose();
      model = monaco.editor.createModel(contentRef.current, "csharp", modelUri);
      editor = monaco.editor.create(containerRef.current, {
        model,
        theme: isDarkTheme() ? "naser-vs-dark" : "naser-vs-light",
        ariaLabel: `Edit ${fileName}`,
        automaticLayout: true,
        bracketPairColorization: { enabled: true, independentColorPoolPerBracketType: true },
        cursorBlinking: "smooth",
        cursorSmoothCaretAnimation: "on",
        fixedOverflowWidgets: true,
        folding: true,
        fontFamily: '"Cascadia Code", "Noto Sans Mono", Consolas, monospace',
        fontLigatures: true,
        fontSize: 13,
        formatOnPaste: true,
        glyphMargin: true,
        guides: { bracketPairs: true, indentation: true },
        lineHeight: 22,
        lineNumbersMinChars: 3,
        matchBrackets: "always",
        minimap: { enabled: true, maxColumn: 80, renderCharacters: false, showSlider: "mouseover" },
        padding: { top: 16, bottom: 16 },
        parameterHints: { enabled: true, cycle: true },
        quickSuggestions: { comments: false, other: true, strings: false },
        renderLineHighlight: "all",
        roundedSelection: false,
        scrollBeyondLastLine: false,
        snippetSuggestions: "top",
        suggest: { preview: true, showInlineDetails: true, showStatusBar: true },
        suggestOnTriggerCharacters: true,
        tabCompletion: "on",
      });
      editor.updateOptions({ "semanticHighlighting.enabled": true });
      editorRef.current = editor;

      contentSubscription = editor.onDidChangeModelContent(() => {
        const nextContent = editor?.getValue() ?? "";
        if (nextContent === contentRef.current) return;
        contentRef.current = nextContent;
        onChangeRef.current(nextContent);
      });

      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Space, () => {
        editor?.trigger("keyboard", "editor.action.triggerSuggest", {});
      });

      themeObserver = new MutationObserver(setTheme);
      themeObserver.observe(document.documentElement, { attributeFilter: ["class"], attributes: true });
      setReady(true);
      editor.focus();
    }

    void initializeEditor();

    return () => {
      cancelled = true;
      setReady(false);
      themeObserver?.disconnect();
      contentSubscription?.dispose();
      languageFeatures?.dispose();
      editor?.dispose();
      model?.dispose();
      editorRef.current = null;
    };
  }, [fileName]);

  return (
    <section
      className="csharp-editor"
      aria-label={`C# editor for ${fileName}`}
      data-editor-ready={ready}
      data-editor-value={content}
    >
      <div className="csharp-editor-navigation">
        <VisualStudioCSharpFileIcon />
        <span>NaserPortfolio</span>
        <span aria-hidden="true">›</span>
        <strong>{fileName.replace(/\.cs$/, "")}</strong>
        <span className="csharp-intellisense-state">
          <i aria-hidden="true" />
          IntelliSense
          <kbd>Ctrl+Space</kbd>
        </span>
      </div>
      <div className="csharp-editor-surface">
        {!ready && <div className="csharp-editor-loading" role="status">Loading C# IntelliSense…</div>}
        <div ref={containerRef} className="csharp-monaco-host" />
      </div>
    </section>
  );
}
