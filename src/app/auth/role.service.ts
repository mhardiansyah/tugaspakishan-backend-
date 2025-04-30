import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "./auth.roles.entity";
import { Repository } from "typeorm";
import { randomUUID } from "crypto";

// role.service.ts
@Injectable()
export class RoleService {
  constructor(@InjectRepository(Role) private repo: Repository<Role>) {}

  async seedDefaultRoles() {
    const roleUser = await this.repo.findOne({ where: { name: 'user' } });
    if (!roleUser) {
      await this.repo.insert([
        {
          id: randomUUID(), // atau gunakan uuidv4() kalau dari 'uuid' package
          name: 'user',
        },
        {
          id: randomUUID(),
          name: 'admin',
        },
        {
          id: randomUUID(),
          name: 'member',
        },
      ]);
      console.log('Default roles berhasil ditambahkan.');
    } else {
      console.log('Default roles sudah ada.');
    }
  }
}
