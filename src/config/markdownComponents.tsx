import type { Components } from "react-markdown";
import type { MonacoTheme } from "@/types/monaco";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';

export const getMarkdownComponents = (theme: MonacoTheme): Components => {
    const isDark = theme === "vs-dark";
    
    return {
        h1: ({ children, node }) => {
            const isFirst = node?.position?.start.line === 1;
            
            return (
                <h1 className={`text-4xl font-bold mb-4 border-b pb-2 ${
                    isFirst ? 'mt-0' : 'mt-8'
                } ${
                    isDark 
                        ? "text-white border-gray-700" 
                        : "text-gray-900 border-gray-300"
                }`}>
                    {children}
                </h1>
            );
        },
        h2: ({ children, node }) => {
            const isFirst = node?.position?.start.line === 1;
            
            return (
                <h2 className={`text-3xl font-bold mb-3 ${
                    isFirst ? 'mt-0' : 'mt-6'
                } ${
                    isDark ? "text-white" : "text-gray-900"
                }`}>
                    {children}
                </h2>
            );
        },
        h3: ({ children, node }) => {
            const isFirst = node?.position?.start.line === 1;
            
            return (
                <h3 className={`text-2xl font-bold mb-2 ${
                    isFirst ? 'mt-0' : 'mt-5'
                } ${
                    isDark ? "text-white" : "text-gray-900"
                }`}>
                    {children}
                </h3>
            );
        },
        h4: ({ children, node }) => {
            const isFirst = node?.position?.start.line === 1;
            
            return (
                <h4 className={`text-xl font-semibold mb-2 ${
                    isFirst ? 'mt-0' : 'mt-4'
                } ${
                    isDark ? "text-gray-200" : "text-gray-800"
                }`}>
                    {children}
                </h4>
            );
        },
        h5: ({ children, node }) => {
            const isFirst = node?.position?.start.line === 1;
            
            return (
                <h5 className={`text-lg font-semibold mb-2 ${
                    isFirst ? 'mt-0' : 'mt-3'
                } ${
                    isDark ? "text-gray-200" : "text-gray-800"
                }`}>
                    {children}
                </h5>
            );
        },
        h6: ({ children, node }) => {
            const isFirst = node?.position?.start.line === 1;
            
            return (
                <h6 className={`text-base font-semibold mb-1 ${
                    isFirst ? 'mt-0' : 'mt-2'
                } ${
                    isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                    {children}
                </h6>
            );
        },
        p: ({ children }) => (
            <p className={`my-4 leading-relaxed ${
                isDark ? "text-gray-200" : "text-gray-700"
            }`}>
                {children}
            </p>
        ),
        a: ({ href, children }) => (
            <a
                href={href}
                className="text-sky-500 hover:text-sky-600 hover:underline transition-colors"
                target="_blank"
                rel="noopener noreferrer"
            >
                {children}
            </a>
        ),
        ul: ({ children }) => (
            <ul className={`list-disc list-inside my-4 space-y-2 ${
                isDark ? "text-gray-200" : "text-gray-700"
            }`}>
                {children}
            </ul>
        ),
        ol: ({ children }) => (
            <ol className={`list-decimal list-inside my-4 space-y-2 ${
                isDark ? "text-gray-200" : "text-gray-700"
            }`}>
                {children}
            </ol>
        ),
        li: ({ children }) => (
            <li className="ml-4">{children}</li>
        ),
        blockquote: ({ children }) => (
            <blockquote className={`border-l-4 border-sky-500 pl-4 my-4 italic py-2 ${
                isDark 
                    ? "text-gray-300 bg-gray-800/50" 
                    : "text-gray-600 bg-gray-100/50"
            }`}>
                {children}
            </blockquote>
        ),
        code: ({ node, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            const isInline = !className;
            
            return isInline ? (
                <code className={`px-1.5 py-0.5 rounded text-sm font-mono ${
                    isDark 
                        ? "bg-gray-800 text-pink-400" 
                        : "bg-gray-200 text-pink-600"
                }`}>
                    {children}
                </code>
            ) : (
                <SyntaxHighlighter
                    style={isDark ? vscDarkPlus : prism}
                    language={language}
                    PreTag="div"
                    className="my-4 rounded-lg overflow-hidden"
                    customStyle={{
                        margin: 0,
                        padding: '1rem',
                        fontSize: '0.875rem',
                        backgroundColor: isDark ? '#0d1117' : '#f5f2f0'
                    }}
                >
                    {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
            );
        },
        pre: ({ children }) => (
            <pre className="my-4">{children}</pre>
        ),
        table: ({ children, node, ...props }) => {
            // Si la tabla tiene atributo style, es HTML inline
            const style = (node?.properties?.style as string) || '';
            const hasInlineStyle = style.includes('width');
            
            if (hasInlineStyle) {
                return (
                    <div className="overflow-x-auto my-4">
                        <table {...props}>{children}</table>
                    </div>
                );
            }
            
            return (
                <div className="overflow-x-auto my-4">
                    <table className={`border ${
                        isDark ? "border-gray-700" : "border-gray-300"
                    }`}>
                        {children}
                    </table>
                </div>
            );
        },
        thead: ({ children }) => (
            <thead className={isDark ? "bg-gray-800" : "bg-gray-200"}>
                {children}
            </thead>
        ),
        tbody: ({ children }) => (
            <tbody className={`divide-y ${
                isDark ? "divide-gray-700" : "divide-gray-300"
            }`}>
                {children}
            </tbody>
        ),
        tr: ({ children }) => (
            <tr className={`border-b ${
                isDark ? "border-gray-700" : "border-gray-300"
            }`}>
                {children}
            </tr>
        ),
        th: ({ children }) => (
            <th className={`px-4 py-2 text-left font-semibold border ${
                isDark 
                    ? "text-gray-200 border-gray-700" 
                    : "text-gray-900 border-gray-300"
            }`}>
                {children}
            </th>
        ),
        td: ({ children }) => (
            <td className={`px-4 py-2 border ${
                isDark 
                    ? "text-gray-300 border-gray-700" 
                    : "text-gray-700 border-gray-300"
            }`}>
                {children}
            </td>
        ),
        img: ({ src, alt }) => (
            <img
                src={src}
                alt={alt}
                className="rounded-lg shadow-lg my-4 max-w-full"
            />
        ),
        hr: () => (
            <hr className={`my-8 ${
                isDark ? "border-gray-700" : "border-gray-300"
            }`} />
        ),
        strong: ({ children }) => (
            <strong className={`font-bold ${
                isDark ? "text-white" : "text-gray-900"
            }`}>
                {children}
            </strong>
        ),
        em: ({ children }) => (
            <em className={`italic ${
                isDark ? "text-gray-200" : "text-gray-700"
            }`}>
                {children}
            </em>
        ),
    };
};

// Para usar con tema fijo
export const markdownComponentsDark = getMarkdownComponents("vs-dark");
export const markdownComponentsLight = getMarkdownComponents("light");