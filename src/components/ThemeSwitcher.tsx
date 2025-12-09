import { useTheme } from "@hooks/useTheme";
import type { MonacoTheme } from "@/types/monaco";

export default function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();

    const isDark = theme === "vs-dark";

    const handleToggle = () => {
        const nextTheme: MonacoTheme = isDark ? "light" : "vs-dark";
        setTheme(nextTheme);
    };

    return (
        <button
            onClick={handleToggle}
            className={`
                relative w-11 h-6 flex items-center rounded-md
                cursor-pointer transition-colors
                ${isDark ? "bg-[#3e3e42]" : "bg-gray-300"}
            `}
        >
            <span
                className={`
                    absolute w-4.5 h-4.5 bg-white rounded-sm shadow
                    transition-transform
                    ${isDark ? "translate-x-[22.5px]" : "translate-x-[3.5px]"}
                `}
            />
        </button>
    );
}