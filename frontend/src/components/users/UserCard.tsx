// src/components/users/UserCard.tsx
import { Link } from 'react-router-dom';
import type { User } from '../../store/api/userApi';
import { Avatar } from '../ui/Avatar';
import { StatusBadge } from '../ui/StatusBadge';
import { UserActionMenu } from './UserActionMenu';

interface UserCardProps {
    user: User;
    onRequestToggle: (user: Pick<User, 'id' | 'isActive' | 'name'>) => void;
}

export const UserCard = ({ user, onRequestToggle }: UserCardProps) => (
    <div className="glass-card px-5 py-5">
        {/* Top row: avatar + name + menu */}
        <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-4">
                <Avatar name={user.name} size="md" />
                <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900 dark:text-slate-50">{user.name}</p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">{user.email}</p>
                </div>
            </div>
            <UserActionMenu user={user} onRequestToggle={onRequestToggle} />
        </div>

        {/* Bottom row: status badge + wallet link */}
        <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <StatusBadge
                label={user.isActive ? 'ACTIVO' : 'INACTIVO'}
                variant={user.isActive ? 'success' : 'danger'}
            />
            {user.wallet ? (
                <Link
                    to={`/dashboard/users/${user.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-500 hover:text-amber-600 dark:text-amber-500-hover transition-colors outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-sm px-1"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <rect x="2" y="5" width="20" height="14" rx="2" />
                        <path d="M16 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                    </svg>
                    Wallet
                </Link>
            ) : (
                <span className="text-xs text-slate-500 dark:text-slate-400">Sin Wallet</span>
            )}
        </div>
    </div>
);
