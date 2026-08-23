import { db } from './db';

export async function renameEntryFile(id: string, name: string) {
    await db.files.update(id, { name, updatedAt: Date.now() });
}