import { useParams, Link } from 'react-router-dom';
import { useGetUserByIdQuery } from '../store/api/userApi';
import { WalletCard } from '../components/users/WalletCard';

export const UserDetails = () => {
    const { id } = useParams<{ id: string }>();

    const { data: user, isLoading, isError } = useGetUserByIdQuery(id!);

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent shadow-glow-sm"></div>
            </div>
        );
    }

    if (isError || !user) {
        return (
            <div className="rounded-xl bg-red-900/20 p-5 text-red-400 border border-red-500/30 backdrop-blur-md">
                Error al cargar los detalles del usuario o usuario no encontrado.
            </div>
        );
    }

    return (
        <div className="space-y-6 relative z-10">
            {/* Botón de regreso */}
            <div className="flex justify-end">
                <Link to="/dashboard/users" className="w-max text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-slate-50 transition-colors">
                    ← Volver a la lista
                </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Tarjeta de Perfil */}
                <div className="glass-card p-6">
                    <h2 className="text-xl font-display font-bold text-slate-900 dark:text-slate-50 mb-4">User Profile</h2>
                    <div className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
                        <p><strong className="text-slate-900 dark:text-slate-50">ID:</strong> <span className="font-mono text-xs">{user.id.substring(0, 8)}...</span></p>
                        <p><strong className="text-slate-900 dark:text-slate-50">Name:</strong> {user.name}</p>
                        <p><strong className="text-slate-900 dark:text-slate-50">Email:</strong> {user.email}</p>
                        <p>
                            <strong className="text-slate-900 dark:text-slate-50">Status:</strong>{' '}
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${user.isActive ? 'bg-green-900/20 text-green-400 border-green-500/30' : 'bg-red-900/20 text-red-400 border-red-500/30'}`}>
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