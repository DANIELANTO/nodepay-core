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

    async editUser(id: string, name: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: { wallet: true }
        });
        if (!user) {
            throw new Error('User not found');
        }
        return await this.prisma.user.update({
            where: { id },
            data: { name },
            include: { wallet: true }
        });
    }

    async getUsers(limit: number, offset: number, search?: string) {
        const where = search ? {
            OR: [
                { name: { contains: search, mode: 'insensitive' as const } },
                { email: { contains: search, mode: 'insensitive' as const } }
            ]
        } : {};

        const [data, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip: offset,
                take: limit,
                include: { wallet: true }
            }),
            this.prisma.user.count({ where })
        ]);
        return { data, total };
    }

    async getUserById(id: string) {
        return await this.prisma.user.findUnique({
            where: { id },
            include: { wallet: true }
        });
    }
}