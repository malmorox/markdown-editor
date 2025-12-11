import { useCallback } from 'react';

interface MarkdownActionsProps {
    onInsert: (markdown: string, cursorOffset?: number) => void;
}

export const useMarkdownActions = ({ onInsert }: MarkdownActionsProps) => {
    // Función para generar tablas
    const generateTable = useCallback((rows: number, cols: number) => {
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
    }, []);

    // Acciones de formato
    const insertHeading = useCallback((level: 1 | 2 | 3 | 4 | 5 | 6, label: string) => {
        onInsert(`${'#'.repeat(level)} ${label}`);
    }, [onInsert]);

    const insertBold = useCallback(() => {
        const text = 'texto en negrita';
        onInsert(`**${text}**`);
    }, [onInsert]);

    const insertItalic = useCallback(() => {
        const text = 'texto en cursiva';
        onInsert(`*${text}*`);
    }, [onInsert]);

    const insertStrikethrough = useCallback(() => {
        const text = 'texto tachado';
        onInsert(`~${text}~`);
    }, [onInsert]);

    const insertQuote = useCallback(() => {
        const text = 'texto citado';
        onInsert(`> ${text}`);
    }, [onInsert]);

    const insertCode = useCallback(() => {
        const text = 'enter code here';
        onInsert(`\`${text}\``);
    }, [onInsert]);

    const insertLink = useCallback((text?: string, url?: string) => {
        const linkText = text || 'texto del enlace';
        const linkUrl = url || 'https://ejemplo.com';
        onInsert(`[${linkText}](${linkUrl})`);
    }, [onInsert]);

    const insertImage = useCallback((alt?: string, url?: string) => {
        const altText = alt || 'descripción';
        const imageUrl = url || 'https://ejemplo.com/imagen.jpg';
        onInsert(`![${altText}](${imageUrl})`);
    }, [onInsert]);

    // Listas
    const insertUnorderedList = useCallback(() => {
        const content = '- Elemento 1\n- Elemento 2\n- Elemento 3\n';
        onInsert(content);
    }, [onInsert]);

    const insertOrderedList = useCallback(() => {
        const content = '1. Elemento 1\n2. Elemento 2\n3. Elemento 3\n';
        onInsert(content);
    }, [onInsert]);

    const insertTaskList = useCallback(() => {
        const content = '- [ ] Tarea 1\n- [ ] Tarea 2\n- [ ] Tarea 3\n';
        onInsert(content);
    }, [onInsert]);

    // Bloques de código
    const insertCodeBlock = useCallback((language: string = 'javascript') => {
        onInsert(`\`\`\`${language}\n\n\`\`\`\n`, -4);
    }, [onInsert]);

    // Tabla
    const insertTable = useCallback((rows: number = 3, cols: number = 3) => {
        const table = generateTable(rows, cols);
        onInsert(table);
    }, [onInsert, generateTable]);

    // Emoji
    const insertEmoji = useCallback((emoji: string) => {
        onInsert(emoji);
    }, [onInsert]);

    // Divisor
    const insertDivider = useCallback(() => {
        onInsert('\n---\n');
    }, [onInsert]);

    return {
        // Formato de texto
        insertHeading,
        insertBold,
        insertItalic,
        insertStrikethrough,
        insertQuote,
        insertCode,
        
        // Enlaces y medios
        insertLink,
        insertImage,
        
        // Listas
        insertUnorderedList,
        insertOrderedList,
        insertTaskList,
        
        // Bloques
        insertCodeBlock,
        insertTable,
        
        // Otros
        insertEmoji,
        insertDivider,
    };
};