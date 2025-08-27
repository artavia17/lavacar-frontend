import { BaseEntity } from '../../shared/types';

export interface Account extends BaseEntity {
  name: string;
  email: string;
  phone?: string;
  isActive: boolean;
  role: 'user';
}

export class AccountEntity implements Account {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public createdAt: Date,
    public updatedAt: Date,
    public isActive: boolean = true,
    public phone?: string,
    public role: 'user' = 'user'
  ) {}
}