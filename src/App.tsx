import MarkdownWorkspace from "@components/MarkdownWorkspace";
import "./App.css"

export default function App() {
    return (
        <div className="w-full min-h-screen flex flex-col">
            {/* Paneles */}
            <div className="w-full h-200 rounded-3xl border border-sky-400 bg-[#1e1e1e] overflow-hidden">
                {/* Espacio de trabajo */}
                <MarkdownWorkspace />
            </div>
        </div>
    );
}
