import { useContext } from "react";
import { MarkdownContext } from "@contexts/MarkdownContext";

export function useMarkdown() {
    const context = useContext(MarkdownContext);
    if (!context) throw new Error("useTheme must be used inside <ThemeProvider>");
    return context;
}