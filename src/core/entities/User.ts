import { BaseEntity } from '../../shared/types';

export interface User extends BaseEntity {
  email: string;
  name: string;
  avatar?: string;
  isActive: boolean;
}

export class UserEntity implements User {
  constructor(
    public id: string,
    public email: string,
    public name: string,
    public createdAt: Date,
    public updatedAt: Date,
    public isActive: boolean = true,
    public avatar?: string
  ) {}

  static create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): UserEntity {
    const now = new Date();
    return new UserEntity(
      crypto.randomUUID(),
      data.email,
      data.name,
      now,
      now,
      data.isActive,
      data.avatar
    );
  }

  updateProfile(name: string, avatar?: string): void {
    this.name = name;
    this.avatar = avatar;
    this.updatedAt = new Date();
  }
}