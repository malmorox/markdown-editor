import ReactMarkdown from "react-markdown";

interface MarkdownInterpreterProps {
  content: string;
}

export default function MarkdownInterpreter({ content }: MarkdownInterpreterProps) {
  return (
    <div
      className="w-full h-[500px] border rounded-md p-4 overflow-auto bg-slate-950 text-slate-100 prose prose-invert max-w-none"
    >
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}