import { useEffect, useMemo } from "react";
import Editor, { type BeforeMount, type OnMount } from "@monaco-editor/react";
import { useMarkdown } from "@hooks/useMarkdown";
import { useTheme } from "@hooks/useTheme";
import { useEditor } from "@hooks/useEditor";
import { useSettings } from "@hooks/useSettings";
import { useScrollSync } from "@hooks/useScrollSync";
import { useActiveFile } from "@hooks/files/useActiveFile";
import { db } from "@/lib/db";
import { debounce } from "@utils/debounce";
import type { editor } from 'monaco-editor';
import { persistFileToDb } from "@utils/persistFile";

// Editor de Markdown con Monaco que sincroniza el contenido y aplica el tema seleccionado.
const MarkdownEditor = () => {
    const { markdown, setMarkdown } = useMarkdown();
    const { theme } = useTheme();
    const { setEditorInstance, loadFileModel, editorInstance } = useEditor();
    const { settings } = useSettings();
    const { setEditorScroll, onEditorScroll } = useScrollSync();
    const { activeFileId } = useActiveFile();

    const persistFile = useMemo(
        () => debounce(persistFileToDb, 400),
        []
    );

    const handleEditorWillMount: BeforeMount = (monaco) => {
        // tema oscuro personalizado con fondo más claro
        monaco.editor.defineTheme('customDark', {
            base: 'vs-dark',
            inherit: true,
            rules: [],
            colors: {
                'editor.background': '#2d2d30', // Fondo gris oscuro más claro
                'editor.lineHighlightBackground': '#3e3e42', // Línea actual
                'editorLineNumber.foreground': '#858585', // Números de línea
            }
        });
    };

    const handleEditorDidMount: OnMount = (editor, monaco) => {
        setEditorInstance(editor, monaco);

        let isSyncing = false;

        editor.onDidScrollChange((e) => {
            if (isSyncing || !settings.workspace.syncScroll) return
            const percentage = e.scrollTop / (editor.getScrollHeight() - editor.getLayoutInfo().height);
            setEditorScroll(percentage);
        });

        onEditorScroll((percentage) => {
            if (!settings.workspace.syncScroll) return;
            isSyncing = true;
            editor.setScrollTop(percentage * (editor.getScrollHeight() - editor.getLayoutInfo().height));
            setTimeout(() => isSyncing = false, 50);
        });

        editor.addCommand(monaco.KeyCode.Enter, () => {
            const model = editor.getModel();
            const position = editor.getPosition();
            if (!model || !position) return;

            const lineContent = model.getLineContent(position.lineNumber);

            const emptyList = lineContent.match(/^(\s*)(-\s+(\[[ x]\]\s*)?|\d+\.\s*)$/);
            if (emptyList) {
                const range = {
                    startLineNumber: position.lineNumber,
                    startColumn: 1,
                    endLineNumber: position.lineNumber,
                    endColumn: lineContent.length + 1,
                };
                editor.executeEdits('', [{ range, text: '' }]);
                return;
            }
            
            // Task list: - [ ] o - [x]
            const taskMatch = lineContent.match(/^(\s*)-\s+\[[ x]\]\s*(.*)$/);
            // Unordered list: - item
            const unorderedMatch = lineContent.match(/^(\s*)-\s+(.+)$/);
            // Ordered list: 1. item
            const orderedMatch = lineContent.match(/^(\s*)(\d+)\.\s+(.+)$/);

            let insertion = '\n';

            if (taskMatch) {
                insertion = '\n' + taskMatch[1] + '- [ ] ';
            } else if (unorderedMatch) {
                insertion = '\n' + unorderedMatch[1] + '- ';
            } else if (orderedMatch) {
                const nextNum = parseInt(orderedMatch[2]) + 1;
                insertion = '\n' + orderedMatch[1] + `${nextNum}. `;
            }

            editor.trigger('keyboard', 'type', { text: insertion });
        });
    };

    useEffect(() => {
        if (!activeFileId || !editorInstance) return;

        let cancelled = false;
        (async () => {
            const file = await db.files.get(activeFileId);
            if (cancelled) return;
            loadFileModel(activeFileId, file?.content ?? '');
            setMarkdown(file?.content ?? '');
        })();

        return () => { cancelled = true; };
    }, [activeFileId, editorInstance, loadFileModel, setMarkdown]);

    const editorOptions = useMemo((): editor.IStandaloneEditorConstructionOptions => ({
        lineNumbers: settings.editor.lineNumbers ? "on" : "off",
        wordWrap: settings.editor.wordWrap ? "on" : "off",
        minimap: { enabled: settings.editor.minimap },
        fontSize: 14,
        scrollBeyondLastLine: false,
        padding: { top: 24, bottom: 24 },
        automaticLayout: true
    }), [settings.editor]);

    return (
        <div className="w-full h-full">
            <Editor
                height="100%"
                defaultLanguage="markdown"
                theme={theme === 'vs-dark' ? 'customDark' : theme}
                defaultValue={markdown}
                onChange={(v) => {
                    setMarkdown(v ?? "");
                    if (activeFileId) persistFile(activeFileId, v ?? "");
                }}
                beforeMount={handleEditorWillMount}
                onMount={handleEditorDidMount}
                options={editorOptions}
            />
        </div>
    );
}

export default MarkdownEditor
