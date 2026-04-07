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
    <div className="hidden overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm md:block">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
                <thead>
                    <tr className="text-xs font-semibold uppercase tracking-wider text-green-800">
                        <th className="px-6 py-4 text-left">ID</th>
                        <th className="px-6 py-4 text-left">Usuario</th>
                        <th className="px-6 py-4 text-left">Email</th>
                        <th className="px-6 py-4 text-left">Estado</th>
                        <th className="px-6 py-4 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {users.map((user) => (
                        <tr key={user.id} className="group transition-colors hover:bg-gray-100/70">
                            <td className="px-6 py-4 font-mono text-xs text-gray-900">
                                {shortId(user.id)}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <Avatar name={user.name} size="md" />
                                    <span className="font-semibold text-gray-900">{user.name}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-gray-700">{user.email}</td>
                            <td className="px-6 py-4">
                                <StatusBadge
                                    label={user.isActive ? 'ACTIVO' : 'INACTIVO'}
                                    variant={user.isActive ? 'success' : 'danger'}
                                />
                            </td>
                            <td className="px-6 py-4 text-right">
                                <UserActionMenu user={user} onRequestToggle={onRequestToggle} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);
