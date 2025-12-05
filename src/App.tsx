import { useState } from "react";
import MarkdownWorkspace from "./components/MarkdownWorkspace";
import type { MonacoTheme } from "./types/monaco";

export default function App() {
    const [markdown, setMarkdown] = useState<string>("## Escribe tu markdown aquí");
    const [theme, setTheme] = useState<MonacoTheme>("vs-dark");

    return (
        <div className="w-full min-h-screen flex flex-col">
            {/* Barra superior POR HACER */}
            <div className="flex text-white">
                <select
                    className="text-black"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value as MonacoTheme)}
                >
                    <option value="vs-dark">Oscuro</option>
                    <option value="light">Claro</option>
                    <option value="hc-black">Alto contraste</option>
                </select>
            </div>
            {/* Paneles */}
            <div className="flex flex-row">
                {/* Espacio de trabajo */}
                <MarkdownWorkspace
                    markdown={markdown}
                    setMarkdown={setMarkdown}
                    theme={theme}
                />
            </div>
        </div>
    );
}
