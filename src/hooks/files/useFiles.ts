import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';

export function useFiles() {
    return useLiveQuery(() => db.entries.toArray(), []);
}