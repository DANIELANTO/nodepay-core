import express, { Request, Response } from 'express';
import { GracefullShutdown } from './config/shutdown.js';
import userRoutes from './routes/user.routes.js';
import walletRoutes from './routes/wallet.routes.js';
import cors from 'cors';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

const app = express();

const port = 3000;

const allowedOrigin = process.env.FRONTEND_URL;

app.use(cors({
    origin: allowedOrigin,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.json({
        status: 'up',
        timestamp: new Date().toISOString(),
    });
});

app.use('/users', userRoutes);
app.use('/wallets', walletRoutes);

const server = http.createServer(app);
export const io = new SocketIOServer(server, {
    cors: {
        origin: allowedOrigin,
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {

    socket.on('join_wallet_room', (walletId: string) => {
        socket.join(`wallet_${walletId}`);
        console.log(`📡 Cliente ${socket.id} se unió a la room: wallet_${walletId}`);
    });

    socket.on('disconnect', () => {
        console.log(`❌ Cliente desconectado: ${socket.id}`);
    });
});

server.listen(port, '0.0.0.0', () => {
    console.log(`🚀 NodePay User Management Service running on http://localhost:${port}`);
});

process.on('SIGTERM', () => GracefullShutdown.execute('SIGTERM', server));
process.on('SIGINT', () => GracefullShutdown.execute('SIGINT', server));
