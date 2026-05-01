import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const Login = () => {
    const { login, isAuthenticated } = useAuthStore();

    if (isAuthenticated) return <Navigate to="/dashboard/users" replace />;

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
            {/* Ambient Orbs */}
            <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />
            
            <div className="w-full max-w-md glass-card p-8 sm:p-10 relative z-10">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-slate-50 mb-3">NodePay</h1>
                    <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">Restricted access for authorized personnel</p>
                </div>
                <button
                    onClick={login}
                    className="w-full btn-primary flex justify-center items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                    Login with Keycloak
                </button>
            </div>
        </div>
    );
};