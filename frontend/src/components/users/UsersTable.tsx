import { useGetUsersQuery } from '../../store/api/userApi';
import { Link } from 'react-router-dom';

export const UsersTable = () => {
    const { data: users = [], isLoading, isError } = useGetUsersQuery();

    if (isLoading) {
        return (
            <div className="flex justify-center p-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="rounded-md bg-red-50 p-4 text-red-700">
                <p className="font-semibold">Error al cargar los usuarios.</p>
                <p className="text-sm">Verifica que el User Management Service (Node.js) esté corriendo.</p>
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="rounded-md bg-gray-50 p-8 text-center text-gray-500">
                No hay usuarios registrados en el sistema.
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-gray-900">
                    <tr>
                        <th className="px-6 py-4 font-semibold">ID</th>
                        <th className="px-6 py-4 font-semibold">Nombre</th>
                        <th className="px-6 py-4 font-semibold">Correo Electrónico</th>
                        <th className="px-6 py-4 font-semibold">Estado</th>
                        <th className="px-6 py-4 font-semibold">Acción</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {users.map((user) => (
                        <tr key={user.id} className="transition-colors hover:bg-gray-50">
                            <td className="px-6 py-4 font-mono text-xs text-gray-500">{user.id.substring(0, 8)}...</td>
                            <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                            <td className="px-6 py-4">{user.email}</td>
                            <td className="px-6 py-4">
                                <span className={`...tus clases de estado...`}>
                                    {user.isActive ? 'Activo' : 'Inactivo'}
                                </span>
                            </td>
                            {/* Nueva columna de Acción */}
                            <td className="px-6 py-4 text-right">
                                <Link
                                    to={`/dashboard/users/${user.id}`}
                                    className="text-sm font-medium text-blue-600 hover:text-blue-900"
                                >
                                    Ver Wallet
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
    );
};