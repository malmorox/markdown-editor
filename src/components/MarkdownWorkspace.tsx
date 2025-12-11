import MarkdownEditor from "@components/MarkdownEditor";
import MarkdownInterpreter from "@components/MarkdownInterpreter";
import MarkdownToolbar from "@components/MarkdownToolbar";
import DownloadButton from "@components/DownloadButton";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useEditor } from "@hooks/useEditor";
import { useTheme } from "@hooks/useTheme";

// Espacio de trabajo dividido en 2 paneles, el editor de Markdown y el intérprete que muestra su salida. Los paneles son redimensionables (de la libreria 'react-resizable-panels'), para dar libertad al usuario a la hora de trabajar.
const MarkdownWorkspace = () => {
    const { insertMarkdown } = useEditor();
    const { theme } = useTheme();

    return (
        <div className="flex flex-col h-full">
            <div className="shrink-0">
                <MarkdownToolbar onInsert={insertMarkdown} />
            </div>
            <div className="flex-1 overflow-hidden">
                <PanelGroup direction="horizontal" className="w-full h-full">
                    {/* EDITOR */}
                    <Panel defaultSize={50} minSize={20}>
                        <MarkdownEditor />
                    </Panel>

                    {/* Barra de redimensión */}
                    <PanelResizeHandle className={`w-2 cursor-col-resize ${
                            theme === "vs-dark"
                                ? "bg-[#252526] hover:bg-[#212122]"
                                : "bg-[#d4d4d4] hover:bg-[#c8c8c8]"}`}
                    />

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
            </div>
        </div>
    );
};

export default MarkdownWorkspace;