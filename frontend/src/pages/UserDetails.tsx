import { useParams, Link } from 'react-router-dom';
import { useGetUserByIdQuery } from '../store/api/userApi';

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
            <Link to="/dashboard/users" className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center">
                ← Volver a la lista
            </Link>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Tarjeta de Perfil */}
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Perfil de Usuario</h2>
                    <div className="space-y-3 text-sm text-gray-600">
                        <p><strong className="text-gray-900">ID:</strong> <span className="font-mono text-xs">{user.id.substring(0, 8)}...</span></p>
                        <p><strong className="text-gray-900">Nombre:</strong> {user.name}</p>
                        <p><strong className="text-gray-900">Email:</strong> {user.email}</p>
                        <p>
                            <strong className="text-gray-900">Estado:</strong>{' '}
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {user.isActive ? 'Activo' : 'Inactivo'}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Tarjeta de la Wallet */}
                <div className="rounded-xl bg-linear-to-br from-slate-800 to-slate-900 p-6 shadow-lg text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-sm font-medium text-slate-300 mb-1">Balance Actual (NodePay Wallet)</h2>
                        <div className="flex items-baseline space-x-2">
                            <span className="text-4xl font-bold tracking-tight">
                                {user.wallet?.balance != null ? `$${user.wallet.balance.toFixed(2)}` : 'N/A'}
                            </span>
                            <span className="text-lg font-medium text-slate-400">
                                {user.wallet?.currency || 'USD'}
                            </span>
                        </div>
                        <div className="mt-8 pt-4 border-t border-slate-700/50">
                            <p className="text-xs text-slate-400 font-mono">
                                Wallet ID: {user.wallet?.id.substring(0, 8)}...
                            </p>
                        </div>
                    </div>
                    {/* Decoración de fondo */}
                    <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-blue-500/20 blur-2xl"></div>
                </div>
            </div>
        </div>
    );
};