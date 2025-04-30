import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { User } from './auth.users.entity';
import { Role } from '../roles/auth.roles.entity';
import { UserRole } from './auth.userRole.entity';
import { JwtAccessTokenStrategy } from './jwtAccessToken.strategy';
import { JwtRefreshTokenStrategy } from './jwtRefreshToken.strategy';
import { JwtModule } from '@nestjs/jwt/dist/jwt.module';
import { MailModule } from '../mail/mail.module';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, UserRole]),JwtModule.register({}), MailModule, RolesModule],
  controllers: [AuthController],
  providers: [AuthService,JwtAccessTokenStrategy,JwtRefreshTokenStrategy],
})
export class AuthModule {}
