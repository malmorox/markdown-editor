import Editor from "@monaco-editor/react";

type MonacoTheme = "vs-dark" | "light" | "hc-black";


interface MarkdownEditorProps {
    value: string;
    onChange: (v: string) => void;
    theme: MonacoTheme;
}

export default function MarkdownEditor({
    value,
    onChange,
    theme
}: MarkdownEditorProps) {
    return (
        <div className="w-full h-[500px]">
            <Editor
                height="100%"
                defaultLanguage="markdown"
                theme={theme}
                value={value}
                onChange={(v) => onChange(v ?? "")}
                options={{
                    wordWrap: "on",
                    minimap: { enabled: false },
                    fontSize: 14,
                }}
            />
        </div>
    );
}