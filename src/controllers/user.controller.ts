import { Request, Response } from 'express';
import { UserService } from '../services/user.service.js';
import { PrismaUserRepository } from '../services/repositories/PrismaUserRepository.js';
import prisma from '../config/db.js';

const userRepository = new PrismaUserRepository(prisma);
const userService = new UserService(userRepository);

export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, name } = req.body;
        if (!email || !name) {
            res.status(400).json({ error: 'Email and name are required' });
            return;
        }

        const newUser = await userService.registerNewUser(email, name);
        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const toggleUserStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        if (!id) {
            res.status(400).json({ error: 'User ID is required' });
            return;
        }

        const updatedUser = await userService.toggleUserStatus(id);
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const pageQuery = req.query.page as string;
        const limitQuery = req.query.limit as string;
        const search = req.query.search as string;

        const limit = parseInt(limitQuery, 10) || 10;
        const page = parseInt(pageQuery, 10) || 1;
        const offset = (page - 1) * limit;

        if (limit <= 0 || page <= 0) {
            res.status(400).json({ error: 'Page and limit must be positive numbers' });
            return;
        }

        const result = await userService.getAllUsers(limit, offset, search);
        
        res.status(200).json({
            data: result.data,
            total: result.total,
            page,
            limit,
            totalPages: Math.ceil(result.total / limit)
        });
    } catch (error: any) {
        console.error(error);
        if (error.message === 'Limit and offset must be positive numbers') {
            res.status(400).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        if (!id) {
            res.status(400).json({ error: 'User ID is required' });
            return;
        }

        const user = await userService.getUserById(id);
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const editUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        const { name } = req.body;
        if (!id || !name) {
            res.status(400).json({ error: 'User ID and name are required' });
            return;
        }

        const updatedUser = await userService.editUser(id, name);
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};