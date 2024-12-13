import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthLoginResponseDTO } from '../dtos/auth-login-response.dto';
import { AuthRefreshTokenDTO } from '../dtos/auth-refresh-token.dto';
import { AuthTokensService } from './auth-tokens.service';
import { GetUserByIdService } from '@/user/services/get-user-by-id.service';
import { UserModel } from '@/user/models/user.model';
import { JsonWebTokenError } from '@nestjs/jwt';
import { CustomLogger } from '@/common/logger/custom-logger';

@Injectable()
export class AuthRefreshTokenService {
  private logger = new CustomLogger(AuthRefreshTokenService.name);

  constructor(
    private readonly authTokenService: AuthTokensService,
    private readonly getUserByIdService: GetUserByIdService,
  ) {}

  private async getUserFromRefreshToken(refreshToken: string): Promise<UserModel> {
    try {
      const tokenData = await this.authTokenService.verifyToken(refreshToken);
      return await this.getUserByIdService.execute(tokenData.id);
    } catch (e) {
      if (e instanceof HttpException && e.getStatus() === 404) {
        this.logger.error('invalid refresh token: user not found');
        throw new UnauthorizedException('invalid refresh token');
      }
      if (e instanceof JsonWebTokenError) {
        this.logger.error('invalid refresh token: json web token error: ' + e.message);
        throw new UnauthorizedException('invalid refresh token');
      }
      this.logger.error('invalid refresh token: unknown error ' + e.message);
      throw e;
    }
  }

  async execute(dto: AuthRefreshTokenDTO): Promise<AuthLoginResponseDTO> {
    const user = await this.getUserFromRefreshToken(dto.refreshToken);

    const accessToken = await this.authTokenService.generateAccessToken(user);
    const refreshToken = await this.authTokenService.generateRefreshToken(user);

    return {
      accessToken,
      refreshToken,
    };
  }
}
