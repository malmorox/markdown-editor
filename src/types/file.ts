export interface FileSystemEntry {
    id: string;
    name: string;
    type: 'file' | 'folder';
    parentId: string | null;
    content?: string;
    createdAt: number;
    updatedAt: number;
}

export interface TreeNode extends FileSystemEntry {
    children?: TreeNode[];
}

export interface PendingNodeInfo {
    type: 'file' | 'folder';
    parentId: string | null;
}