import Dexie, { type Table } from 'dexie';
import type { FileNode } from '@/types/file';

class RuneQiDB extends Dexie {
    files!: Table<FileNode, string>;

    constructor() {
        super('runeqi-md');
        this.version(1).stores({
            files: 'id, parentId, type, name',
        });
    }
}

export const db = new RuneQiDB();