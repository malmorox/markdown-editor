import React, { useState, useRef, useEffect } from 'react';
import TableRowsColumnsSelector from '@components/ui/TableRowsColumnsSelector';

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
    const headingOptions = [
        { label: 'Título 1', markdown: '# ', level: 1 },
        { label: 'Título 2', markdown: '## ', level: 2 },
        { label: 'Título 3', markdown: '### ', level: 3 },
        { label: 'Título 4', markdown: '#### ', level: 4 },
        { label: 'Título 5', markdown: '##### ', level: 5 },
        { label: 'Título 6', markdown: '###### ', level: 6 },
    ];

    // Configuración de lenguajes de código
    const codeLanguages = [
        'javascript', 'typescript', 'python', 'java', 'cpp', 'c', 'csharp',
        'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'html', 'css',
        'sql', 'bash', 'json', 'yaml', 'markdown'
    ];

    // Configuración de tipos de listas
    const listOptions = [
    { 
        label: 'Lista desordenada', 
        markdown: '- Elemento 1\n- Elemento 2\n- Elemento 3\n' 
    },
    { 
        label: 'Lista ordenada', 
        markdown: '1. Elemento 1\n2. Elemento 2\n3. Elemento 3\n' 
    },
    { 
        label: 'Lista de tareas', 
        markdown: '- [ ] Tarea 1\n- [ ] Tarea 2\n- [ ] Tarea 3\n' 
    },
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
    const handleTableSelect = (selection: { rows: number; cols: number }) => {
        const table = generateTable(selection.rows, selection.cols);
        onInsert(table);
        closeDropdown();
    };

    const handleHeadingSelect = (markdown: string) => {
        onInsert(markdown);
        closeDropdown();
    };

    const handleCodeBlockSelect = (language: string) => {
        onInsert(`\`\`\`${language}\n\n\`\`\`\n`, -4);
        closeDropdown();
    };

    const handleListSelect = (markdown: string) => {
        onInsert(markdown);
        closeDropdown();
    };

    // Botones simples sin dropdown
    const simpleButtons = [
        { label: 'B', tooltip: 'Negrita', markdown: '**negrita**', offset: -7 },
        { label: 'I', tooltip: 'Cursiva', markdown: '*cursiva*', offset: -6 },
        { label: 'S', tooltip: 'Tachado', markdown: '~tachado~', offset: -8 },
        { label: '<>', tooltip: 'Código inline', markdown: '`código`', offset: -7 },
        { label: '🔗', tooltip: 'Enlace', markdown: '[texto](url)', offset: -11 },
        { label: '🖼️', tooltip: 'Imagen', markdown: '![alt](url)', offset: -10 },
        { label: '"', tooltip: 'Cita', markdown: '> cita', offset: 0 },
        { label: '—', tooltip: 'Línea horizontal', markdown: '\n---\n', offset: 0 },
    ];

    return (
        <div className="border border-gray-300 rounded-lg bg-white p-2 mb-4" ref={dropdownRef}>
            <div className="flex flex-wrap gap-1 items-center">
                {/* Dropdown de Encabezados */}
                <div className="relative">
                    <button
                        onClick={() => toggleDropdown('heading')}
                        className="p-2 hover:bg-gray-100 rounded transition-colors font-semibold"
                        title="Encabezados"
                    >
                        H
                    </button>
                    <Dropdown isOpen={openDropdown === 'heading'}>
                        <div className="min-w-[140px]">
                            {headingOptions.map((option) => (
                                <button
                                    key={option.level}
                                    onClick={() => handleHeadingSelect(option.markdown)}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                                    style={{ fontSize: `${20 - option.level * 2}px` }}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </Dropdown>
                </div>

                <div className="w-px h-6 bg-gray-300 mx-1" />

                {/* Botones simples */}
                {simpleButtons.map((button, index) => (
                    <button
                        key={index}
                        onClick={() => onInsert(button.markdown, button.offset)}
                        className="p-2 hover:bg-gray-100 rounded transition-colors font-semibold"
                        title={button.tooltip}
                    >
                        {button.label}
                    </button>
                ))}

                <div className="w-px h-6 bg-gray-300 mx-1" />

                {/* Dropdown de Listas */}
                <div className="relative">
                    <button
                        onClick={() => toggleDropdown('list')}
                        className="p-2 hover:bg-gray-100 rounded transition-colors font-semibold"
                        title="Listas"
                    >
                        ☰
                    </button>
                    <Dropdown isOpen={openDropdown === 'list'}>
                        <div className="min-w-[180px]">
                            {listOptions.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleListSelect(option.markdown)}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </Dropdown>
                </div>

                {/* Dropdown de bloque de código */}
                <div className="relative">
                    <button
                        onClick={() => toggleDropdown('code')}
                        className="p-2 hover:bg-gray-100 rounded transition-colors font-mono font-semibold"
                        title="Bloque de código"
                    >
                        {'</>'}
                    </button>
                    <Dropdown isOpen={openDropdown === 'code'}>
                        <div className="max-h-60 overflow-y-auto min-w-[140px]">
                            {codeLanguages.map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => handleCodeBlockSelect(lang)}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm font-mono"
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                    </Dropdown>
                </div>

                {/* Dropdown de tabla */}
                <div className="relative">
                    <button
                        onClick={() => toggleDropdown('table')}
                        className="p-2 hover:bg-gray-100 rounded transition-colors font-semibold"
                        title="Insertar tabla"
                    >
                        ⊞
                    </button>
                    <Dropdown isOpen={openDropdown === 'table'}>
                        <TableRowsColumnsSelector onSelect={handleTableSelect} />
                    </Dropdown>
                </div>
            </div>
        </div>
    );
};

export default MarkdownToolbar;