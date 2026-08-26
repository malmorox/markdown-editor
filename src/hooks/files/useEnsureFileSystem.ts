import { useEffect, useRef } from 'react';
import { useFiles } from './useFiles';
import { useActiveFile } from '../useActiveFile';
import { createFileSystemEntry } from '@helpers/createEntry';
import { ensureSystemFolders } from '@helpers/systemFolders';
import { TRASH_ID, TEMP_ID } from '@constants/fileSystem';

/**
 * Ensures the file system is ready to use on app start:
 * - Trash and Temp system folders always exist
 * - A real, persisted welcome file exists on first-time visits
 * - There's always an active file selected once files exist
 */
export function useEnsureFileSystem() {
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

        (async () => {
            await ensureSystemFolders();
            // Ignore Trash/Temp themselves when deciding if this is a first-time visit
            const userFiles = files.filter((f) => f.id !== TRASH_ID && f.id !== TEMP_ID);
            // No files exist yet, this is a first-time visit.
            // Create a real, persisted welcome file and select it.
            if (userFiles.length === 0) {
                createFileSystemEntry('Welcome file', { type: 'file', parentId: null })
                    .then((entry) => setActiveFileId(entry.id));
                return;
            }

            // Files exist but none is active (e.g. after a page reload) —
            // fall back to the first FILE (skip folders), so the editor isn't
            // handed a folder to load as if it were a document.
            if (!activeFileId) {
                const firstFile = userFiles.find((f) => f.type === 'file');
                if (firstFile) setActiveFileId(firstFile.id);
            }
        })();
    }, [files, activeFileId, setActiveFileId]);
}