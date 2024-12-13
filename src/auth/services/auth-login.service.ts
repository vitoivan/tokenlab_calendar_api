import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthLoginDTO } from '../dtos/auth-login.dto';
import { AuthLoginResponseDTO } from '../dtos/auth-login-response.dto';
import { GetUserByEmailService } from '@/user/services/get-user-by-email.service';
import { compare } from 'bcrypt';
import { UserModel } from '@/user/models/user.model';
import { AuthTokensService } from './auth-tokens.service';

@Injectable()
export class AuthLoginService {
  constructor(
    private readonly getUserByEmailService: GetUserByEmailService,
    private readonly authTokenService: AuthTokensService,
  ) {}

  private async getUserByEmail(email: string): Promise<UserModel> {
    try {
      return await this.getUserByEmailService.execute(email);
    } catch (e) {
      if (e instanceof HttpException && e.getStatus() === 404) {
        throw new UnauthorizedException('invalid email or password');
      }
      throw e;
    }
  }

  async execute(dto: AuthLoginDTO): Promise<AuthLoginResponseDTO> {
    const user = await this.getUserByEmail(dto.email);

    const isPasswordValid = await compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('invalid email or password');
    }

    const accessToken = await this.authTokenService.generateAccessToken(user);
    const refreshToken = await this.authTokenService.generateRefreshToken(user);

    return {
      accessToken,
      refreshToken,
    };
  }
}
