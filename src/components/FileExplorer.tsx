import { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { HiDocumentPlus, HiFolderPlus } from 'react-icons/hi2';
import { FiTrash2 } from 'react-icons/fi';
import { Tree } from 'react-arborist';
import { db } from '@/lib/db';
import { useFileTree } from '@hooks/files/useFileTree';
import type { TreeNode } from '@/types/file';

interface FileExplorerProps {
    isOpen: boolean;
    onClose: () => void;
    activeFileId: string | null;
    onSelectFile: (id: string) => void;
}

const ExplorerSidebar = ({ isOpen, onClose, activeFileId, onSelectFile }: FileExplorerProps) => {
    const treeData = useFileTree();
    const [selectedId, setSelectedId] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleNewFile = async () => {
        await db.files.add({
            id: crypto.randomUUID(),
            name: 'sin-titulo.md',
            type: 'file',
            parentId: null,
            content: '',
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
    };

    const handleNewFolder = async () => {
        await db.files.add({
            id: crypto.randomUUID(),
            name: 'Nueva carpeta',
            type: 'folder',
            parentId: null,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
    };

    const handleDelete = async () => {
        if (!selectedId) return;
        await db.files.delete(selectedId);
        setSelectedId(null);
    };

    return (
        <aside className="w-64 h-full bg-[rgb(212,212,212)] text-[#252526] flex flex-col border-r border-[#a8a8a8] shrink-0">
            <div className="flex items-center h-12 px-3 gap-1 bg-[#bbbbbb]">
                <button onClick={handleNewFile} className="p-1 hover:bg-[#A8A8A8] rounded transition-colors cursor-pointer" title="Nuevo archivo">
                    <HiDocumentPlus size={20} />
                </button>
                <button onClick={handleNewFolder} className="p-1 hover:bg-[#A8A8A8] rounded transition-colors cursor-pointer" title="Nueva carpeta">
                    <HiFolderPlus size={20} />
                </button>
                <button
                    onClick={handleDelete}
                    disabled={!selectedId}
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

            {/* Árbol de archivos */}
            <div className="flex-1 overflow-auto">
                <Tree<TreeNode>
                    data={treeData}
                    openByDefault={false}
                    width="100%"
                    onSelect={(nodes) => {
                        const node = nodes[0]?.data;
                        setSelectedId(node?.id ?? null);
                        if (node?.type === 'file') onSelectFile(node.id);
                    }}
                >
                    {({ node, style, dragHandle }) => (
                        <div
                            style={style}
                            ref={dragHandle}
                            className={`px-2 py-1 cursor-pointer text-sm rounded ${
                                node.data.id === activeFileId ? 'bg-[#A8A8A8]' : ''
                            }`}
                        >
                            {node.data.type === 'folder' ? '📁' : '📄'} {node.data.name}
                        </div>
                    )}
                </Tree>
            </div>
        </aside>
    );
};

export default ExplorerSidebar;