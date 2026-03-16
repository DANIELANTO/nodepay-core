import { IUserRepository } from '../models/repositories/IUserRepository.js';

export class UserService {
    constructor(private userRepository: IUserRepository) { }

    public async registerNewUser(email: string, name: string) {
        return await this.userRepository.createUser(email, name);
    }

    public async getAllUsers() {
        return await this.userRepository.getUsers();
    }

    public async getUserById(id: string) {
        return await this.userRepository.getUserById(id);
    }
}