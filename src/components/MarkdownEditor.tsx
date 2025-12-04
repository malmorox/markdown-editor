import { useState } from "react";
import Editor from "@monaco-editor/react";

export default function MarkdownEditor() {
    const [value, setValue] = useState<string>("## Escribe tu markdown aquí");

    return (
        <div className="w-full h-[500px]">
            <Editor
                height="100%"
                defaultLanguage="markdown"
                theme="vs-dark"
                value={value}
                onChange={(v) => setValue(v ?? "")}
                options={{
                    wordWrap: "on",
                    minimap: { enabled: false },
                    fontSize: 14,
                }}
            />
        </div>
    );
}