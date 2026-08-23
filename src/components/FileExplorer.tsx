import { useState, useRef } from 'react';
import { IoClose } from 'react-icons/io5';
import { HiDocumentPlus, HiFolderPlus, HiChevronRight, HiChevronDown } from 'react-icons/hi2';
import { FiTrash2 } from 'react-icons/fi';
import { Tree, type TreeApi } from 'react-arborist';
import { db } from '@/lib/db';
import { insertPendingNode, PENDING_NODE_ID } from '@/lib/insertPendingNode';
import { createFileSystemEntry } from '@/lib/createEntry';
import { useFileTree } from '@hooks/files/useFileTree';
import { useActiveFile } from '@hooks/files/useActiveFile';
import { useEditor } from '@hooks/useEditor';
import TreeNodeNameInput from '@components/ui/TreeNodeNameInput';
import type { TreeNode, PendingNodeInfo } from '@/types/file';

interface FileExplorerProps {
    isOpen: boolean;
    onClose: () => void;
}

const FileExplorer = ({ isOpen, onClose }: FileExplorerProps) => {
    const treeData = useFileTree();
    const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
    const [pendingNode, setPendingNode] = useState<PendingNodeInfo | null>(null);
    const { activeFileId, setActiveFileId } = useActiveFile();
    const { disposeFileModel } = useEditor();
    const isCreatingRef = useRef(false);
    const treeApiRef = useRef<TreeApi<TreeNode> | null>(null);

    if (!isOpen) return null;

    const resolveTargetParentId = (): string | null => {
        if (!selectedNode) return null;
        return selectedNode.type === 'folder' ? selectedNode.id : selectedNode.parentId;
    };

    const handleCreateFile = () => {
        const parentId = resolveTargetParentId();
        setPendingNode({ type: 'file', parentId });

        if (parentId) {
            treeApiRef.current?.open(parentId);
        }
    };

    const handleCreateFolder = () => {
        // Folders are always created at the root level because nesting folders is not supported
        setPendingNode({ type: 'folder', parentId: null });
    };

    const confirmPendingNode = async (rawName: string) => {
        if (!pendingNode || isCreatingRef.current) return;
        isCreatingRef.current = true;

        const name = rawName.trim();
        if (name) {
            await createFileSystemEntry(name, pendingNode);
        }

        setPendingNode(null);
        isCreatingRef.current = false;
    };

    const discardPendingNode = () => setPendingNode(null);

    const handleDelete = async () => {
        if (!selectedNode) return;

        if (selectedNode.type === 'file') {
            disposeFileModel(selectedNode.id);
            if (selectedNode.id === activeFileId) setActiveFileId(null);
        }

        await db.files.delete(selectedNode.id);
        setSelectedNode(null);
    };

    const displayTreeData = pendingNode
    ? insertPendingNode(treeData, pendingNode)
    : treeData;

    return (
        <aside className="w-64 h-full bg-[#D4D4D4] text-[#252526] flex flex-col border-r border-[#a8a8a8] shrink-0">
            <div className="flex items-center h-12 px-3 gap-1 bg-[#bbbbbb]">
                <button
                    onClick={handleCreateFile}
                    disabled={!!pendingNode}
                    className="p-1 hover:bg-[#A8A8A8] rounded transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Nuevo archivo"
                >
                    <HiDocumentPlus size={20} />
                </button>
                <button
                    onClick={handleCreateFolder}
                    disabled={!!pendingNode}
                    className="p-1 hover:bg-[#A8A8A8] rounded transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Nueva carpeta"
                >
                    <HiFolderPlus size={20} />
                </button>
                <button
                    onClick={handleDelete}
                    disabled={!selectedNode}
                    className="p-1 hover:bg-[#A8A8A8] rounded transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Eliminar seleccionado"
                >
                    <FiTrash2 size={18} />
                </button>
                <span className="flex-1" />
                <button onClick={onClose} className="p-1 hover:bg-[#A8A8A8] rounded transition-colors cursor-pointer" title="Cerrar explorador">
                    <IoClose size={22} color="#2d2d30" />
                </button>
            </div>

            <div className="flex-1 overflow-auto">
                <Tree<TreeNode>
                    data={displayTreeData}
                    openByDefault={false}
                    width="100%"
                    onSelect={(nodes) => {
                        const node = nodes[0]?.data ?? null;
                        if (node?.id === PENDING_NODE_ID) return;
                        setSelectedNode(node);
                        if (node?.type === 'file') setActiveFileId(node.id);
                    }}
                >
                    {({ node, style, dragHandle }) => {
                        if (node.data.id === PENDING_NODE_ID) {
                            return (
                                <TreeNodeNameInput
                                    type={pendingNode!.type}
                                    style={style}
                                    isOpen={node.isOpen}
                                    onConfirm={confirmPendingNode}
                                    onCancel={discardPendingNode}
                                />
                            );
                        }

                        const isFolder = node.data.type === 'folder';
                        const isSelected = node.data.id === selectedNode?.id;

                        return (
                            <div
                                style={style}
                                ref={dragHandle}
                                onClick={() => {
                                    if (isFolder) node.toggle();
                                }}
                                className={`px-2 py-1 cursor-pointer text-sm rounded flex items-center gap-1 ${
                                    isSelected ? 'bg-[#A8A8A8]' : ''
                                }`}
                            >
                                {isFolder ? (
                                    node.isOpen ? <HiChevronDown size={14} /> : <HiChevronRight size={14} />
                                ) : (
                                    <span className="w-3.5" />
                                )}
                                <span>{node.data.name}</span>
                            </div>
                        );
                    }}
                </Tree>
            </div>
        </aside>
    );
};

export default FileExplorer;