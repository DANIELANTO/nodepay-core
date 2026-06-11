import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useUiStore } from '../store/uiStore';
import { AIAssistantPanel } from '../components/ai/AIAssistantPanel';

export const DashboardLayout = () => {
    const { logout } = useAuthStore();
    const { theme, toggleTheme } = useUiStore();
    const location = useLocation();

    const [isAIOpen, setIsAIOpen] = useState(false);

    return (
        <div className="relative min-h-screen p-4 sm:p-8 overflow-hidden">
            {/* Ambient Orbs */}
            <div className="fixed top-[-10%] right-[10%] w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[150px] pointer-events-none z-0" />
            <div className="fixed bottom-[-10%] left-[5%] w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none z-0" />

            <div className="mx-auto max-w-6xl relative z-10">

                {/* Header Global del Dashboard */}
                <div className="mb-6 sm:mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between glass-card p-6 sm:p-8">
                    <div className="w-full sm:w-auto">
                        <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-slate-50">Administration Panel</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 sm:mb-4 mt-2">Manage access and view NodePay regulations.</p>

                        <div className="flex space-x-6 sm:space-x-8 border-b border-border-subtle overflow-x-auto whitespace-nowrap pb-1">
                            <Link
                                to="/dashboard/users"
                                className={`pb-3 text-sm font-medium transition-all duration-200 border-b-2 outline-none focus-visible:text-accent ${location.pathname.includes('/users')
                                    ? 'border-accent text-accent'
                                    : 'border-transparent text-muted-foreground hover:border-border-hover hover:text-foreground'
                                    }`}
                            >
                                User List
                            </Link>
                            <Link
                                to="/dashboard/terms"
                                className={`pb-3 text-sm font-medium transition-all duration-200 border-b-2 outline-none focus-visible:text-accent ${location.pathname.includes('/terms')
                                    ? 'border-accent text-accent'
                                    : 'border-transparent text-muted-foreground hover:border-border-hover hover:text-foreground'
                                    }`}
                            >
                                Terms and Conditions
                            </Link>
                        </div>
                    </div>

                    <div className="mt-6 sm:mt-0 w-full sm:w-auto flex items-center gap-3">
                        <button
                            onClick={toggleTheme}
                            className="btn-secondary p-3 flex items-center justify-center rounded-lg"
                            aria-label="Toggle Theme"
                            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
                        >
                            {theme === 'dark' ? (
                                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            )}
                        </button>

                        <button
                            onClick={logout}
                            className="w-full sm:w-auto btn-secondary text-sm flex items-center justify-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            Logout
                        </button>
                    </div>
                </div>

                <div className="mb-8">
                    <Outlet />
                </div>
            </div>

            {/* Botón Flotante (FAB) para abrir la Inteligencia Artificial */}
            <button
                onClick={() => setIsAIOpen(true)}
                className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-surface border border-border-subtle text-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:border-accent/30 hover:shadow-glow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer"
                aria-label="Open AI Copilot"
            >
                ✨
            </button>

            {/* El componente del Panel Lateral */}
            <AIAssistantPanel isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
        </div>
    );
};