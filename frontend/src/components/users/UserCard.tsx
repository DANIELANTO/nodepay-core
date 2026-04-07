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
    <div className="rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm">
        {/* Top row: avatar + name + menu */}
        <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
                <Avatar name={user.name} size="md" />
                <div className="min-w-0">
                    <p className="truncate font-semibold text-gray-900">{user.name}</p>
                    <p className="truncate text-xs text-gray-400">{user.email}</p>
                </div>
            </div>
            <UserActionMenu user={user} onRequestToggle={onRequestToggle} />
        </div>

        {/* Bottom row: status badge + wallet link */}
        <div className="mt-3 flex items-center justify-between">
            <StatusBadge
                label={user.isActive ? 'ACTIVO' : 'INACTIVO'}
                variant={user.isActive ? 'success' : 'danger'}
            />
            {user.wallet ? (
                <Link
                    to={`/dashboard/users/${user.id}`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800"
                >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <rect x="2" y="5" width="20" height="14" rx="2" />
                        <path d="M16 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                    </svg>
                    Wallet
                </Link>
            ) : (
                <span className="text-xs text-gray-400">Sin Wallet</span>
            )}
        </div>
    </div>
);
