import React, { useState, useRef, useEffect } from 'react';
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
    FaListCheck,
    FaTable
} from 'react-icons/fa6';
import { IoCode } from "react-icons/io5";
import { PiCodeBlockBold } from "react-icons/pi";
import { MdInsertEmoticon } from "react-icons/md";
import type { ToolbarButton } from '@/types/toolbar';
import TableRowsColumnsSelector from '@components/ui/TableRowsColumnsSelector';
import CodeLanguageSelector from '@components/ui/CodeLanguageSelector';
import EmojiPicker from '@components/ui/EmojiPicker';
import { HeadingContent, InputContent } from '@components/ui/ToolbarDropdownsContent';
import ThemeSwitcher from "@components/ThemeSwitcher";

interface MarkdownToolbarProps {
    onInsert: (markdown: string, cursorOffset?: number) => void;
}

interface DropdownProps {
    isOpen: boolean;
    children: React.ReactNode;
}

const Dropdown = ({ isOpen, children }: DropdownProps) => {
    if (!isOpen) return null;
    
    return (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
            {children}
        </div>
    );
};

const MarkdownToolbar = ({ onInsert }: MarkdownToolbarProps) => {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }, []);

    const toggleDropdown = (name: string) => {
        setOpenDropdown(openDropdown === name ? null : name);
    };

    const closeDropdown = () => {
        setOpenDropdown(null);
    };

    // Configuración de encabezados
    const headingOptions: { label: string; markdown: string; level: 1 | 2 | 3 | 4 | 5 | 6 }[] = [
        { label: 'Título 1', markdown: '#', level: 1 },
        { label: 'Título 2', markdown: '##', level: 2 },
        { label: 'Título 3', markdown: '###', level: 3 },
        { label: 'Título 4', markdown: '####', level: 4 },
        { label: 'Título 5', markdown: '#####', level: 5 },
        { label: 'Título 6', markdown: '######', level: 6 },
    ];

    // Función para generar tablas
    const generateTable = (rows: number, cols: number) => {
        let table = '|';
        for (let i = 0; i < cols; i++) {
            table += ` Columna ${i + 1} |`;
        }
        table += '\n|';
        for (let i = 0; i < cols; i++) {
            table += ' --------- |';
        }
        for (let i = 0; i < rows; i++) {
            table += '\n|';
            for (let j = 0; j < cols; j++) {
                table += ` Celda ${i + 1}-${j + 1} |`;
            }
        }
        table += '\n';
        return table;
    };

    // Manejadores
    const handleHeadingSelect = (markdown: string) => {
        onInsert(markdown);
        closeDropdown();
    };

    const handleBoldInsert = () => {
        const text = 'texto en negrita';
        onInsert(`**${text}**`);
    };

    const handleItalicInsert = () => {
        const text = 'texto en cursiva';
        onInsert(`*${text}*`);
    };

    const handleStrikethroughInsert = () => {
        const text = 'texto tachado';
        onInsert(`~${text}~`);
    };

    const handleQuoteInsert = () => {
        const text = 'texto citado';
        onInsert(`> ${text}`);
    };

    const handleCodeInsert = () => {
        const text = 'enter code here';
        onInsert(`\`${text}\``);
        closeDropdown();
    };

    const handleLinkInsert = (values: Record<string, string>) => {
        const text = values.text || 'texto del enlace';
        const url = values.url || 'https://ejemplo.com';
        onInsert(`[${text}](${url})`);
        closeDropdown();
    };

    const handleListInsert = (type: 'unordered' | 'ordered' | 'task') => {
        let content = '';

        switch (type) {
            case 'unordered':
                content = '- Elemento 1\n- Elemento 2\n- Elemento 3\n';
                break;

            case 'ordered':
                content = '1. Elemento 1\n2. Elemento 2\n3. Elemento 3\n';
                break;

            case 'task':
                content = '- [ ] Tarea 1\n- [ ] Tarea 2\n- [ ] Tarea 3\n';
                break;
        }

        onInsert(content);
    };

    const handleCodeBlockSelect = (language: string) => {
        onInsert(`\`\`\`${language}\n\n\`\`\`\n`, -4);
        closeDropdown();
    };

    const handleTableSelect = (selection: { rows: number; cols: number }) => {
        const table = generateTable(selection.rows, selection.cols);
        onInsert(table);
        closeDropdown();
    };

    const handleImageInsert = (values: Record<string, string>) => {
        const alt = values.alt || 'descripción';
        const url = values.url || 'https://ejemplo.com/imagen.jpg';
        onInsert(`![${alt}](${url})`);
        closeDropdown();
    };

    const handleEmojiSelect = (emoji: string) => {
        onInsert(emoji);
    };

    /*const handleDividerInsert = () => {
        onInsert('\n---\n');
        closeDropdown();
    };*/

    // Botones del la barra de herramientas
    const toolbarButtons: ToolbarButton[] = [
        {
            type: 'dropdown',
            icon: FaTextHeight,
            iconSize: 20,
            tooltip: 'Encabezado',
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
            tooltip: 'Negrita',
            name: 'bold',
            onClick: () => handleBoldInsert()
        },
        {
            type: 'action',
            icon: FaItalic,
            iconSize: 18,
            tooltip: 'Cursiva',
            name: 'italic',
            onClick: () => handleItalicInsert()
        },
        {
            type: 'action',
            icon: FaStrikethrough,
            iconSize: 18,
            tooltip: 'Tachado',
            name: 'strikethrough',
            onClick: () => handleStrikethroughInsert()
        },
        {
            type: 'action',
            icon: FaQuoteRight,
            iconSize: 18,
            tooltip: 'Cita',
            name: 'quote',
            onClick: () => handleQuoteInsert()
        },
        {
            type: 'action',
            icon: IoCode,
            iconSize: 22,
            tooltip: 'Código inline',
            name: 'code',
            onClick: () => handleCodeInsert()
        },
        {
            type: 'dropdown',
            icon: FaLink,
            iconSize: 20,
            tooltip: 'Enlace',
            name: 'link',
            dropdownContent: (
                <InputContent
                    fields={[
                        { name: 'text', label: 'Texto del enlace', placeholder: 'Ej: Ir al sitio' },
                        { name: 'url', label: 'URL del enlace', placeholder: 'https://ejemplo.com' }
                    ]}
                    onSubmit={handleLinkInsert}
                />
            )
        },
        {
            type: 'action',
            icon: FaListUl,
            iconSize: 18,
            tooltip: 'Lista desordenada',
            name: 'unordered-list',
            onClick: () => handleListInsert('unordered')
        },
        {
            type: 'action',
            icon: FaListOl,
            iconSize: 18,
            tooltip: 'Lista ordenada',
            name: 'ordered-list',
            onClick: () => handleListInsert('ordered')
        },
        {
            type: 'action',
            icon: FaListCheck,
            iconSize: 18,
            tooltip: 'Lista de tareas',
            name: 'task-list',
            onClick: () => handleListInsert('task')
        },
        {
            type: 'dropdown',
            icon: PiCodeBlockBold,
            iconSize: 20,
            tooltip: 'Bloque de código',
            name: 'codeblock',
            dropdownContent: <CodeLanguageSelector onSelect={handleCodeBlockSelect} />
        },
        {
            type: 'dropdown',
            icon: FaTable,
            iconSize: 18,
            tooltip: 'Tabla',
            name: 'table',
            dropdownContent: <TableRowsColumnsSelector onSelect={handleTableSelect} />
        },
        {
            type: 'dropdown',
            icon: FaRegImage,
            iconSize: 18,
            tooltip: 'Imagen',
            name: 'image',
            dropdownContent:  (
                <InputContent
                    fields={[
                        { name: 'alt', label: 'Texto alternativo', placeholder: 'Descripción' },
                        { name: 'url', label: 'URL de la imagen', placeholder: 'https://ejemplo.com/img.jpg' }
                    ]}
                    onSubmit={handleImageInsert}
                />
            )
        },
        {
            type: 'dropdown',
            icon: MdInsertEmoticon,
            iconSize: 21,
            tooltip: 'Emoticonos',
            name: 'emoji',
            dropdownContent: <EmojiPicker onSelect={handleEmojiSelect} />
        }
    ];

    return (
        <div className="border border-gray-300 bg-white px-2 py-1" ref={dropdownRef}>
            <div className="flex flex-wrap gap-1 items-center justify-between">
                <div className="flex flex-wrap gap-1 items-center">
                    {toolbarButtons.map((button, index) => (
                        <React.Fragment key={button.name}>
                            <div className="relative">
                                <button
                                    onClick={() => {
                                        if (button.type === 'action') {
                                            closeDropdown();
                                            button.onClick();
                                        } else {
                                            toggleDropdown(button.name);
                                        }
                                    }}
                                    className="p-2 hover:bg-gray-100 rounded transition-colors flex items-center justify-center"
                                    title={button.tooltip}
                                >
                                    <button.icon size={button.iconSize} />
                                </button>
                                {button.type === 'dropdown' && (
                                    <Dropdown isOpen={openDropdown === button.name}>
                                        {button.dropdownContent}
                                    </Dropdown>
                                )}
                            </div>
                            {(index === 0 || index === 6 || index === 9) && (
                                <div className="w-px h-6 bg-gray-300 mx-1" />
                            )}
                        </React.Fragment>
                    ))}
                </div>
                <div className="flex items-center ml-auto">
                    <ThemeSwitcher />
                </div>
            </div>
        </div>
    );
};

export default MarkdownToolbar;