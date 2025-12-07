import { createContext, useContext, useRef, useState } from "react";
import type { editor } from 'monaco-editor';

type EditorContextType = {
    editorInstance: editor.IStandaloneCodeEditor | null;
    setEditorInstance: (editor: editor.IStandaloneCodeEditor) => void;
    insertMarkdown: (text: string, offset?: number) => void;
};

export const EditorContext = createContext<EditorContextType | undefined>(undefined);

export function EditorProvider({ children }: { children: React.ReactNode }) {
    const [editorInstance, setEditorInstance] = useState<editor.IStandaloneCodeEditor | null>(null);

    const insertMarkdown = (text: string, cursorOffset: number = 0) => {
        if (!editorInstance) return;

        const selection = editorInstance.getSelection();
        if (!selection) return;

        const position = selection.getStartPosition();
        
        editorInstance.executeEdits('toolbar', [{
            range: selection,
            text: text,
            forceMoveMarkers: true
        }]);

        const lineNumber = position.lineNumber;
        const column = position.column + text.length + cursorOffset;
        
        editorInstance.setPosition({ lineNumber, column });
        editorInstance.focus();
    };

    return (
        <EditorContext.Provider value={{ editorInstance, setEditorInstance, insertMarkdown }}>
            {children}
        </EditorContext.Provider>
    );
}