import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Role } from './auth.roles.entity';
import { Repository } from 'typeorm';
import baseResponse from '../utils/response.utils';
import { Responsesuccess } from '../interface';

@Injectable()
export class RolesService extends baseResponse {
  constructor(@InjectRepository(Role) private repo: Repository<Role>) {
      super();
  }

  
  async create (payload: any): Promise<Responsesuccess> {
    const role = this.repo.create({...payload, id: randomUUID()});
    await this.repo.save(role)
    return this._success('success',{
      success: true,
      message: 'success',
      role: Role.name,
    } );
  }

    
}
