import { useState, useRef, useEffect, useMemo } from 'react';
import { IoClose } from 'react-icons/io5';
import { HiDocumentPlus, HiFolderPlus } from 'react-icons/hi2';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import { GoTriangleRight, GoTriangleDown } from "react-icons/go";
import { Tree, type TreeApi } from 'react-arborist';
import { db } from '@/lib/db';
import { insertPendingNode, PENDING_NODE_ID } from '@/lib/insertPendingNode';
import { createFileSystemEntry } from '@/lib/createEntry';
import { renameFileSystemEntry } from '@lib/renameEntry';
import { findNodeById } from '@/lib/findNodeById';
import { useFileTree } from '@hooks/files/useFileTree';
import { useActiveFile } from '@hooks/useActiveFile';
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
    const [renamingNodeId, setRenamingNodeId] = useState<string | null>(null);
    const { activeFileId, setActiveFileId } = useActiveFile();
    const { disposeFileModel } = useEditor();
    const isCreatingRef = useRef(false);
    const treeApiRef = useRef<TreeApi<TreeNode> | null>(null);

    const effectiveSelectedNode = useMemo(() => {
        if (selectedNode) return selectedNode;
        if (!activeFileId) return null;
        return findNodeById(treeData, activeFileId);
    }, [selectedNode, activeFileId, treeData]);

    useEffect(() => {
        if (pendingNode?.parentId) {
            treeApiRef.current?.open(pendingNode.parentId);
        }
    }, [pendingNode]);

    if (!isOpen) return null;

    const resolveTargetParentId = (): string | null => {
        if (!effectiveSelectedNode) return null;
        return effectiveSelectedNode.type === 'folder' ? effectiveSelectedNode.id : effectiveSelectedNode.parentId;
    };

    const handleCreateFile = () => {
        const parentId = resolveTargetParentId();
        setPendingNode({ type: 'file', parentId });
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
            const newEntry = await createFileSystemEntry(name, pendingNode);
            setSelectedNode(newEntry);
            if (newEntry.type === 'file') {
                setActiveFileId(newEntry.id);
            }
        }

        setPendingNode(null);
        isCreatingRef.current = false;
    };

    const discardPendingNode = () => setPendingNode(null);

    const handleRename = () => {
        if (!effectiveSelectedNode) return;
        setRenamingNodeId(effectiveSelectedNode.id);
    };

    const confirmRename = async (rawName: string) => {
        if (!renamingNodeId) return;

        const name = rawName.trim();
        if (name) {
            await renameFileSystemEntry(renamingNodeId, name);
        }

        setRenamingNodeId(null);
    };

    const cancelRename = () => setRenamingNodeId(null);

    const handleDelete = async () => {
        if (!effectiveSelectedNode) return;

        if (effectiveSelectedNode.type === 'file') {
            disposeFileModel(effectiveSelectedNode.id);
            if (effectiveSelectedNode.id === activeFileId) setActiveFileId(null);
        }

        await db.entries.delete(effectiveSelectedNode.id);
        setSelectedNode(null);
    };

    const displayTreeData = pendingNode
        ? insertPendingNode(treeData, pendingNode)
        : treeData;

    const isBusy = !!pendingNode || !!renamingNodeId;

    return (
        <aside className="w-72 h-full bg-[#D4D4D4] text-[#252526] flex flex-col shrink-0">
            <div className="flex items-center h-12 px-3 gap-1 bg-[#bbbbbb]">
                <button
                    onClick={handleCreateFile}
                    disabled={isBusy}
                    className="p-1 hover:bg-[#A8A8A8] rounded transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    title="New file"
                >
                    <HiDocumentPlus size={20} />
                </button>
                <button
                    onClick={handleCreateFolder}
                    disabled={isBusy}
                    className="p-1 hover:bg-[#A8A8A8] rounded transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    title="New folder"
                >
                    <HiFolderPlus size={20} />
                </button>
                <button
                    onClick={handleRename}
                    disabled={isBusy || !effectiveSelectedNode}
                    className="p-1 hover:bg-[#A8A8A8] rounded transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Rename selected"
                >
                    <FaPencilAlt size={18} />
                </button>
                <button
                    onClick={handleDelete}
                    disabled={isBusy || !effectiveSelectedNode}
                    className="p-1 hover:bg-[#A8A8A8] rounded transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Delete selected"
                >
                    <FaTrash size={18} />
                </button>
                <span className="flex-1" />
                <button 
                    onClick={onClose} 
                    className="p-1 text-[#2d2d30] hover:bg-[#A8A8A8] rounded transition-colors cursor-pointer" 
                    title="Close explorer"
                >
                    <IoClose size={25} color="#2d2d30" />
                </button>
            </div>

            <div className="flex-1 overflow-auto">
                <Tree<TreeNode>
                    data={displayTreeData}
                    openByDefault={false}
                    ref={treeApiRef}
                    rowHeight={24}
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

                        if (node.data.id === renamingNodeId) {
                            return (
                                <TreeNodeNameInput
                                    type={node.data.type}
                                    style={style}
                                    isOpen={node.isOpen}
                                    defaultValue={node.data.name}
                                    onConfirm={confirmRename}
                                    onCancel={cancelRename}
                                />
                            );
                        }

                        const isFolder = node.data.type === 'folder';
                        const isSelected = node.data.id === effectiveSelectedNode?.id;

                        return (
                            <div
                                style={style}
                                ref={dragHandle}
                                onClick={() => {
                                    if (isFolder) node.toggle();
                                }}
                                className={`h-full box-border px-2 cursor-pointer text-sm leading-5 flex items-center gap-1 ${
                                    isSelected ? 'bg-[#A8A8A8]' : ''
                                }`}
                            >
                                {isFolder ? (
                                    node.isOpen ? <GoTriangleDown size={14} /> : <GoTriangleRight size={14} />
                                ) : (
                                    <span className="w-3.5" />
                                )}
                                <span className="text-xm">{node.data.name}</span>
                            </div>
                        );
                    }}
                </Tree>
            </div>
        </aside>
    );
};

export default FileExplorer;