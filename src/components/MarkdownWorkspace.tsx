import MarkdownEditor from "./MarkdownEditor";
import MarkdownInterpreter from "./MarkdownInterpreter";
import DownloadButton from "./DownloadButton";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

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