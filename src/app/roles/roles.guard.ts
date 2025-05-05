import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../utils/decorator/roles.decorator';
import { Role } from './auth.roles.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // Jika tidak ada roles yang dibutuhkan, akses diberikan
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log('ROLE GUARD USER:', user);
    console.log('Required Roles:', requiredRoles);

    // Periksa apakah user.roles adalah array atau string
    if (!user || !user.roles) {
      throw new ForbiddenException('Access denied');
    }

    const userRoles = Array.isArray(user.roles) ? user.roles : [user.roles]; // Pastikan roles selalu berupa array

    if (!userRoles.some((role) => requiredRoles.includes(role))) {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}
