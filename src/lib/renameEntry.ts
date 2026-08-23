import { db } from './db';

export async function renameFileSystemEntry(id: string, name: string) {
    await db.files.update(id, { name, updatedAt: Date.now() });
}