/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { User } from './auth.users.entity';
import { Any, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './../../../node_modules/@types/jsonwebtoken/index.d';
import baseResponse from '../utils/response.utils';
import * as crypto from 'crypto';
import { CreateUserDto } from './auth.user.dto';
import { MailService } from '../mail/mail.service';
import { Responsesuccess } from '../interface';

@Injectable()
export class AuthService extends baseResponse {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    // @InjectRepository(ResetPassword)

    // private readonly resetPasswordRepository: Repository<ResetPassword>,
    private JwtService: JwtService,
    private mailService: MailService,

    // @Inject(REQUEST) private readonly request: any,
  ) {
    super();
  }
  generateJWT(payload: JwtPayload, expiresIn: string | number, token: string) {
    return this.JwtService.sign(payload, {
      secret: token,
      expiresIn: expiresIn,
    });
  } //membuat method untuk generate jwt
  async register(createUserDto: CreateUserDto): Promise<Responsesuccess> {
    // Periksa apakah email sudah ada
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new Error('Email already exists'); // Atau gunakan HttpException untuk respons HTTP yang lebih baik
    }

    // Buat pengguna baru
    const user = this.userRepository.create(createUserDto);
    user.is_email_verified = false;
    user.verification_token = crypto.randomBytes(32).toString('hex');
    await this.userRepository.save(user);

    // Kirim token verifikasi dalam respons
    return this._success('success', {
      success: true,
      message: 'User registered successfully. Please verify your email.',
      verification_token: user.verification_token,
    });
  }
  async verifyEmail(token: string): Promise<Responsesuccess> {
    const user = await this.userRepository.findOne({ where: { verification_token: token } });
  
    if (!user) {
      throw new Error('Invalid or expired verification token');
    }
  
    if (user.is_email_verified) {
      return this._success('success', {
        success: true,
        message: 'Email already verified.',
      });
    }
  
    user.is_email_verified = true;
    user.verification_token = String(null); // setelah verifikasi, token dihapus
    await this.userRepository.save(user);
  
    return this._success('success', {
      success: true,
      message: 'Email verified successfully.',
    });
  }

  async login(payload: any) {}
}
