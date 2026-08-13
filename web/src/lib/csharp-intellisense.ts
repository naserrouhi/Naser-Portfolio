import type * as Monaco from "monaco-editor";

type MonacoApi = typeof import("monaco-editor");

type CompletionSeed = {
  detail: string;
  documentation: string;
  insertText: string;
  kind: "class" | "keyword" | "method" | "property" | "snippet";
  label: string;
  sortText: string;
};

const completions: readonly CompletionSeed[] = [
  { label: "class", kind: "snippet", detail: "C# class declaration", documentation: "Creates a public C# class.", insertText: "public class ${1:ClassName}\n{\n    $0\n}", sortText: "00-class" },
  { label: "record", kind: "snippet", detail: "C# record declaration", documentation: "Creates an immutable record type.", insertText: "public sealed record ${1:RecordName}(${2});", sortText: "00-record" },
  { label: "interface", kind: "snippet", detail: "C# interface declaration", documentation: "Creates a public interface.", insertText: "public interface ${1:IService}\n{\n    $0\n}", sortText: "00-interface" },
  { label: "ctor", kind: "snippet", detail: "Constructor", documentation: "Creates a constructor for the current class.", insertText: "public ${1:ClassName}(${2})\n{\n    $0\n}", sortText: "00-ctor" },
  { label: "prop", kind: "snippet", detail: "Auto-implemented property", documentation: "Creates a public get/set property.", insertText: "public ${1:string} ${2:PropertyName} { get; set; }", sortText: "00-prop" },
  { label: "propg", kind: "snippet", detail: "Get-only property", documentation: "Creates a public get-only property.", insertText: "public ${1:string} ${2:PropertyName} { get; }", sortText: "00-propg" },
  { label: "method", kind: "snippet", detail: "Method declaration", documentation: "Creates a public method.", insertText: "public ${1:void} ${2:MethodName}(${3})\n{\n    $0\n}", sortText: "00-method" },
  { label: "async", kind: "snippet", detail: "Async method", documentation: "Creates an asynchronous Task-returning method.", insertText: "public async Task<${1:Result}> ${2:MethodName}Async(${3})\n{\n    $0\n}", sortText: "00-async" },
  { label: "cw", kind: "snippet", detail: "Console.WriteLine", documentation: "Writes a value followed by the current line terminator.", insertText: "Console.WriteLine(${1:value});", sortText: "00-cw" },
  { label: "if", kind: "snippet", detail: "if statement", documentation: "Creates an if statement.", insertText: "if (${1:condition})\n{\n    $0\n}", sortText: "01-if" },
  { label: "foreach", kind: "snippet", detail: "foreach statement", documentation: "Enumerates a collection.", insertText: "foreach (var ${1:item} in ${2:items})\n{\n    $0\n}", sortText: "01-foreach" },
  { label: "namespace", kind: "keyword", detail: "C# keyword", documentation: "Declares a namespace.", insertText: "namespace ", sortText: "10-namespace" },
  { label: "public", kind: "keyword", detail: "C# access modifier", documentation: "Public accessibility.", insertText: "public", sortText: "10-public" },
  { label: "private", kind: "keyword", detail: "C# access modifier", documentation: "Private accessibility.", insertText: "private", sortText: "10-private" },
  { label: "protected", kind: "keyword", detail: "C# access modifier", documentation: "Protected accessibility.", insertText: "protected", sortText: "10-protected" },
  { label: "internal", kind: "keyword", detail: "C# access modifier", documentation: "Internal accessibility.", insertText: "internal", sortText: "10-internal" },
  { label: "sealed", kind: "keyword", detail: "C# modifier", documentation: "Prevents inheritance or further overriding.", insertText: "sealed", sortText: "10-sealed" },
  { label: "static", kind: "keyword", detail: "C# modifier", documentation: "Declares a member that belongs to the type.", insertText: "static", sortText: "10-static" },
  { label: "readonly", kind: "keyword", detail: "C# modifier", documentation: "Restricts assignment after initialization.", insertText: "readonly", sortText: "10-readonly" },
  { label: "string", kind: "class", detail: "System.String", documentation: "Represents text as a sequence of UTF-16 code units.", insertText: "string", sortText: "20-string" },
  { label: "int", kind: "class", detail: "System.Int32", documentation: "Represents a 32-bit signed integer.", insertText: "int", sortText: "20-int" },
  { label: "bool", kind: "class", detail: "System.Boolean", documentation: "Represents a Boolean value.", insertText: "bool", sortText: "20-bool" },
  { label: "DateTime", kind: "class", detail: "System.DateTime", documentation: "Represents an instant in time.", insertText: "DateTime", sortText: "20-datetime" },
  { label: "Guid", kind: "class", detail: "System.Guid", documentation: "Represents a globally unique identifier.", insertText: "Guid", sortText: "20-guid" },
  { label: "List", kind: "class", detail: "System.Collections.Generic.List<T>", documentation: "Represents a strongly typed list of objects.", insertText: "List<${1:T}>", sortText: "20-list" },
  { label: "Task", kind: "class", detail: "System.Threading.Tasks.Task", documentation: "Represents an asynchronous operation.", insertText: "Task", sortText: "20-task" },
  { label: "CancellationToken", kind: "class", detail: "System.Threading.CancellationToken", documentation: "Propagates notification that operations should be canceled.", insertText: "CancellationToken", sortText: "20-token" },
] as const;

