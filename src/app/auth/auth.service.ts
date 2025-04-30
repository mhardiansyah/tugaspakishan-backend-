/* eslint-disable prettier/prettier */
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './auth.users.entity';
import { Any, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './../../../node_modules/@types/jsonwebtoken/index.d';
import baseResponse from '../utils/response.utils';
import * as crypto from 'crypto';
import { MailService } from '../mail/mail.service';
import { Responsesuccess } from '../interface';
import { LoginDto, UserDto } from './auth.user.dto';
import { compare, hash } from 'bcrypt';
import { use } from 'passport';
import { Role } from '../roles/auth.roles.entity';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class AuthService extends baseResponse {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    // @InjectRepository(ResetPassword)

    // private readonly resetPasswordRepository: Repository<ResetPassword>,
    private JwtService: JwtService,
    private mailService: MailService,

    @Inject(REQUEST) private readonly request: any,
  ) {
    super();
  }
  generateJWT(payload: JwtPayload, expiresIn: string | number, token: string) {
    return this.JwtService.sign(payload, {
      secret: token,
      expiresIn: expiresIn,
    });
  } //membuat method untuk generate jwt
  async register(payload: UserDto): Promise<Responsesuccess> {
    const existingUser = await this.userRepository.findOne({
      where: { email: payload.email },
    });
    if (existingUser) {
      throw new HttpException(
        'The email address is already registered.',
        HttpStatus.CONFLICT,
      );
    }
  
    payload.password = await hash(payload.password, 12);
    payload.verification_token_expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const role = await this.roleRepository.findOne({ where: { name: 'member' } }); // cari role default
    if (!role) {
      throw new HttpException('Default role not found', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  
    const newUser = this.userRepository.create({
      ...payload,
      is_email_verified: false,
      verification_token: crypto.randomBytes(32).toString('hex'),
      role: role, // set sebagai objek, bukan string ID
    });
  
    await this.userRepository.save(newUser);
  
    return this._success('success', {
      success: true,
      message: 'User registered successfully. Please verify your email.',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: role.name,
        is_email_verified: newUser.is_email_verified,
        verification_token_expiry: newUser.verification_token_expiry,
      },
      verification_token: newUser.verification_token,
    });
  }

  async verifyEmail(token: string): Promise<Responsesuccess> {
    const user = await this.userRepository.findOne({
      where: { verification_token: token },
      relations: ['role'],
    });

    if (!user) {
      throw new HttpException(
        'Invalid or expired verification token',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (new Date() > user.verification_token_expiry) {
      throw new HttpException(
        'Verification token has expired. Please request a new one.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (user.is_email_verified) {
      return this._success('success', {
        success: true,
        message: 'Email already verified.',
      });
    }

    user.is_email_verified = true;
    user.verification_token = String(null); // Remove token after verification
    

    await this.userRepository.save(user);

    return this._success('success', {
      success: true,
      message: 'Email verified successfully.',
    });
  }

  async refreshToken(id: string, token: string): Promise<Responsesuccess> {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
        refresh_token: token,
      },
      relations: ['role'],
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        refresh_token: true,
      },
    });
    if (user === null) {
      throw new UnauthorizedException();
    }

    const JwtPayload: jwtPayload = {
      id: user.id,
      nama: user.name,
      email: user.email,
      role: user.role.name,
    };

    const access_token = this.generateJWT(
      JwtPayload,
      30,
      process.env.ACCESS_TOKEN_SECRET || 'ACCESS_TOKEN_SECRET',
    );

    const refresh_token = this.generateJWT(
      JwtPayload,
      '1d',
      process.env.REFRESH_TOKEN_SECRET || 'REFRESH_TOKEN_SECRET',
    );
    await this.userRepository.update(
      {
        id: id,
      },
      {
        refresh_token: refresh_token,
      },
    );

    return this._success('success', {
      ...user,
      access_token: access_token,
      refresh_token: refresh_token,
    });
  }

  async login(payload: LoginDto): Promise<Responsesuccess> {
    const checklogin = await this.userRepository.findOne({
      where: { email: payload.email },
      relations: ['role'],
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        refresh_token: true,
      },
    });

    if (!checklogin) {
      throw new UnauthorizedException('User not found');
    }

    if (checklogin.is_email_verified == false) {
      throw new UnauthorizedException('Email not verified');
    }

    console.log('User Found:', checklogin);

    const checkpassword = await compare(payload.password, checklogin.password);
    console.log('Plain Password:', payload.password);
    console.log('Hashed Password:', checklogin.password);
    console.log('Password Match:', checkpassword);

    if (!checkpassword) {
      throw new UnauthorizedException('Invalid password');
    }

    const JwtPayload: jwtPayload = {
      id: checklogin.id,
      nama: checklogin.name,
      email: checklogin.email,
      role: checklogin.role.name,
    };

    const access_token = this.generateJWT(
      JwtPayload,
      '1d',
      process.env.ACCESS_TOKEN_SECRET || 'ACCESS_TOKEN_SECRET',
    );

    const refresh_token = this.generateJWT(
      JwtPayload,
      '1d',
      process.env.REFRESH_TOKEN_SECRET || 'REFRESH_TOKEN_SECRET',
    );

    await this.userRepository.update(
      {
        id: checklogin.id,
      },
      {
        refresh_token: refresh_token,
      },
    );

    return this._success('success', {
      ...checklogin,
      access_token: access_token,
      refresh_token: refresh_token,
    });
  }

  async resendVerification(email: string): Promise<Responsesuccess> {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (user.is_email_verified) {
      return this._success('success', {
        success: true,
        message: 'Email is already verified.',
      });
    }

    // Generate a new verification token
    user.verification_token = crypto.randomBytes(32).toString('hex');
    await this.userRepository.save(user);

    // Send verification email
    // await this.mailService.sendVerificationEmail(
    //   user.email,
    //   user.verification_token,
    // );

    return this._success('success', {
      success: true,
      message: 'Verification email resent successfully.',
      verification_token: user.verification_token,
    });
  }

  async getProfile() {
    const User = await this.userRepository.findOne({
      where: { id: this.request.user.id },
      relations: ['role'],
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        is_email_verified: true,
        verification_token_expiry: true,
      },
    })



    if (!User) {
      throw new UnauthorizedException('User not found');
    }

    if (!User.is_email_verified) {
      throw new ForbiddenException('Email belum diverifikasi');
    }
    return this._success('success', {
      success: true,
      message: 'Profile fetched successfully.',
      User: {
        id: User?.id,
        name: User?.name,
        email: User?.email,
        role: User.role?.name,
        is_email_verified: User?.is_email_verified,
        verification_token_expiry: User?.verification_token_expiry,
      }
    });
  }

  async getProfileAdmin() {
    const User = await this.userRepository.findOne({
      where: { 
        role: { name: 'admin' } },
      relations: ['role'],
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        is_email_verified: true,
        verification_token_expiry: true,
      },
    })

    if(User?.role?.name !== 'admin') {
      throw new UnauthorizedException('tidak bisa akses');
    }



    if (!User.is_email_verified) {
      throw new ForbiddenException('Email belum diverifikasi');
    }
    return this._success('success', {
      success: true,
      message: 'Profile fetched successfully.',
      User: {
        id: User?.id,
        name: User?.name,
        email: User?.email,
        role: User.role?.name,
        is_email_verified: User?.is_email_verified,
        verification_token_expiry: User?.verification_token_expiry,
      }
    });
  }

  async getProfileMember() {
    const User = await this.userRepository.findOne({
      where: { 
        role: { name: 'member' } },
      relations: ['role'],
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        is_email_verified: true,
        verification_token_expiry: true,
      },
    })
    
    return this._success('success', {
      success: true,
      message: 'Profile fetched successfully.',
      User: {
        id: User?.id,
        name: User?.name,
        email: User?.email,
        role: User?.role?.name,
        is_email_verified: User?.is_email_verified,
        verification_token_expiry: User?.verification_token_expiry,
      }
    });
  }
}
