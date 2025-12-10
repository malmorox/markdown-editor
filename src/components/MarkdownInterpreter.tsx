import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import { useMarkdown } from "@hooks/useMarkdown";
import { useTheme } from "@hooks/useTheme";
import { getMarkdownComponents } from "@config/markdownComponents";

// Interprete del código Markdown que viene del contexto (lo captura del editor). Muestra por pantalla la salida final con el tema seleccionado.
const MarkdownInterpreter = () => {
    const { markdown } = useMarkdown();
    const { theme } = useTheme();
    // Dependiendo si es claro u oscuro los componentes de salida del markdown seran de un color u otro, que se lo pasamos a la libreria que interpreta.
    const components = getMarkdownComponents(theme)
    const isDark = theme === "vs-dark";

    return (
        <div className={`w-full h-full overflow-auto ${
            isDark ? "bg-[#2d2d30]" : "bg-white"
        }`}>
            <div className="p-6 max-w-4xl mx-auto wrap-break-word overflow-wrap-anywhere">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkBreaks]}
                    rehypePlugins={[rehypeRaw]}
                    components={components}
                >
                    {markdown}
                </ReactMarkdown>
            </div>
        </div>
    );
}

export default MarkdownInterpreter