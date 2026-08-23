import { useState } from 'react';
import { useActiveFileEntry } from '@hooks/files/useActiveFileEntry';
import { renameFileSystemEntry } from '@lib/renameEntry';

const ActiveFileName = () => {
    const activeEntry = useActiveFileEntry();
    const [isEditing, setIsEditing] = useState(false);

    if (!activeEntry) return null;

    const commitRename = async (rawName: string) => {
        const name = rawName.trim();
        if (name && name !== activeEntry.name) {
            await renameFileSystemEntry(activeEntry.id, name);
        }
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <input
                autoFocus
                defaultValue={activeEntry.name}
                onFocus={(e) => e.currentTarget.select()}
                className="bg-[#3c3c3c] text-white text-sm px-2 py-1 rounded outline-none border border-[#666] min-w-35"
                onBlur={(e) => commitRename(e.currentTarget.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        commitRename(e.currentTarget.value);
                    }
                    if (e.key === 'Escape') {
                        e.preventDefault();
                        setIsEditing(false);
                    }
                }}
            />
        );
    }

    return (
        <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-[#bbbbbb] hover:text-white px-2 py-1 rounded hover:bg-[#4d4d4d] transition-colors cursor-pointer truncate max-w-lg"
            title="Click para renombrar"
        >
            {activeEntry.name}
        </button>
    );
};

export default ActiveFileName;