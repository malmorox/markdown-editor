import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import { useMarkdown } from "../hooks/useMarkdown";
import { useTheme } from "../hooks/useTheme";
import { getMarkdownComponents } from "../config/markdownComponents";


const MarkdownInterpreter = () => {
    const { markdown } = useMarkdown();
    const { theme } = useTheme();

    const components = getMarkdownComponents(theme)
    const isDark = theme === "vs-dark";

    return (
        <div className={`w-full h-full overflow-auto ${
            isDark ? "bg-[#1e1e1e]" : "bg-white"
        }`}>
            <div className="p-6 max-w-4xl mx-auto break-words overflow-wrap-anywhere">
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