export interface IUserRepository {
    createUser(email: string, name: string): Promise<any>;
    getUsers(): Promise<any>;
    getUserById(id: string): Promise<any>;
}
