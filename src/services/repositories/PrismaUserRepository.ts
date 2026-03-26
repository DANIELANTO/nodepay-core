import { PrismaClient } from '@prisma/client';
import { IUserRepository } from '../../models/repositories/IUserRepository.js';

export class PrismaUserRepository implements IUserRepository {
    constructor(private prisma: PrismaClient) { }

    async createUser(email: string, name: string) {
        return await this.prisma.user.create({
            data: { email, name, wallet: { create: { balance: 0, currency: 'USD' } } },
            include: { wallet: true }
        });
    }

    async toggleUserStatus(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: { wallet: true }
        });
        if (!user) {
            throw new Error('User not found');
        }
        return await this.prisma.user.update({
            where: { id },
            data: { isActive: !user.isActive },
            include: { wallet: true }
        });
    }

    async getUsers() {
        return await this.prisma.user.findMany({
            include: { wallet: true }
        });
    }

    async getUserById(id: string) {
        return await this.prisma.user.findUnique({
            where: { id },
            include: { wallet: true }
        });
    }
}