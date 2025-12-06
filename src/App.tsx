import ThemeSwitcher from "./components/ThemeSwitcher";
import MarkdownWorkspace from "./components/MarkdownWorkspace";
import "./App.css"

export default function App() {
    return (
        <div className="w-full min-h-screen flex flex-col">
            {/* Barra superior POR HACER */}
            <header className="p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-gray-900">
                        Markdown Editor
                    </h1>
                    <ThemeSwitcher />
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
