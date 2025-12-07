import { useContext } from "react";
import { EditorContext } from "@contexts/EditorContext";

export const useEditor = () => {
    const context = useContext(EditorContext);
    if (!context) throw new Error("useEditor debe usarse dentro de EditorProvider");
    return context;
};