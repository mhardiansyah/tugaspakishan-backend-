import { IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  name: string;
}

export class UpdateRoleDto {
  @IsString()
  @IsOptional()
  name?: string;
}
