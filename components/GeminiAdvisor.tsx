import React, { useState } from 'react';
import { generateShoeCareTips } from '../services/geminiService';
import { Sparkles, Loader2, BookOpen } from 'lucide-react';

interface GeminiAdvisorProps {
    visible: boolean;
}

export const GeminiAdvisor: React.FC<GeminiAdvisorProps> = ({ visible }) => {
    const [tips, setTips] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [hasAsked, setHasAsked] = useState(false);

    const handleAsk = async () => {
        setLoading(true);
        const result = await generateShoeCareTips();
        setTips(result);
        setLoading(false);
        setHasAsked(true);
    };

    if (!visible) return null;

    return (
        <div className="mt-8 bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-6 shadow-md max-w-2xl mx-auto">
            <div className="flex items-start gap-4">
                <div className="bg-indigo-600 p-3 rounded-full text-white shadow-lg">
                    <Sparkles size={24} />
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-indigo-900 mb-1">
                        Control de Calidad & Consejos
                    </h3>
                    <p className="text-indigo-700 text-sm mb-4">
                        ¡Gran trabajo! La reparación ha sido exitosa. Consulta a nuestra IA Experta en Zapatería para aprender a mantener estos resultados.
                    </p>

                    {!hasAsked ? (
                        <button 
                            onClick={handleAsk}
                            disabled={loading}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-70"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : <BookOpen size={18} />}
                            {loading ? "Generando consejos..." : "Obtener certificado y consejos"}
                        </button>
                    ) : (
                        <div className="prose prose-sm text-gray-700 bg-white p-4 rounded-lg border border-indigo-100 shadow-inner max-h-60 overflow-y-auto">
                            {/* Simple Markdown rendering replacement since we don't have a markdown lib */}
                            {tips.split('\n').map((line, i) => (
                                <p key={i} className={`mb-2 ${line.startsWith('#') ? 'font-bold text-indigo-800' : ''} ${line.startsWith('-') || line.match(/^\d\./) ? 'ml-4' : ''}`}>
                                    {line.replace(/^[#*-]\s?/, '')}
                                </p>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};