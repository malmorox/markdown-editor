import { headingOptions } from '@constants/toolbar';
import {
    FaTextHeight, 
    FaBold, 
    FaItalic, 
    FaStrikethrough, 
    FaQuoteRight,
    FaLink, 
    FaRegImage, 
    FaListUl, 
    FaListOl, 
    FaListCheck
} from 'react-icons/fa6';
import { IoCode } from 'react-icons/io5';
import { PiCodeBlockBold } from 'react-icons/pi';
import { MdInsertEmoticon } from 'react-icons/md';
import { BiTable } from 'react-icons/bi';
import TableRowsColumnsSelector from '@components/ui/TableRowsColumnsSelector';
import CodeLanguageSelector from '@components/ui/CodeLanguageSelector';
import EmojiPicker from '@components/ui/EmojiPicker';
import { HeadingContent, InputContent } from '@components/ui/ToolbarDropdownsContent';
import { useMarkdownActions } from '@hooks/useMarkdownActions';
import { SHORTCUTS } from '@constants/shortcuts';
import type { ToolbarButton } from '@/types/toolbar';

interface UseToolbarButtonsParams {
    onInsert: (markdown: string, cursorOffset?: number) => void;
    closeDropdown: () => void;
}

export const useToolbarButtons = ({ onInsert, closeDropdown }: UseToolbarButtonsParams): ToolbarButton[] => {
    const actions = useMarkdownActions({ onInsert });

    const handleHeadingSelect = (level: 1 | 2 | 3 | 4 | 5 | 6, label: string) => {
        actions.insertHeading(level, label);
        closeDropdown();
    };

    const handleLinkInsert = (values: Record<string, string>) => {
        actions.insertLink(values.text, values.url);
        closeDropdown();
    };

    const handleImageInsert = (values: Record<string, string>) => {
        actions.insertImage(values.alt, values.url);
        closeDropdown();
    };

    const handleCodeBlockSelect = (language: string) => {
        actions.insertCodeBlock(language);
        closeDropdown();
    };

    const handleTableSelect = (selection: { rows: number; cols: number }) => {
        actions.insertTable(selection.rows, selection.cols);
        closeDropdown();
    };

    //const formatShortcutKeys = (keys: string[]) => keys.join('+');
    //const buildTooltip = (label: string, keys: string[]) => `${label} – ${formatShortcutKeys(keys)}`;
    const buildTooltip = (label: string) => label;

    return [
        {
            type: 'dropdown',
            icon: FaTextHeight,
            iconSize: 20,
            tooltip: buildTooltip(SHORTCUTS.heading.label/*, SHORTCUTS.heading.keys*/),
            name: 'heading',
            dropdownContent: (
                <HeadingContent 
                    options={headingOptions}
                    onSelect={handleHeadingSelect}
                />
            )
        },
        {
            type: 'action',
            icon: FaBold,
            iconSize: 18,
            tooltip: buildTooltip(SHORTCUTS.bold.label/*, SHORTCUTS.bold.keys*/),
            name: 'bold',
            onClick: () => actions.insertBold()
        },
        {
            type: 'action',
            icon: FaItalic,
            iconSize: 18,
            tooltip: buildTooltip(SHORTCUTS.italic.label/*, SHORTCUTS.italic.keys*/),
            name: 'italic',
            onClick: () => actions.insertItalic()
        },
        {
            type: 'action',
            icon: FaStrikethrough,
            iconSize: 18,
            tooltip: buildTooltip(SHORTCUTS.strikethrough.label/*, SHORTCUTS.strikethrough.keys*/),
            name: 'strikethrough',
            onClick: () => actions.insertStrikethrough()
        },
        {
            type: 'action',
            icon: FaQuoteRight,
            iconSize: 18,
            tooltip: buildTooltip(SHORTCUTS.quote.label/*, SHORTCUTS.quote.keys*/),
            name: 'quote',
            onClick: () => actions.insertQuote()
        },
        {
            type: 'action',
            icon: IoCode,
            iconSize: 22,
            tooltip: buildTooltip(SHORTCUTS.code.label/*, SHORTCUTS.code.keys*/),
            name: 'code',
            onClick: () => actions.insertCode()
        },
        {
            type: 'dropdown',
            icon: FaLink,
            iconSize: 20,
            tooltip: buildTooltip(SHORTCUTS.link.label/*, SHORTCUTS.link.keys*/),
            name: 'link',
            dropdownContent: (
                <InputContent
                    fields={[
                        { name: 'text', label: 'Link text', placeholder: 'Ex: Go to site' },
                        { name: 'url', label: 'Link URL', placeholder: 'https://example.com' }
                    ]}
                    onSubmit={handleLinkInsert}
                />
            )
        },
        {
            type: 'action',
            icon: FaListUl,
            iconSize: 18,
            tooltip: buildTooltip(SHORTCUTS['unordered-list'].label/*, SHORTCUTS['unordered-list'].keys*/),
            name: 'unordered-list',
            onClick: () => actions.insertUnorderedList()
        },
        {
            type: 'action',
            icon: FaListOl,
            iconSize: 18,
            tooltip: buildTooltip(SHORTCUTS['ordered-list'].label/*, SHORTCUTS['ordered-list'].keys*/),
            name: 'ordered-list',
            onClick: () => actions.insertOrderedList()
        },
        {
            type: 'action',
            icon: FaListCheck,
            iconSize: 18,
            tooltip: buildTooltip(SHORTCUTS['task-list'].label/*, SHORTCUTS['task-list'].keys*/),
            name: 'task-list',
            onClick: () => actions.insertTaskList()
        },
        {
            type: 'dropdown',
            icon: PiCodeBlockBold,
            iconSize: 20,
            tooltip: buildTooltip(SHORTCUTS.codeblock.label/*, SHORTCUTS.codeblock.keys*/),
            name: 'codeblock',
            dropdownContent: <CodeLanguageSelector onSelect={handleCodeBlockSelect} />
        },
        {
            type: 'dropdown',
            icon: BiTable,
            iconSize: 21,
            tooltip: buildTooltip(SHORTCUTS.table.label/*, SHORTCUTS.table.keys*/),
            name: 'table',
            dropdownContent: <TableRowsColumnsSelector onSelect={handleTableSelect} />
        },
        {
            type: 'dropdown',
            icon: FaRegImage,
            iconSize: 18,
            tooltip: buildTooltip(SHORTCUTS.image.label/*, SHORTCUTS.image.keys*/),
            name: 'image',
            dropdownContent:  (
                <InputContent
                    fields={[
                        { name: 'alt', label: 'Alt text', placeholder: 'Description' },
                        { name: 'url', label: 'Image URL', placeholder: 'https://example.com/image.jpg' }
                    ]}
                    onSubmit={handleImageInsert}
                />
            )
        },
        {
            type: 'dropdown',
            icon: MdInsertEmoticon,
            iconSize: 21,
            tooltip: buildTooltip(SHORTCUTS.emoji.label/*, SHORTCUTS.emoji.keys*/),
            name: 'emoji',
            dropdownContent: <EmojiPicker onSelect={actions.insertEmoji} />
        }
    ];
}