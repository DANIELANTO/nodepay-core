import { useState, useRef, useEffect, useTransition } from 'react';
import { useAskTermsMutation, useAskInsightsMutation } from '../../store/api/aiApi';

type Message = { id: string; role: 'user' | 'ai'; text: string; source: 'rag' | 'sql' };

export const AIAssistantPanel = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [mode, setMode] = useState<'rag' | 'sql'>('rag');

    const [isPending, startTransition] = useTransition();

    const [askTerms] = useAskTermsMutation();
    const [askInsights] = useAskInsightsMutation();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isPending]);

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input.trim();
        setInput('');

        setMessages((prev) => [...prev, { id: Date.now().toString(), role: 'user', text: userMsg, source: mode }]);
        startTransition(async () => {

            try {
                let responseText = '';
                if (mode === 'rag') {
                    const res = await askTerms({ question: userMsg }).unwrap();
                    responseText = res.answer;
                } else {
                    const res = await askInsights({ question: userMsg }).unwrap();
                    responseText = res.insight;
                }

                setMessages((prev) => [...prev, { id: Date.now().toString(), role: 'ai', text: responseText, source: mode }]);
            } catch (error) {
                setMessages((prev) => [...prev, { id: Date.now().toString(), role: 'ai', text: '❌ Error de conexión con los microservicios de IA.', source: mode }]);
            }
        });

    };

    return (
        <>
            {/* Overlay oscuro de fondo */}
            {isOpen && <div className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm transition-opacity" onClick={onClose} />}

            {/* Panel lateral que se desliza */}
            <div className={`fixed inset-y-0 right-0 z-50 flex w-full sm:w-96 flex-col border-l border-gray-200 bg-white shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* Cabecera */}
                <div className="flex items-center justify-between border-b bg-slate-900 p-4 text-white">
                    <h3 className="font-semibold">🧠 Copiloto de NodePay</h3>
                    <button onClick={onClose} className="rounded-full p-1 hover:bg-slate-700">✕</button>
                </div>

                {/* Selector de Modo (RAG vs SQL) */}
                <div className="flex border-b bg-gray-50 p-2">
                    <button onClick={() => setMode('rag')} className={`flex-1 rounded-md py-1 text-sm font-medium transition-colors ${mode === 'rag' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:bg-gray-200'}`}>Términos (RAG)</button>
                    <button onClick={() => setMode('sql')} className={`flex-1 rounded-md py-1 text-sm font-medium transition-colors ${mode === 'sql' ? 'bg-white shadow text-emerald-600' : 'text-gray-500 hover:bg-gray-200'}`}>Datos (SQL)</button>
                </div>

                {/* Área de Mensajes */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                    {messages.length === 0 && (
                        <div className="mt-10 text-center text-sm text-gray-400">
                            {mode === 'rag' ? 'Pregúntame sobre las reglas y normativas de NodePay.' : 'Pregúntame sobre usuarios activos, saldos totales o estadísticas.'}
                        </div>
                    )}
                    {messages.map((m) => (
                        <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 shadow-sm border border-gray-100'}`}>
                                {m.text}
                            </div>
                        </div>
                    ))}

                    {isPending && (
                        <div className="flex justify-start">
                            <div className="max-w-[85%] rounded-2xl bg-white px-5 py-4 shadow-sm border border-gray-100 flex items-center space-x-2">
                                <span className="h-2 w-2 animate-bounce rounded-full bg-blue-400" style={{ animationDelay: '0ms' }}></span>
                                <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500" style={{ animationDelay: '150ms' }}></span>
                                <span className="h-2 w-2 animate-bounce rounded-full bg-blue-600" style={{ animationDelay: '300ms' }}></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Form */}
                <form onSubmit={handleSubmit} className="border-t bg-white p-4">
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Escribe tu consulta..."
                            className="w-full rounded-full border border-gray-300 bg-gray-50 py-2 pl-4 pr-12 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            disabled={isPending}
                        />
                        <button type="submit" disabled={isPending || !input.trim()} className="absolute right-1 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:bg-gray-300">
                            ↑
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};