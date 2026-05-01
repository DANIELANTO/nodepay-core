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
                toast('Simulation stopped', { icon: '🛑' });
            } else {
                await startSim(wallet.id).unwrap();
                toast.success('Simulation started. Watch the balance!');
            }
            setIsSimulating(!isSimulating);
        } catch (error) {
            toast.error('Error when changing simulation status');
        }
    };

    if (!wallet) {
        return <div className="glass-card p-6 text-sm text-slate-500 dark:text-slate-400 text-center">The user does not have an assigned wallet.</div>;
    }

    return (
        <div className="glass-card p-6 border-amber-500/20 relative overflow-hidden flex flex-col justify-between group">
            <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-1">
                    <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400">Current Balance</h2>

                    {/* Toggle Switch para el Simulador */}
                    <button
                        onClick={handleToggleSimulation}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${isSimulating ? 'bg-amber-500 shadow-glow-sm' : 'bg-slate-50 dark:bg-slate-900-elevated border border-slate-200 dark:border-slate-800'}`}
                        title={isSimulating ? 'Stop simulation' : 'Start simulation'}
                    >
                        <span className={`inline-block h-4 w-4 transform rounded-full transition-transform ${isSimulating ? 'translate-x-6 bg-[#0A0A0F]' : 'translate-x-1 bg-muted-foreground'}`} />
                    </button>
                </div>

                <div className="flex items-baseline space-x-2 mt-4">
                    <span className={`text-4xl font-display font-bold tracking-tight transition-colors duration-300 ${isSimulating ? 'text-amber-600 dark:text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'text-slate-900 dark:text-slate-50'}`}>
                        ${wallet.balance.toFixed(2)}
                    </span>
                    <span className="text-lg font-medium text-slate-500 dark:text-slate-400">
                        {wallet.currency}
                    </span>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                        Wallet ID: {wallet.id.substring(0, 8)}...
                    </p>
                    {isSimulating && (
                        <span className="flex items-center text-xs text-amber-600 dark:text-amber-500 font-medium bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse mr-1.5 shadow-glow-sm"></span>
                            Live
                        </span>
                    )}
                </div>
            </div>
            <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-amber-500/10 blur-[60px] pointer-events-none"></div>
        </div>
    );
};