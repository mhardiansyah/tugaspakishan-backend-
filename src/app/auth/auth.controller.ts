/* eslint-disable prettier/prettier */
import { Body, Controller, Post, Query } from '@nestjs/common';
import { CreateUserDto } from './auth.user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(
         private readonly authService: AuthService,
    ) {}
    @Post('/register')
    async register(@Body() createUserDto: CreateUserDto) {
      return this.authService.register(createUserDto);
    }
    @Post('/verify-email')
    async verifyEmail(@Body('token') token: string) {
      return this.authService.verifyEmail(token);
    }
    @Post('/login')
    async login(@Body() payload: any) {
      return this.authService.login(payload);
    }
}
