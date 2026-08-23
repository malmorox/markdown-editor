import { db } from './db';
import type { PendingNodeInfo } from '@/types/file';

export async function createFileSystemEntry(name: string, pending: PendingNodeInfo) {
    await db.files.add({
        id: crypto.randomUUID(),
        name,
        type: pending.type,
        parentId: pending.parentId,
        content: pending.type === 'file' ? '' : undefined,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    });
}