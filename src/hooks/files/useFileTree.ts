import { useFiles } from './useFiles';
import { buildTree } from '@helpers/buildTree';

export function useFileTree() {
    const files = useFiles();
    return files ? buildTree(files) : [];
}