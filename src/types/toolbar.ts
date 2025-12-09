import type { IconType } from 'react-icons';

export type ToolbarIcon = IconType | string;

export type ActionButton = {
    type: 'action';
    icon: ToolbarIcon;
    tooltip: string;
    name: string;
    onClick: () => void;
};

export type DropdownButton = {
    type: 'dropdown';
    icon: ToolbarIcon;
    tooltip: string;
    name: string;
    dropdownContent: React.ReactNode;
};

export type ToolbarButton = ActionButton | DropdownButton;