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
            {isOpen && <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300" onClick={onClose} />}

            {/* Panel lateral que se desliza */}
            <div className={`fixed inset-y-0 right-0 z-50 flex w-full sm:w-96 flex-col border-l border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shadow-2xl transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* Cabecera */}
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900-elevated p-5 text-slate-900 dark:text-slate-50">
                    <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                        <span className="text-amber-600 dark:text-amber-500">✨</span> NodePay Copilot
                    </h3>
                    <button onClick={onClose} className="rounded-full p-2 hover:bg-white/5 transition-colors text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-slate-50 outline-none focus-visible:ring-2 focus-visible:ring-amber-500">✕</button>
                </div>

                {/* Selector de Modo (RAG vs SQL) */}
                <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900-elevated p-3 gap-2">
                    <button onClick={() => setMode('rag')} className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${mode === 'rag' ? 'bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-500 shadow-glow-sm' : 'text-slate-500 dark:text-slate-400 hover:bg-white/5'}`}>Terms (RAG)</button>
                    <button onClick={() => setMode('sql')} className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${mode === 'sql' ? 'bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-500 shadow-glow-sm' : 'text-slate-500 dark:text-slate-400 hover:bg-white/5'}`}>Data (SQL)</button>
                </div>

                {/* Área de Mensajes */}
                <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50 dark:bg-slate-900">
                    {messages.length === 0 && (
                        <div className="mt-10 text-center text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900-elevated p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                            {mode === 'rag' ? 'Ask me about NodePay rules and regulations.' : 'Ask me about active users, total balances or statistics.'}
                        </div>
                    )}
                    {messages.map((m) => (
                        <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] rounded-2xl px-5 py-3 text-sm ${m.role === 'user' ? 'bg-amber-500/15 text-amber-600 dark:text-amber-500 border border-amber-500/20' : 'glass-card'}`}>
                                {m.text}
                            </div>
                        </div>
                    ))}

                    {isPending && (
                        <div className="flex justify-start">
                            <div className="max-w-[85%] glass-card px-5 py-4 flex items-center space-x-2">
                                <span className="h-2 w-2 rounded-full bg-amber-500/60 animate-pulse" style={{ animationDelay: '0ms' }}></span>
                                <span className="h-2 w-2 rounded-full bg-amber-500/80 animate-pulse" style={{ animationDelay: '150ms' }}></span>
                                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" style={{ animationDelay: '300ms' }}></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Form */}
                <form onSubmit={handleSubmit} className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900-elevated p-5">
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask a question..."
                            className="input-glass w-full rounded-full pl-5 pr-12"
                            disabled={isPending}
                        />
                        <button type="submit" disabled={isPending || !input.trim()} className="absolute right-2 flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-surface-elevated transition-all duration-200 hover:brightness-110 disabled:bg-slate-50 dark:bg-slate-900 disabled:text-slate-500 dark:text-slate-400 disabled:border disabled:border-slate-200 dark:border-slate-800 outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:ring-offset-slate-800">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};