import { useState } from 'react';

interface CodeLanguageSelectorProps {
    onSelect: (language: string) => void;
}

const CodeLanguageSelector = ({ onSelect }: CodeLanguageSelectorProps) => {
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [customLanguage, setCustomLanguage] = useState('');

    // 12 lenguajes más comunes
    const popularLanguages = [
        { name: 'JavaScript', value: 'javascript' },
        { name: 'TypeScript', value: 'typescript' },
        { name: 'Python', value: 'python' },
        { name: 'Java', value: 'java' },
        { name: 'C++', value: 'cpp' },
        { name: 'C#', value: 'csharp' },
        { name: 'HTML', value: 'html' },
        { name: 'CSS', value: 'css' },
        { name: 'SQL', value: 'sql' },
        { name: 'Bash', value: 'bash' },
        { name: 'JSON', value: 'json' },
        { name: 'PHP', value: 'php' }
    ];

    const handleLanguageClick = (language: string) => {
        onSelect(language);
        setShowCustomInput(false);
        setCustomLanguage('');
    };

    const handleCustomSubmit = () => {
        if (customLanguage.trim()) {
            onSelect(customLanguage.trim());
            setCustomLanguage('');
            setShowCustomInput(false);
        }
    };

    if (showCustomInput) {
        return (
            <div className="p-3 min-w-[280px]">
                <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                        Especificar lenguaje
                    </label>
                    <input
                        type="text"
                        value={customLanguage}
                        onChange={(e) => setCustomLanguage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleCustomSubmit()}
                        placeholder="ruby, go, rust..."
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleCustomSubmit}
                        className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                        Insertar
                    </button>
                    <button
                        onClick={() => {
                            setShowCustomInput(false);
                            setCustomLanguage('');
                        }}
                        className="flex-1 bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-300 transition-colors"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-3 min-w-[280px]">
            <div className="grid grid-cols-3 gap-2 mb-3">
                {popularLanguages.map((lang) => (
                    <button
                        key={lang.value}
                        onClick={() => handleLanguageClick(lang.value)}
                        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-blue-50 hover:border-blue-400 transition-all"
                    >
                        {lang.name}
                    </button>
                ))}
            </div>
            
            <div className="pt-2 border-t border-gray-200">
                <button
                    onClick={() => setShowCustomInput(true)}
                    className="w-full px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
                >
                    Otro lenguaje...
                </button>
            </div>
        </div>
    );
};

export default CodeLanguageSelector;