import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

interface MarkdownInterpreterProps {
  content: string;
}

export default function MarkdownInterpreter({ content }: MarkdownInterpreterProps) {
    return (
        <div className="w-full h-full">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}