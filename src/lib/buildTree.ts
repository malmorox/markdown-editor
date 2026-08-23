import type { FileSystemEntry, TreeNode } from '@/types/file';

export function buildTree(nodes: FileSystemEntry[]): TreeNode[] {
    const map = new Map<string, TreeNode>();
    nodes.forEach(n =>
        map.set(n.id, { ...n, children: n.type === 'folder' ? [] : undefined })
    );

    const roots: TreeNode[] = [];
    nodes.forEach(n => {
        const node = map.get(n.id)!;
        if (n.parentId === null) {
            roots.push(node);
        } else {
            map.get(n.parentId)?.children?.push(node);
        }
    });
    return roots;
}