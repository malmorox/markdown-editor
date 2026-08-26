import { db } from './db';
import { TRASH_ID, TEMP_ID } from '@constants/fileSystem';
import type { FileSystemEntry } from '@/types/file';

export function isSpecialFolderId(id: string): boolean {
    return id === TRASH_ID || id === TEMP_ID;
}

// Walks up the parentId chain to find whether an entry lives inside Trash or Temp.
// Returns null if the entry is not inside either (or doesn't exist).
export function getContainingSpecialFolder(
    entryId: string | null,
    entries: FileSystemEntry[]
): typeof TRASH_ID | typeof TEMP_ID | null {
    if (!entryId) return null;
    const map = new Map(entries.map((e) => [e.id, e]));
    let current = map.get(entryId);

    while (current) {
        if (current.id === TRASH_ID) return TRASH_ID;
        if (current.id === TEMP_ID) return TEMP_ID;
        if (!current.parentId) return null;
        current = map.get(current.parentId);
    }
    return null;
}

// Creates Trash and Temp as fixed, top-level folders if they don't exist yet.
// Safe to call on every app start — no-ops if they're already there.
export async function ensureSystemFolders() {
    const [trash, temp] = await Promise.all([
        db.entries.get(TRASH_ID),
        db.entries.get(TEMP_ID),
    ]);

    const now = Date.now();

    if (!trash) {
        await db.entries.add({
            id: TRASH_ID,
            name: 'Trash',
            type: 'folder',
            parentId: null,
            createdAt: now,
            updatedAt: now,
        });
    }

    if (!temp) {
        await db.entries.add({
            id: TEMP_ID,
            name: 'Temp',
            type: 'folder',
            parentId: null,
            createdAt: now,
            updatedAt: now,
        });
    }
}