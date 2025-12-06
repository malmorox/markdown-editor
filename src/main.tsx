import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MarkdownProvider } from "./contexts/MarkdownContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider>
            <MarkdownProvider>
                <App />
            </MarkdownProvider>
        </ThemeProvider>
    </StrictMode>,
)
