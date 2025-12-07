import ThemeSwitcher from "@components/ThemeSwitcher";
import MarkdownWorkspace from "@components/MarkdownWorkspace";
import MarkdownToolbar from "@components/MarkdownToolbar";
import { useEditor } from "@hooks/useEditor";
import "./App.css"

export default function App() {
    const { insertMarkdown } = useEditor();

    return (
        <div className="w-full min-h-screen flex flex-col">
            {/* Barra superior POR HACER */}
            <header className="p-4">
                <div className="flex items-center justify-between">
                    <MarkdownToolbar onInsert={insertMarkdown} />
                    <div className="flex items-center justify-end mb-2">
                        <ThemeSwitcher />
                    </div>
                </div>
            </header>
            {/* Paneles */}
            <div className="w-full h-200 rounded-3xl border border-sky-400 bg-[#1e1e1e] overflow-hidden">
                {/* Espacio de trabajo */}
                <MarkdownWorkspace />
            </div>
        </div>
    );
}
