import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDTO {
  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;
  @IsString()
  @IsOptional()
  name?: string;

  // TOOD: remove this and create a specific flow to update password
  @IsString()
  @IsOptional()
  password?: string;
}
