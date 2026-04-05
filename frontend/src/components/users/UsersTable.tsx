import { useState } from 'react';
import { useGetUsersQuery, useToggleUserStatusMutation } from '../../store/api/userApi';
import { Link } from 'react-router-dom';

export const UsersTable = () => {
    const { data: users = [], isLoading, isError } = useGetUsersQuery();
    const [toggleUserStatus] = useToggleUserStatusMutation();
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [userToToggle, setUserToToggle] = useState<{ id: string; isActive: boolean } | null>(null);

    const handleToggleStatus = async (id: string) => {
        try {
            await toggleUserStatus(id).unwrap();
        } catch (error) {
            console.error('Error toggling status', error);
        }
    };

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
            <div className="flex flex-col items-center justify-center">
                <div className="rounded-md bg-gray-50 p-8 text-center text-gray-500">
                    No hay usuarios registrados en el sistema.
                </div>
                <Link
                    to="/dashboard/users/new"
                    className="mt-4 sm:mt-0 w-full sm:w-auto rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 hover:text-white block text-center"
                >
                    Crear Nuevo Usuario
                </Link>
            </div>
        );
    }

    return (
        <>
            <div className={`overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm ${isConfirmModalOpen && userToToggle
                ? 'blur-sm'
                : 'blur-none'
                }`}>
                <div className="border-b border-gray-200 bg-white p-4 sm:flex sm:items-center sm:justify-between">
                    <h3 className="text-lg font-semibold leading-6 text-gray-900">Usuarios</h3>
                    <div className="mt-3 sm:ml-4 sm:mt-0">
                        <Link
                            to="/dashboard/users/new"
                            className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                        >
                            Crear Nuevo Usuario
                        </Link>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-900">
                            <tr>
                                <th className="px-6 py-4 font-semibold">ID</th>
                                <th className="px-6 py-4 font-semibold">Nombre</th>
                                <th className="px-6 py-4 font-semibold">Correo Electrónico</th>
                                <th className="px-6 py-4 font-semibold">Estado</th>
                                <th className="px-6 py-4 font-semibold">Acciones</th>
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
                                        <div className="flex items-center justify-end space-x-4 border border-gray-200 px-4 py-2 rounded-lg bg-gray-50 shadow-sm w-max ml-auto">
                                            <Link
                                                to={`/dashboard/users/${user.id}`}
                                                className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                                            >
                                                Ver Wallet
                                            </Link>
                                            <div className="w-px h-4 bg-gray-300"></div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setUserToToggle({ id: user.id, isActive: user.isActive });
                                                    setIsConfirmModalOpen(true);
                                                }}
                                                className={`font-medium text-sm transition-colors ${user.isActive
                                                    ? 'text-red-600 hover:text-red-800'
                                                    : 'text-green-600 hover:text-green-800'
                                                    }`}
                                            >
                                                {user.isActive ? 'Deshabilitar Usuario' : 'Habilitar Usuario'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Confirmación */}
            {isConfirmModalOpen && userToToggle && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 px-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Confirmar Acción</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            ¿Estás seguro que deseas {userToToggle.isActive ? 'deshabilitar' : 'habilitar'} este usuario?
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setIsConfirmModalOpen(false);
                                    setUserToToggle(null);
                                }}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => {
                                    handleToggleStatus(userToToggle.id);
                                    setIsConfirmModalOpen(false);
                                    setUserToToggle(null);
                                }}
                                className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${userToToggle.isActive
                                    ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                                    : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                                    }`}
                            >
                                {userToToggle.isActive ? 'Deshabilitar' : 'Habilitar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};