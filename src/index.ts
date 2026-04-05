import express, { Request, Response } from 'express';
import { GracefullShutdown } from './config/shutdown.js';
import userRoutes from './routes/user.routes.js';
import cors from 'cors';

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

app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 NodePay User Management Service running on http://localhost:${port}`);
});

process.on('SIGTERM', () => GracefullShutdown.execute('SIGTERM', app));
process.on('SIGINT', () => GracefullShutdown.execute('SIGINT', app));
