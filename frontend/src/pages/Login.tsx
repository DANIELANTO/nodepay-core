import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const Login = () => {
    const { login, isAuthenticated } = useAuthStore();

    if (isAuthenticated) return <Navigate to="/dashboard/users" replace />;

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 p-4 sm:p-6 md:p-8">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-2xl">
                <div className="mb-6 sm:mb-8 text-center">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">NodePay</h1>
                    <p className="mt-2 text-sm sm:text-base text-gray-600">Restricted access for authorized personnel</p>
                </div>
                <button
                    onClick={login}
                    className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none"
                >
                    Login with Keycloak
                </button>
            </div>
        </div>
    );
};