import { useState } from 'react';
import toast from 'react-hot-toast';
import { useStartSimulationMutation, useStopSimulationMutation } from '../../store/api/userApi';
import type { Wallet } from '../../store/api/userApi';

interface WalletCardProps {
    wallet?: Wallet;
}

export const WalletCard = ({ wallet }: WalletCardProps) => {
    const [isSimulating, setIsSimulating] = useState(false);
    const [startSim] = useStartSimulationMutation();
    const [stopSim] = useStopSimulationMutation();

    const handleToggleSimulation = async () => {
        if (!wallet) return;

        try {
            if (isSimulating) {
                await stopSim(wallet.id).unwrap();
                toast('Simulación detenida', { icon: '🛑' });
            } else {
                await startSim(wallet.id).unwrap();
                toast.success('Simulación iniciada. ¡Observa el balance!');
            }
            setIsSimulating(!isSimulating);
        } catch (error) {
            toast.error('Error al cambiar el estado de la simulación');
        }
    };

    if (!wallet) {
        return <div className="rounded-xl bg-slate-100 p-6">El usuario no tiene una wallet asignada.</div>;
    }

    return (
        <div className="rounded-xl bg-linear-to-br from-slate-800 to-slate-900 p-6 shadow-lg text-white relative overflow-hidden flex flex-col justify-between">
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-1">
                    <h2 className="text-sm font-medium text-slate-300">Balance Actual</h2>

                    {/* Toggle Switch para el Simulador */}
                    <button
                        onClick={handleToggleSimulation}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${isSimulating ? 'bg-emerald-500' : 'bg-slate-600'}`}
                        title={isSimulating ? 'Detener simulación' : 'Iniciar simulación'}
                    >
                        <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${isSimulating ? 'translate-x-5' : 'translate-x-1'}`} />
                    </button>
                </div>

                <div className="flex items-baseline space-x-2 mt-2">
                    <span className={`text-4xl font-bold tracking-tight transition-all duration-300 ${isSimulating ? 'text-emerald-400' : 'text-white'}`}>
                        ${wallet.balance.toFixed(2)}
                    </span>
                    <span className="text-lg font-medium text-slate-400">
                        {wallet.currency}
                    </span>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-700/50 flex justify-between items-center">
                    <p className="text-xs text-slate-400 font-mono">
                        Wallet ID: {wallet.id.substring(0, 8)}...
                    </p>
                    {isSimulating && (
                        <span className="flex items-center text-xs text-emerald-400 font-medium">
                            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse mr-2"></span>
                            En vivo
                        </span>
                    )}
                </div>
            </div>
            <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-blue-500/20 blur-2xl pointer-events-none"></div>
        </div>
    );
};