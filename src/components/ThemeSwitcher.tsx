import { useTheme } from "@hooks/useTheme";
import type { MonacoTheme } from "@types/monaco";

export default function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();

    return (
        <select
            className="text-black p-1 rounded"
            value={theme}
            onChange={(e) => setTheme(e.target.value as MonacoTheme)}
        >
            <option value="vs-dark">Oscuro</option>
            <option value="light">Claro</option>
        </select>
    );
}