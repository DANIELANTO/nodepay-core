// src/components/users/UsersDesktopTable.tsx
import type { User } from '../../store/api/userApi';
import { Avatar } from '../ui/Avatar';
import { StatusBadge } from '../ui/StatusBadge';
import { UserActionMenu } from './UserActionMenu';
import { shortId } from './userHelpers';

interface UsersDesktopTableProps {
    users: User[];
    onRequestToggle: (user: Pick<User, 'id' | 'isActive' | 'name'>) => void;
}

export const UsersDesktopTable = ({ users, onRequestToggle }: UsersDesktopTableProps) => (
    <div className="hidden md:flex flex-col flex-1 min-h-0">
        <div className="overflow-auto flex-1 relative">
            <table className="min-w-full divide-y divide-border-subtle text-sm">
                <thead className="bg-white/5 sticky top-0 z-10 shadow-sm backdrop-blur-md">
                    <tr className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        <th className="px-5 py-2.5 text-left font-mono">ID</th>
                        <th className="px-5 py-2.5 text-left">User</th>
                        <th className="px-5 py-2.5 text-left">Email</th>
                        <th className="px-5 py-2.5 text-left">Status</th>
                        <th className="px-5 py-2.5 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                    {users.map((user) => (
                        <tr key={user.id} className="group transition-colors hover:bg-surface-elevated">
                            <td className="px-5 py-2 font-mono text-xs text-slate-500 dark:text-slate-400">
                                {shortId(user.id)}
                            </td>
                            <td className="px-5 py-2">
                                <div className="flex items-center gap-3">
                                    <Avatar name={user.name} size="sm" />
                                    <span className="font-semibold text-slate-900 dark:text-slate-50">{user.name}</span>
                                </div>
                            </td>
                            <td className="px-5 py-2 text-slate-500 dark:text-slate-400">{user.email}</td>
                            <td className="px-5 py-2">
                                <StatusBadge
                                    label={user.isActive ? 'ACTIVE' : 'INACTIVE'}
                                    variant={user.isActive ? 'success' : 'danger'}
                                />
                            </td>
                            <td className="px-5 py-2 text-right">
                                <UserActionMenu user={user} onRequestToggle={onRequestToggle} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);
