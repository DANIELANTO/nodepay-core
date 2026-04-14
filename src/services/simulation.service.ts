import { prisma } from '../config/db.js';
import { io } from '../index.js';


class SimulationService {
    // Map to track active intervals: [walletId]: Interval
    private activeSimulations: Map<string, NodeJS.Timeout> = new Map();

    start(walletId: string) {
        if (this.activeSimulations.has(walletId)) return;

        console.log(`Starting simulator for wallet: ${walletId}`);

        // Execute every 10 seconds
        const interval = setInterval(async () => {
            await this.executeTick(walletId);
        }, 5000);

        this.activeSimulations.set(walletId, interval);
    }

    stop(walletId: string) {
        const interval = this.activeSimulations.get(walletId);
        if (interval) {
            clearInterval(interval);
            this.activeSimulations.delete(walletId);
            console.log(`Simulator stopped for wallet: ${walletId}`);
        }
    }

    private async executeTick(walletId: string) {
        try {
            // 1. Generate random values
            const amount = parseFloat((Math.random() * 499 + 1).toFixed(2)); // $1 - $500
            const type = Math.random() > 0.5 ? 'DEPOSIT' : 'WITHDRAWAL';

            // 2. Atomic Transaction with Prisma
            const result = await prisma.$transaction(async (tx) => {
                const wallet = await tx.wallet.findUnique({ where: { id: walletId } });
                if (!wallet) throw new Error('Wallet not found');

                // BUSINESS RULE: No negative balances
                if (type === 'WITHDRAWAL' && wallet.balance < amount) {
                    // Record the transaction as REJECTED for history
                    await tx.transaction.create({
                        data: { walletId, amount, type, status: 'REJECTED' }
                    });
                    return { success: false, reason: 'Insufficient balance', balance: wallet.balance };
                }

                // If valid, update balance
                const newBalance = type === 'DEPOSIT'
                    ? wallet.balance + amount
                    : wallet.balance - amount;

                const updatedWallet = await tx.wallet.update({
                    where: { id: walletId },
                    data: { balance: newBalance }
                });

                // Create completion transaction record
                await tx.transaction.create({
                    data: { walletId, amount, type, status: 'COMPLETED' }
                });

                return { success: true, balance: updatedWallet.balance, type, amount };
            });

            // 3. REAL-TIME EMISSION
            // Send the event only to the "room" of this wallet
            io.to(`wallet_${walletId}`).emit('wallet_update', {
                walletId,
                newBalance: result.balance,
                lastTransaction: result.success ? { type, amount } : null,
                error: !result.success ? result.reason : null
            });

        } catch (error) {
            console.error(`Error in simulation tick (${walletId}):`, error);
        }
    }
}

export const simulationService = new SimulationService();