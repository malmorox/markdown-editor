import { useState } from "react";
import MarkdownEditor from "./components/MarkdownEditor";
import MarkdownInterpreter from "./components/MarkdownInterpreter";

type MonacoTheme = "vs-dark" | "light" | "hc-black";

export default function App() {
  const [markdown, setMarkdown] = useState<string>("## Escribe tu markdown aquí");
  const [theme, setTheme] = useState<MonacoTheme>("vs-dark");

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "16px",
        backgroundColor: "#020617",
        color: "white",
        boxSizing: "border-box",
      }}
    >
      {/* Selector de tema */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: "18px", fontWeight: 600 }}>Markdown Editor</h1>

        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as MonacoTheme)}
        >
          <option value="vs-dark">Oscuro</option>
          <option value="light">Claro</option>
          <option value="hc-black">Alto contraste</option>
        </select>
      </div>

      {/* Editor + Intérprete */}
      <div style={{ display: "flex", gap: "16px", flex: 1 }}>
        <div style={{ width: "50%" }}>
          <MarkdownEditor
            value={markdown}
            onChange={setMarkdown}
            theme={theme}
          />
        </div>

        <div style={{ width: "50%" }}>
          <MarkdownInterpreter content={markdown} />
        </div>
      </div>
    </div>
  );
}