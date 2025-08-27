import { User } from '../entities/User';
import { UserRepository } from '../repositories/UserRepository';

export class GetUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string): Promise<User | null> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    return await this.userRepository.findById(userId);
  }
}