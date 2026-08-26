import Dexie, { type Table } from 'dexie';
import type { FileSystemEntry } from '@/types/file';

class RuneQiDB extends Dexie {
    entries!: Table<FileSystemEntry, string>;

    constructor() {
        super('runeqi-md');
        this.version(1).stores({
            entries: 'id, parentId, type, name',
        });
    }
}

export const db = new RuneQiDB();