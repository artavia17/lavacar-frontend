import { BaseEntity } from '../../shared/types';

export interface Agent extends BaseEntity {
  name: string;
  email: string;
  phone?: string;
  isActive: boolean;
  role: 'agent';
}

export class AgentEntity implements Agent {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public createdAt: Date,
    public updatedAt: Date,
    public isActive: boolean = true,
    public phone?: string,
    public role: 'agent' = 'agent'
  ) {}
}