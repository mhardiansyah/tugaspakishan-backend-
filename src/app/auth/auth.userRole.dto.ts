import { IsString } from 'class-validator';

export class CreateUserRoleDto {
  @IsString()
  user_id: string;

  @IsString()
  role_id: string;
}
