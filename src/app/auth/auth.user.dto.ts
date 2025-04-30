import { PickType } from '@nestjs/mapped-types';
import { IsString, IsEmail, IsBoolean, IsOptional } from 'class-validator';

export class UserDto {
  @IsString()
  name: string;
  @IsEmail()
  email: string;

  @IsString()
  password: string;
  
  @IsBoolean()
  @IsOptional()
  is_email_verified?: boolean;

  
  @IsString()
  @IsOptional()
  verification_token?: string;

  @IsString()
  @IsOptional()
  verification_token_expiry?: Date;

  @IsString()
  @IsOptional()
  token_expires_at?: string;

  @IsString()
  role_id: string;
}

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsBoolean()
  @IsOptional()
  is_email_verified?: boolean;

  @IsString()
  @IsOptional()
  verification_token?: string;

  @IsString()
  @IsOptional()
  token_expires_at?: string;
  @IsString()
  refresh_token: string;
}

export class RegisterDto extends PickType(UserDto, [
  "name",
  "email",
  "password",
]) {}

export class LoginDto extends PickType(UserDto,[
  "email",
  "password",
]) {}
