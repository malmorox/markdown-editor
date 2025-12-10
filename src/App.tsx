import MarkdownWorkspace from "@components/MarkdownWorkspace";
import "./App.css"

export default function App() {
    return (
        <div className="w-full h-screen">
            {/* Paneles */}
            <div className="w-full h-full bg-[#1e1e1e] overflow-hidden"> 
                {/* Espacio de trabajo */}
                <MarkdownWorkspace />
            </div>
        </div>
    );
}
