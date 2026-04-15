import { useParams, Link } from 'react-router-dom';
import { useGetUserByIdQuery } from '../store/api/userApi';
import { WalletCard } from '../components/users/WalletCard';

export const UserDetails = () => {
    const { id } = useParams<{ id: string }>();

    const { data: user, isLoading, isError } = useGetUserByIdQuery(id!);

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            </div>
        );
    }

    if (isError || !user) {
        return (
            <div className="rounded-md bg-red-50 p-4 text-red-700">
                Error al cargar los detalles del usuario o usuario no encontrado.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Botón de regreso */}
            <div className="flex justify-end">
                <Link to="/dashboard/users" className="w-max text-lg font-bold text-white hover:text-gray-200">
                    ← Volver a la lista
                </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Tarjeta de Perfil */}
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">User Profile</h2>
                    <div className="space-y-3 text-sm text-gray-600">
                        <p><strong className="text-gray-900">ID:</strong> <span className="font-mono text-xs">{user.id.substring(0, 8)}...</span></p>
                        <p><strong className="text-gray-900">Name:</strong> {user.name}</p>
                        <p><strong className="text-gray-900">Email:</strong> {user.email}</p>
                        <p>
                            <strong className="text-gray-900">Status:</strong>{' '}
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Tarjeta de la Wallet */}
                <WalletCard wallet={user.wallet} />
            </div>
        </div>
    );
};