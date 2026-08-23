import type { CSSProperties } from 'react';
import { HiChevronRight, HiChevronDown } from 'react-icons/hi2';

interface TreeNodeNameInputProps {
    type: 'file' | 'folder';
    style: CSSProperties;
    isOpen?: boolean;
    onConfirm: (name: string) => void;
    onCancel: () => void;
}

const TreeNodeNameInput = ({ type, style, isOpen = false, onConfirm, onCancel }: TreeNodeNameInputProps) => {
    const isFolder = type === 'folder';

    return (
        <div style={style} className="px-2 py-1 flex items-center gap-1">
            {isFolder ? (
                isOpen ? <HiChevronDown size={14} /> : <HiChevronRight size={14} />
            ) : (
                <span className="w-3.5" />
            )}
            <input
                autoFocus
                defaultValue=""
                className="flex-1 bg-white text-black text-sm px-1 py-0.5 rounded outline-none border border-[#888]"
                onBlur={(e) => onConfirm(e.currentTarget.value)}
                onKeyDown={(e) => {
                    e.stopPropagation();

                    if (e.key === 'Enter') {
                        e.preventDefault();
                        onConfirm(e.currentTarget.value);
                    }
                    if (e.key === 'Escape') {
                        e.preventDefault();
                        onCancel();
                    }
                }}
            />
        </div>
    );
};

export default TreeNodeNameInput;