import Editor from "@monaco-editor/react";
import type { MonacoTheme } from "../types/monaco";

interface MarkdownEditorProps {
  value: string;
  onChange: (v: string) => void;
  theme: MonacoTheme;
}

export default function MarkdownEditor({
  value,
  onChange,
  theme,
}: MarkdownEditorProps) {
  return (
    <div className="w-full h-full">
      <Editor
        height="90vh"
        defaultLanguage="markdown"
        theme={theme}
        value={value}
        onChange={(v) => onChange(v ?? "")}
        options={{
            lineNumbers: "on",
            wordWrap: "on",
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
}
