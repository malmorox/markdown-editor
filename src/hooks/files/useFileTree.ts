import { useFiles } from './useFiles';
import { buildTree } from '@/lib/buildTree';

export function useFileTree() {
    const files = useFiles();
    return files ? buildTree(files) : [];
}