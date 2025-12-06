import Editor from "@monaco-editor/react";
import { useMarkdown } from "../hooks/useMarkdown";
import { useTheme } from "../hooks/useTheme";

export default function MarkdownEditor() {
    const { markdown, setMarkdown } = useMarkdown();
    const { theme } = useTheme();

    return (
        <div className="w-full h-full">
            <Editor
                height="100%"
                defaultLanguage="markdown"
                theme={theme}
                value={markdown}
                onChange={(v) => setMarkdown(v ?? "")}
                options={{
                    lineNumbers: "on",
                    wordWrap: "on",
                    minimap: { enabled: false },
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                    padding: {
                        top: 24,
                        bottom: 24
                    }
                }}
            />
        </div>
    );
}