const consoleMembers: readonly CompletionSeed[] = [
  { label: "WriteLine", kind: "method", detail: "void Console.WriteLine(object? value)", documentation: "Writes a value followed by the current line terminator.", insertText: "WriteLine(${1:value})", sortText: "00-writeline" },
  { label: "Write", kind: "method", detail: "void Console.Write(object? value)", documentation: "Writes a value to the standard output stream.", insertText: "Write(${1:value})", sortText: "01-write" },
  { label: "ReadLine", kind: "method", detail: "string? Console.ReadLine()", documentation: "Reads the next line from the standard input stream.", insertText: "ReadLine()", sortText: "02-readline" },
  { label: "Error", kind: "property", detail: "TextWriter Console.Error", documentation: "Gets the standard error output stream.", insertText: "Error", sortText: "03-error" },
  { label: "Out", kind: "property", detail: "TextWriter Console.Out", documentation: "Gets the standard output stream.", insertText: "Out", sortText: "03-out" },
] as const;

function completionKind(monaco: MonacoApi, kind: CompletionSeed["kind"]) {
  switch (kind) {
    case "class": return monaco.languages.CompletionItemKind.Class;
    case "keyword": return monaco.languages.CompletionItemKind.Keyword;
    case "method": return monaco.languages.CompletionItemKind.Method;
    case "property": return monaco.languages.CompletionItemKind.Property;
    case "snippet": return monaco.languages.CompletionItemKind.Snippet;
  }
}

function toCompletionItem(
  monaco: MonacoApi,
  seed: CompletionSeed,
  range: Monaco.IRange,
): Monaco.languages.CompletionItem {
  return {
    label: seed.label,
    kind: completionKind(monaco, seed.kind),
    detail: seed.detail,
    documentation: { value: seed.documentation },
    insertText: seed.insertText,
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    range,
    sortText: seed.sortText,
  };
}

