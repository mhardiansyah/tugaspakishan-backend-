import { Body, Controller, Get, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto, FindRoleDto } from './auth.role.dto';

@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) {}
  @Post('create')
  create(@Body() payload: CreateRoleDto) {
    return this.rolesService.create(payload);
  }
}
