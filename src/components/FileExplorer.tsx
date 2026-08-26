import { useState, useRef, useEffect, useMemo } from 'react';
import { IoClose } from 'react-icons/io5';
import { HiDocumentPlus, HiFolderPlus } from 'react-icons/hi2';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import { GoTriangleRight, GoTriangleDown } from "react-icons/go";
import { Tree, type TreeApi } from 'react-arborist';
import { db } from '@helpers/db';
import { insertPendingNode } from '@helpers/insertPendingNode';
import { createFileSystemEntry } from '@helpers/createEntry';
import { renameFileSystemEntry } from '@helpers/renameEntry';
import { findNodeById } from '@helpers/findNodeById';
import { useFileTree } from '@hooks/files/useFileTree';
import { useActiveFile } from '@hooks/useActiveFile';
import { useEditor } from '@hooks/useEditor';
import TreeNodeNameInput from '@components/ui/TreeNodeNameInput';
//import ConfirmModal from '@components/ui/ConfirmModal';
import type { TreeNode, PendingNodeInfo } from '@/types/file';
import { PENDING_NODE_ID } from '@constants/fileSystem';

interface FileExplorerProps {
    isOpen: boolean;
    onClose: () => void;
}

const FileExplorer = ({ isOpen, onClose }: FileExplorerProps) => {
    const treeData = useFileTree();
    // Explicit user selection made inside the tree (click on a node).
    const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
    // Node currently being created (file/folder), rendered as an inline input
    const [pendingNode, setPendingNode] = useState<PendingNodeInfo | null>(null);
    // Id of the node currently being renamed, rendered as an inline input
    const [renamingNodeId, setRenamingNodeId] = useState<string | null>(null);
    const { activeFileId, setActiveFileId } = useActiveFile();
    const { disposeFileModel } = useEditor();
    // Prevents double-submission if confirmPendingNode fires twice
    const isCreatingRef = useRef(false);
    const treeApiRef = useRef<TreeApi<TreeNode> | null>(null);

    /*
    ** Resolves what the tree should visually treat as "selected":
    ** - the user's explicit selection, if any
    ** - otherwise, the currently active file (e.g. set externally by
    **   useEnsureDefaultFile on first launch, or after deleting a file)
    ** Derived with useMemo instead of synced via useEffect + setState.
    */
    const effectiveSelectedNode = useMemo(() => {
        if (selectedNode) return selectedNode;
        if (!activeFileId) return null;
        return findNodeById(treeData, activeFileId);
    }, [selectedNode, activeFileId, treeData]);

    // Auto-expand the parent folder so the inline "new node" input is visible
    useEffect(() => {
        if (pendingNode?.parentId) {
            treeApiRef.current?.open(pendingNode.parentId);
        }
    }, [pendingNode]);

    if (!isOpen) return null;

    // New files/folders are created inside the selected folder, or as a
    // sibling of the selected file (using its parentId). Root if nothing selected.
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
            // Dispose the Monaco model to avoid holding onto a stale/orphaned model
            disposeFileModel(effectiveSelectedNode.id);
            if (effectiveSelectedNode.id === activeFileId) setActiveFileId(null);
        }

        await db.entries.delete(effectiveSelectedNode.id);
        setSelectedNode(null);
    };

    // Injects a temporary placeholder node into the tree while creating a new file/folder
    const displayTreeData = pendingNode
        ? insertPendingNode(treeData, pendingNode)
        : treeData;
    
    // Disables toolbar actions while an inline create/rename input is active
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
                        // Ignore selection events for the temporary placeholder node
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
        /*{confirmAction && (
            <ConfirmModal
                title={
                    confirmAction.kind === 'empty'
                        ? `Empty ${confirmAction.folderName}?`
                        : `Delete "${confirmAction.nodeName}" permanently?`
                }
                message={
                    confirmAction.kind === 'empty'
                        ? `All files inside ${confirmAction.folderName} will be permanently deleted. This can't be undone.`
                        : `This will permanently delete "${confirmAction.nodeName}". This can't be undone.`
                }
                onConfirm={runConfirmedAction}
                onCancel={() => setConfirmAction(null)}
            />
        )}*/
    );
};

export default FileExplorer;