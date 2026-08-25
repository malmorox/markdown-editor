import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MarkdownProvider } from "@contexts/MarkdownContext";
import { SettingsProvider } from "@contexts/SettingsContext";
import { EditorProvider } from "@contexts/EditorContext";
import { ThemeProvider } from "@contexts/ThemeContext";
import App from './App.tsx'
import './index.css'
import '@utils/analytics';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider>
        <SettingsProvider>
        <MarkdownProvider>
        <EditorProvider>
            <App />
        </EditorProvider>
        </MarkdownProvider>
        </SettingsProvider>
        </ThemeProvider>
    </StrictMode>,
)
