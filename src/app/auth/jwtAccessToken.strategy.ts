import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
// jika dia adalah inject table maka dia adalah sebuah service dan dimasukan kedalam modul di providers
export class JwtAccessTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt_access_token',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_TOKEN_SECRET || 'ACCESS_TOKEN_SECRET',
    });
  }

  async validate(payload: any) {
    console.log('payload',payload);
    return payload;
  }
}