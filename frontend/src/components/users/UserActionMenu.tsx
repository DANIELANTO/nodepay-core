// src/components/users/UserActionMenu.tsx
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { User } from '../../store/api/userApi';

interface UserActionMenuProps {
    user: User;
    /** Called when the user selects "Habilitar / Deshabilitar" */
    onRequestToggle: (user: Pick<User, 'id' | 'isActive' | 'name'>) => void;
}

export const UserActionMenu = ({ user, onRequestToggle }: UserActionMenuProps) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                id={`menu-btn-${user.id}`}
                aria-label="Abrir menú de acciones"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none"
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="5" r="1.5" />
                    <circle cx="12" cy="12" r="1.5" />
                    <circle cx="12" cy="19" r="1.5" />
                </svg>
            </button>

            {open && (
                <div className="fixed right-0 z-50 mt-1 w-52 rounded-xl border border-gray-100 bg-white py-1 shadow-xl">
                    {/* Ver Wallet */}
                    <Link
                        to={`/dashboard/users/${user.id}`}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                    >
                        <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <rect x="2" y="5" width="20" height="14" rx="2" />
                            <path d="M16 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                        </svg>
                        Ver Wallet
                    </Link>

                    {/* Editar */}
                    <button
                        onClick={() => setOpen(false)}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                    >
                        <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Editar
                    </button>

                    <div className="my-1 border-t border-gray-100" />

                    {/* Habilitar / Deshabilitar */}
                    <button
                        onClick={() => {
                            onRequestToggle({ id: user.id, isActive: user.isActive, name: user.name });
                            setOpen(false);
                        }}
                        className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50 ${user.isActive ? 'text-red-600' : 'text-green-600'
                            }`}
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            {user.isActive ? (
                                <path d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L20 20M4 4l1.636 1.636" />
                            ) : (
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            )}
                        </svg>
                        {user.isActive ? 'Deshabilitar' : 'Habilitar Usuario'}
                    </button>
                </div>
            )}
        </div>
    );
};
