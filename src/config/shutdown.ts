import { prisma } from "./db.js";

export class GracefullShutdown {
    static async execute(signal: string, server: any) {
        try {
            console.log(`Received ${signal}, starting graceful shutdown...`);
            server.close(() => {
                console.log(`Server closed with signal: ${signal}`);
            });
            await prisma.$disconnect();
            process.exit(0);
        } catch (error) {
            console.error("Error during shutdown:", error);
            process.exit(1);
        }
    }
}