function provideSemanticTokens(model: Monaco.editor.ITextModel) {
  const encoded: number[] = [];
  let previousLine = 0;
  let previousStart = 0;

  for (let lineIndex = 0; lineIndex < model.getLineCount(); lineIndex += 1) {
    const line = model.getLineContent(lineIndex + 1);
    const matches = Array.from(line.matchAll(/\b[A-Z][A-Za-z0-9_]*\b/g));

    for (const match of matches) {
      const start = match.index ?? 0;
      const remainder = line.slice(start + match[0].length);
      const tokenType = /^\s*\(/.test(remainder) ? 1 : 0;
      const deltaLine = lineIndex - previousLine;
      const deltaStart = deltaLine === 0 ? start - previousStart : start;
      encoded.push(deltaLine, deltaStart, match[0].length, tokenType, 0);
      previousLine = lineIndex;
      previousStart = start;
    }
  }

  return new Uint32Array(encoded);
}

export function configureCSharpIntelliSense(monaco: MonacoApi): Monaco.IDisposable {
  monaco.editor.defineTheme("naser-vs-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "keyword", foreground: "569CD6" },
      { token: "keyword.cs", foreground: "569CD6" },
      { token: "namespace", foreground: "4EC9B0" },
      { token: "class", foreground: "4EC9B0" },
      { token: "method", foreground: "DCDCAA" },
      { token: "comment", foreground: "6A9955" },
      { token: "string", foreground: "CE9178" },
      { token: "string.escape", foreground: "D7BA7D" },
      { token: "number", foreground: "B5CEA8" },
    ],
    colors: {
      "editor.background": "#1E1E1E",
      "editor.foreground": "#D4D4D4",
      "editor.lineHighlightBackground": "#2A2D2E",
      "editor.lineHighlightBorder": "#00000000",
      "editorCursor.foreground": "#AEAFAD",
      "editorLineNumber.foreground": "#858585",
      "editorLineNumber.activeForeground": "#C6C6C6",
      "editor.selectionBackground": "#264F78",
      "editor.inactiveSelectionBackground": "#3A3D41",
      "editorIndentGuide.background1": "#404040",
      "editorIndentGuide.activeBackground1": "#707070",
      "editorSuggestWidget.background": "#252526",
      "editorSuggestWidget.border": "#8B5CF6",
      "editorSuggestWidget.foreground": "#D4D4D4",
      "editorSuggestWidget.selectedBackground": "#094771",
      "editorWidget.border": "#8B5CF6",
    },
  });

  monaco.editor.defineTheme("naser-vs-light", {
    base: "vs",
    inherit: true,
    rules: [
      { token: "keyword", foreground: "0000FF" },
      { token: "keyword.cs", foreground: "0000FF" },
      { token: "namespace", foreground: "267F99" },
      { token: "class", foreground: "267F99" },
      { token: "method", foreground: "795E26" },
      { token: "comment", foreground: "008000" },
      { token: "string", foreground: "A31515" },
      { token: "number", foreground: "098658" },
    ],
    colors: {
      "editor.background": "#FFFFFF",
      "editor.lineHighlightBackground": "#F3F3F3",
      "editorSuggestWidget.border": "#7C3AED",
      "editorWidget.border": "#7C3AED",
    },
  });

  const completionProvider = monaco.languages.registerCompletionItemProvider("csharp", {
    triggerCharacters: ["."],
    provideCompletionItems(model, position) {
      const word = model.getWordUntilPosition(position);
      const range = new monaco.Range(
        position.lineNumber,
        word.startColumn,
        position.lineNumber,
        word.endColumn,
      );
      const lineBeforeCursor = model.getValueInRange(new monaco.Range(
        position.lineNumber,
        1,
        position.lineNumber,
        position.column,
      ));
      const seeds = /\bConsole\.\w*$/.test(lineBeforeCursor) ? consoleMembers : completions;
      return { suggestions: seeds.map((seed) => toCompletionItem(monaco, seed, range)) };
    },
  });

  const signatureProvider = monaco.languages.registerSignatureHelpProvider("csharp", {
    signatureHelpTriggerCharacters: ["(", ","],
    provideSignatureHelp(model, position) {
      const beforeCursor = model.getValueInRange(new monaco.Range(1, 1, position.lineNumber, position.column));
      if (!/\bConsole\.(Write|WriteLine)\s*\([^)]*$/.test(beforeCursor)) return null;
      return {
        value: {
          signatures: [{
            label: "void Console.WriteLine(object? value)",
            documentation: "Writes a value followed by the current line terminator.",
            parameters: [{ label: "value", documentation: "The value to write." }],
          }],
          activeSignature: 0,
          activeParameter: 0,
        },
        dispose() {},
      };
    },
  });

  const semanticProvider = monaco.languages.registerDocumentSemanticTokensProvider("csharp", {
    getLegend: () => ({ tokenTypes: ["class", "method"], tokenModifiers: [] }),
    provideDocumentSemanticTokens: (model) => ({ data: provideSemanticTokens(model) }),
    releaseDocumentSemanticTokens() {},
  });

  return {
    dispose() {
      completionProvider.dispose();
      signatureProvider.dispose();
      semanticProvider.dispose();
    },
  };
}
