/* eslint-disable prettier/prettier */
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from './auth.user.dto';
import { JwtGuardRefreshToken } from './auth.guard';
import { Responsesuccess } from '../interface/respon.interface';

@Controller('auth')
export class AuthController {
    constructor(
         private readonly authService: AuthService,
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
}
