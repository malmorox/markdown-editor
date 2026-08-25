import { useEffect, useRef } from 'react';
import { useFiles } from './useFiles';
import { useActiveFile } from '../useActiveFile';
import { createFileSystemEntry } from '@/lib/createEntry';

/**
 * Ensures the app always has a file to show on first load, and that
 * there's always an active file selected once files exist.
 */
export function useEnsureDefaultFile() {
    // Live-queried list of files from Dexie (undefined while loading).
    const files = useFiles();
    const { activeFileId, setActiveFileId } = useActiveFile();
    // Prevents this logic from running more than once per session,
    // even if the effect re-runs due to dependency changes.
    const hasRun = useRef(false);

    useEffect(() => {
        // Dexie hasn't resolved the query yet — wait for real data.
        if (files === undefined) return;
        // Guard clause: only run the "first load" logic once.
        if (hasRun.current) return;
        hasRun.current = true;

        // No files exist yet, this is a first-time visit.
        // Create a real, persisted welcome file and select it.
        if (files.length === 0) {
            createFileSystemEntry('Welcome file', { type: 'file', parentId: null })
                .then((entry) => setActiveFileId(entry.id));
            return;
        }

        // Files exist but none is active (e.g. after a page reload) —
        // fall back to selecting the first one so the editor isn't empty.
        if (!activeFileId) {
            setActiveFileId(files[0].id);
        }
    }, [files, activeFileId, setActiveFileId]);
}