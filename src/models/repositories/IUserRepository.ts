export interface IUserRepository {
    createUser(email: string, name: string): Promise<any>;
    toggleUserStatus(id: string): Promise<any>;
    getUsers(limit: number, offset: number, search?: string): Promise<{ data: any[], total: number }>;
    getUserById(id: string): Promise<any>;
    editUser(id: string, name: string): Promise<any>;
}
