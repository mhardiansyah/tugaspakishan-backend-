/* eslint-disable prettier/prettier */
import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from './auth.user.dto';
import { JwtGuard, JwtGuardRefreshToken } from './auth.guard';
import { Responsesuccess } from '../interface/respon.interface';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../utils/decorator/roles.decorator';
import { REQUEST } from '@nestjs/core';

@Controller('auth')
export class AuthController {
    constructor(
         private readonly authService: AuthService,
             @Inject(REQUEST) private readonly request: any,
         
    ) {}
    @Post('/register')
    async register(@Body() payload: UserDto) {
      return this.authService.register(payload);
    }
    @Get('/verify-email')
    async verifyEmail(@Query('token') token: string) {
      return this.authService.verifyEmail(token);
    }
    @Post('/login')
    async login(@Body() payload: any) {
      return this.authService.login(payload);
    }
    @UseGuards(JwtGuardRefreshToken)
  @Get('refresh-token')
  async refreshToken(@Req() req) {
    const token = req.headers.authorization.split(' ')[1];
    const id = req.headers.id;
    return this.authService.refreshToken(id, token);
  }
  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  async resendVerification(@Body('email') email: string): Promise<Responsesuccess> {
    return this.authService.resendVerification(email);
  }

  @Get('profile')
  @UseGuards(JwtGuard)
  async getProfile() {
    return this.authService.getProfile();
  }

  @Get('profile-Admin')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('admin')
  async getProfileAdmin() {
    return this.authService.getProfileAdmin();
  }

  @Get('profile/list/member')
  @UseGuards(JwtGuard,RolesGuard)
  @Roles('admin', 'user')
  async getProfileMember() {
    return this.authService.getProfileMember();
  }

}
