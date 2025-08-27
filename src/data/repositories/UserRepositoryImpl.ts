import { User } from '../../core/entities/User';
import { UserRepository } from '../../core/repositories/UserRepository';
import { ApiDataSource } from '../datasources/ApiDataSource';

export class UserRepositoryImpl implements UserRepository {
  constructor(private apiDataSource: ApiDataSource) {}

  async findById(id: string): Promise<User | null> {
    const response = await this.apiDataSource.get<User>(`/users/${id}`);
    return response.success ? response.data : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const response = await this.apiDataSource.get<User>(`/users?email=${email}`);
    return response.success ? response.data : null;
  }

  async save(user: User): Promise<User> {
    const response = await this.apiDataSource.post<User>('/users', user);
    if (!response.success) {
      throw new Error(response.message || 'Failed to save user');
    }
    return response.data;
  }

  async delete(id: string): Promise<boolean> {
    const response = await this.apiDataSource.delete(`/users/${id}`);
    return response.success;
  }

  async findAll(): Promise<User[]> {
    const response = await this.apiDataSource.get<User[]>('/users');
    return response.success ? response.data : [];
  }
}