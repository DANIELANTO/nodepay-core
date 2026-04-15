import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { AIAssistantPanel } from '../components/ai/AIAssistantPanel';

export const DashboardLayout = () => {
    const { logout } = useAuthStore();
    const location = useLocation();

    const [isAIOpen, setIsAIOpen] = useState(false);

    return (
        <div className="relative min-h-screen bg-gradient-to-b from-green-900 to-black p-4 sm:p-8 overflow-hidden">
            <div className="mx-auto max-w-6xl">

                {/* Header Global del Dashboard */}
                <div className="mb-4 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-xl bg-white p-4 sm:p-6 shadow-sm border border-gray-100">
                    <div className="w-full sm:w-auto">
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Administration Panel</h1>
                        <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-0 sm:pb-4">Manage access and view NodePay regulations.</p>

                        <div className="flex space-x-4 sm:space-x-6 border-b border-gray-200 overflow-x-auto whitespace-nowrap pb-1">
                            <Link
                                to="/dashboard/users"
                                className={`pb-2 text-sm font-medium transition-colors border-b-2 ${location.pathname.includes('/users')
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                    }`}
                            >
                                User List
                            </Link>
                            <Link
                                to="/dashboard/terms"
                                className={`pb-2 text-sm font-medium transition-colors border-b-2 ${location.pathname.includes('/terms')
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                    }`}
                            >
                                Terms and Conditions
                            </Link>
                        </div>
                    </div>

                    <button
                        onClick={logout}
                        className="mt-4 sm:mt-0 w-full sm:w-auto rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-red-50 hover:text-red-600 border-2 border-gray-500/20 hover:cursor-pointer"
                    >
                        Logout
                    </button>
                </div>

                <div className="mb-6">
                    <Outlet />
                </div>
            </div>

            {/* Botón Flotante (FAB) para abrir la Inteligencia Artificial */}
            <button
                onClick={() => setIsAIOpen(true)}
                className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-slate-900 text-xl sm:text-2xl text-white shadow-xl transition-transform hover:scale-110 hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300"
                aria-label="Abrir Copiloto de IA"
            >
                ✨
            </button>

            {/* El componente del Panel Lateral */}
            <AIAssistantPanel isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
        </div>
    );
};