import React, { useState, useRef, useEffect } from 'react';
import { 
    IoCode, 
    IoCodeSlash, 
    IoImageOutline, 
    IoListOutline,
} from 'react-icons/io5';
import { HiBold } from "react-icons/hi2";
import { FaItalic } from "react-icons/fa";
import { FaStrikethrough } from "react-icons/fa";
import TableRowsColumnsSelector from '@components/ui/TableRowsColumnsSelector';

interface MarkdownToolbarProps {
    onInsert: (markdown: string, cursorOffset?: number) => void;
}

interface DropdownProps {
    isOpen: boolean;
    children: React.ReactNode;
}

// Tamaño de los iconos 
const iconSize = 28;

const Dropdown = ({ isOpen, children }: DropdownProps) => {
    if (!isOpen) return null;
    
    return (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
            {children}
        </div>
    );
};

const DropdownInputContent = ({ 
    fields, 
    onSubmit, 
    buttonText = "Insertar" 
}: { 
    fields: { name: string; label: string; placeholder: string; defaultValue?: string }[];
    onSubmit: (values: Record<string, string>) => void;
    buttonText?: string;
}) => {
    const [values, setValues] = useState<Record<string, string>>({});

    const handleChange = (name: string, value: string) => {
        setValues(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitClick = () => {
        const finalValues: Record<string, string> = {};
        fields.forEach(field => {
            finalValues[field.name] = values[field.name] || field.defaultValue || '';
        });
        onSubmit(finalValues);
        setValues({});
    };

    return (
        <div className="p-3 min-w-[250px]">
            <div className="space-y-2">
                {fields.map(field => (
                    <div key={field.name}>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                            {field.label}
                        </label>
                        <input
                            type="text"
                            value={values[field.name] || ''}
                            onChange={(e) => handleChange(field.name, e.target.value)}
                            placeholder={field.placeholder}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                ))}
                <button
                    onClick={handleSubmitClick}
                    className="w-full bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 transition-colors mt-3"
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
};

const DropdownHeadingContent = ({
    options,
    onSelect
}: {
    options: { label: string; markdown: string; level: number }[];
    onSelect: (markdown: string) => void;
}) => (
    <div className="p-2 min-w-[150px]">
        {options.map((h) => (
            <button
                key={h.level}
                className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 rounded"
                onClick={() => onSelect(`{h.markdown} {h.label}`)}
            >
                {h.label}
            </button>
        ))}
    </div>
);

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
    const headingOptions = [
        { label: 'Título 1', markdown: '#', level: 1 },
        { label: 'Título 2', markdown: '##', level: 2 },
        { label: 'Título 3', markdown: '###', level: 3 },
        { label: 'Título 4', markdown: '####', level: 4 },
        { label: 'Título 5', markdown: '#####', level: 5 },
        { label: 'Título 6', markdown: '######', level: 6 },
    ];

    // Configuración de lenguajes de código
    const codeLanguages = [
        'javascript', 'typescript', 'python', 'java', 'cpp', 'c', 'csharp',
        'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'html', 'css',
        'sql', 'bash', 'json', 'yaml', 'markdown'
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

    const handleCodeInsert = (values: Record<string, string>) => {
        const code = values.code || 'código';
        onInsert(`\`${code}\``);
        closeDropdown();
    };

    const handleLinkInsert = (values: Record<string, string>) => {
        const text = values.text || 'texto del enlace';
        const url = values.url || 'https://ejemplo.com';
        onInsert(`[${text}](${url})`);
        closeDropdown();
    };

    const handleImageInsert = (values: Record<string, string>) => {
        const alt = values.alt || 'descripción';
        const url = values.url || 'https://ejemplo.com/imagen.jpg';
        onInsert(`![${alt}](${url})`);
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

    const handleDividerInsert = () => {
        onInsert('\n---\n');
        closeDropdown();
    };

    // Botones simples sin dropdown
    const toolbarButtons = [
        {
            icon: 'H',
            tooltip: 'Encabezado',
            name: 'heading',
            dropdownContent: (
                
            )
        },
        {
            icon: HiBold,
            tooltip: 'Negrita',
            name: 'bold',
            hasDropdown: false,
            onClick: () => handleBoldInsert()
        },
        {
            icon: FaItalic,
            tooltip: 'Cursiva',
            name: 'italic',
            hasDropdown: false,
            onClick: () => handleItalicInsert()
        },
        {
            icon: FaStrikethrough,
            tooltip: 'Tachado',
            name: 'strikethrough',
            hasDropdown: false,
            onClick: () => handleStrikethroughInsert()
        },
        {
            icon: IoCode,
            tooltip: 'Código inline',
            name: 'code',
            dropdownContent: (
                <DropdownInputContent
                    fields={[
                        { name: 'code', label: 'Código', placeholder: 'const x = 10;' }
                    ]}
                    onSubmit={handleCodeInsert}
                />
            )
        },
        {
            icon: IoLinkOutline,
            tooltip: 'Enlace',
            name: 'link',
            hasDropdown: false,
            onClick: () => handleListSelect()
        },
        {
            icon: IoImageOutline,
            tooltip: 'Imagen',
            name: 'image',
            content: (
                <DropdownInputContent
                    fields={[
                        { name: 'alt', label: 'Texto alternativo', placeholder: 'Descripción' },
                        { name: 'url', label: 'URL de la imagen', placeholder: 'https://ejemplo.com/img.jpg' }
                    ]}
                    onSubmit={handleImageInsert}
                />
            )
        },
        {
            icon: IoListOutline,
            tooltip: 'Lista desordenada',
            name: 'unordered-list',
            hasDropdown: false,
            onClick: () => handleListInsert('unordered')
        },
        {
            icon: IoListOutline,
            tooltip: 'Lista ordenada',
            name: 'ordered-list',
            hasDropdown: false,
            onClick: () => handleListInsert('ordered')
        },
        {
            icon: IoListOutline,
            tooltip: 'Lista de tareas',
            name: 'task-list',
            hasDropdown: false,
            onClick: () => handleListInsert('task')
        },
        {
            icon: IoCodeSlash,
            tooltip: 'Bloque de código',
            name: 'codeblock',
            dropdownContent: <CodeBlockContent languages={codeLanguages} onInsert={handleCodeBlockInsert} />
        },
        {
            icon: '⊞',
            tooltip: 'Tabla',
            name: 'table',
            dropdownContent: <TableRowsColumnsSelector onSelect={handleTableSelect} />
        },
        {
            icon: IoChatboxOutline,
            tooltip: 'Cita',
            name: 'quote',
            dropdownContent: <QuoteContent onInsert={handleQuoteInsert} />
        },
        {
            icon: IoRemoveOutline,
            tooltip: 'Línea horizontal',
            name: 'divider',
            dropdownContent: <DividerContent onInsert={handleDividerInsert} />
        },
    ];

    return (
        <div className="border border-gray-300 rounded-lg bg-white p-2 mb-4" ref={dropdownRef}>
            <div className="flex flex-wrap gap-1 items-center">
                {toolbarButtons.map((button) => (
                    <React.Fragment key={button.name}>
                        <div className="relative">
                            <button
                                onClick={() => toggleDropdown(button.name)}
                                className="p-2 hover:bg-gray-100 rounded transition-colors flex items-center justify-center"
                                title={button.tooltip}
                            >
                                <button.icon size={iconSize} />
                            </button>
                            <Dropdown isOpen={openDropdown === button.name}>
                                {button.content}
                            </Dropdown>
                        </div>
                        {/*{(index === 0 || index === 6 || index === 9) && (
                            <div className="w-px h-6 bg-gray-300 mx-1" />
                        )}*/}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default MarkdownToolbar;