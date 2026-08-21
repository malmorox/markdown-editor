export interface FileNode {
    id: string;
    name: string;
    type: 'file' | 'folder';
    parentId: string | null;
    content?: string;
    createdAt: number;
    updatedAt: number;
}

export interface TreeNode extends FileNode {
    children?: TreeNode[];
}