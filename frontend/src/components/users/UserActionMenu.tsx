// src/components/users/UserActionMenu.tsx
import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import type { User } from '../../store/api/userApi';

interface UserActionMenuProps {
    user: User;
    /** Called when the user selects "Enable / Disable" */
    onRequestToggle: (user: Pick<User, 'id' | 'isActive' | 'name'>) => void;
}

export const UserActionMenu = ({ user, onRequestToggle }: UserActionMenuProps) => {
    const [open, setOpen] = useState(false);
    const btnRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [coords, setCoords] = useState({ left: 0, top: 0 });

    useLayoutEffect(() => {
        if (open && btnRef.current) {
            const rect = btnRef.current.getBoundingClientRect();
            // Estimate menu height (approx 130px)
            const menuHeight = 130;
            const spaceBelow = window.innerHeight - rect.bottom;
            
            if (spaceBelow < menuHeight && rect.top > menuHeight) {
                // Open upwards
                setCoords({
                    left: rect.right - 208, // 208px is w-52
                    top: rect.top - menuHeight - 4
                });
            } else {
                // Open downwards
                setCoords({
                    left: rect.right - 208,
                    top: rect.bottom + 4
                });
            }
        }
    }, [open]);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            const target = e.target as Node;
            if (
                btnRef.current && !btnRef.current.contains(target) &&
                menuRef.current && !menuRef.current.contains(target)
            ) {
                setOpen(false);
            }
        };
        const handleScroll = () => { if (open) setOpen(false); };

        document.addEventListener('mousedown', handler);
        window.addEventListener('scroll', handleScroll, true);
        window.addEventListener('resize', handleScroll);
        
        return () => {
            document.removeEventListener('mousedown', handler);
            window.removeEventListener('scroll', handleScroll, true);
            window.removeEventListener('resize', handleScroll);
        };
    }, [open]);

    return (
        <div className="relative flex justify-end">
            <button
                ref={btnRef}
                id={`menu-btn-${user.id}`}
                aria-label="Open action menu"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer"
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="5" r="1.5" />
                    <circle cx="12" cy="12" r="1.5" />
                    <circle cx="12" cy="19" r="1.5" />
                </svg>
            </button>

            {open && createPortal(
                <div 
                    ref={menuRef}
                    style={{ left: coords.left, top: coords.top }}
                    className="fixed z-[9999] w-52 rounded-xl border border-border-subtle bg-surface py-1 shadow-xl"
                >
                    {/* View Wallet */}
                    <Link
                        to={`/dashboard/users/${user.id}`}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-surface-elevated hover:text-accent cursor-pointer"
                    >
                        <svg className="h-4 w-4 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <rect x="2" y="5" width="20" height="14" rx="2" />
                            <path d="M16 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                        </svg>
                        View Wallet
                    </Link>

                    {/* Edit */}
                    <Link
                        to={`/dashboard/users/${user.id}/edit`}
                        state={{ user }}
                        onClick={() => setOpen(false)}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-surface-elevated hover:text-accent cursor-pointer"
                    >
                        <svg className="h-4 w-4 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Edit
                    </Link>

                    <div className="my-1 border-t border-border-subtle" />

                    {/* Enable / Disable */}
                    <button
                        onClick={() => {
                            onRequestToggle({ id: user.id, isActive: user.isActive, name: user.name });
                            setOpen(false);
                        }}
                        className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-surface-elevated cursor-pointer ${
                            user.isActive ? 'text-red-500 hover:text-red-600' : 'text-indigo-600 hover:text-indigo-700'
                        }`}
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            {user.isActive ? (
                                <path d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L20 20M4 4l1.636 1.636" />
                            ) : (
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            )}
                        </svg>
                        {user.isActive ? 'Disable' : 'Enable'}
                    </button>
                </div>,
                document.body
            )}
        </div>
    );
};

