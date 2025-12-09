import type { IconType } from 'react-icons';

export type ActionButton = {
    type: 'action';
    icon: IconType;
    iconSize: number;
    tooltip: string;
    name: string;
    onClick: () => void;
};

export type DropdownButton = {
    type: 'dropdown';
    icon: IconType;
    iconSize: number;
    tooltip: string;
    name: string;
    dropdownContent: React.ReactNode;
};

export type ToolbarButton = ActionButton | DropdownButton;