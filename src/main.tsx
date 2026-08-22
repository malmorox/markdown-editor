import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MarkdownProvider } from "@contexts/MarkdownContext";
import { SettingsProvider } from "@contexts/SettingsContext";
import { EditorProvider } from "@contexts/EditorContext";
import { ThemeProvider } from "@contexts/ThemeContext";
import { ActiveFileProvider } from "@contexts/ActiveFileContext";
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider>
        <SettingsProvider>
        <MarkdownProvider>
        <EditorProvider>
        <ActiveFileProvider>
            <App />
        </ActiveFileProvider>
        </EditorProvider>
        </MarkdownProvider>
        </SettingsProvider>
        </ThemeProvider>
    </StrictMode>,
)
