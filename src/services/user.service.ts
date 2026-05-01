import { IUserRepository } from '../models/repositories/IUserRepository.js';

export class UserService {
    constructor(private userRepository: IUserRepository) { }

    public async registerNewUser(email: string, name: string) {
        return await this.userRepository.createUser(email, name);
    }

    public async toggleUserStatus(id: string) {
        return await this.userRepository.toggleUserStatus(id);
    }

    public async getAllUsers(limit: number, offset: number, search?: string) {
        if (typeof limit !== 'number' || limit <= 0 || typeof offset !== 'number' || offset < 0) {
            throw new Error('Limit and offset must be positive numbers');
        }
        return await this.userRepository.getUsers(limit, offset, search);
    }

    public async getUserById(id: string) {
        return await this.userRepository.getUserById(id);
    }

    public async editUser(id: string, name: string) {
        return await this.userRepository.editUser(id, name);
    }
}