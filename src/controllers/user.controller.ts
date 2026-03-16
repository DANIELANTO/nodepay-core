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

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
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