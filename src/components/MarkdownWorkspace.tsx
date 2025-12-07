import MarkdownEditor from "@components/MarkdownEditor";
import MarkdownInterpreter from "@components/MarkdownInterpreter";
import DownloadButton from "@components/DownloadButton";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

// Espacio de trabajo dividido en 2 paneles, el editor de Markdown y el intérprete que muestra su salida. Los paneles son redimensionables (de la libreria 'react-resizable-panels'), para dar libertad al usuario a la hora de trabajar.
const MarkdownWorkspace = () => {
    return (
        <PanelGroup direction="horizontal" className="w-full h-full">
            {/* EDITOR */}
            <Panel defaultSize={50} minSize={20}>
                <MarkdownEditor />
            </Panel>

            {/* Barra de redimensión */}
            <PanelResizeHandle className="w-2 bg-gray-700 hover:bg-gray-500 cursor-col-resize" />

            {/* INTÉRPRETE */}
            <Panel defaultSize={50} minSize={20}>
                <div className="w-full h-full relative">
                    <MarkdownInterpreter />

                    <div className="absolute bottom-8 right-8">
                        <DownloadButton />
                    </div>
                </div>
            </Panel>
        </PanelGroup>
    );
};

export default MarkdownWorkspace;