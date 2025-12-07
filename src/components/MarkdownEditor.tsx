import Editor from "@monaco-editor/react";
import { useMarkdown } from "@hooks/useMarkdown";
import { useTheme } from "@hooks/useTheme";
import { useEditor } from "@hooks/useEditor";
import type { editor } from 'monaco-editor';

// Editor de Markdown con Monaco que sincroniza el contenido y aplica el tema seleccionado.
const MarkdownEditor = () => {
    const { markdown, setMarkdown } = useMarkdown();
    const { theme } = useTheme();
    const { setEditorInstance } = useEditor();

    const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
        setEditorInstance(editor);
    };

    return (
        <div className="w-full h-full">
            <Editor
                height="100%"
                defaultLanguage="markdown"
                theme={theme}
                value={markdown}
                onChange={(v) => setMarkdown(v ?? "")}
                onMount={handleEditorDidMount}
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

export default MarkdownEditor
