import { IsNotEmpty, IsString } from 'class-validator';

export class AuthRefreshTokenDTO {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
