import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthTokenPayloadDTO } from '../dtos/auth-token-payload.dto';
import { ConfigService } from '@nestjs/config';
import { JWTConfig } from '@/common/config/jwt';

@Injectable()
export class AuthTokensService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateAccessToken(user: AuthTokenPayloadDTO): Promise<string> {
    const token = this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        name: user.name,
      },
      {
        expiresIn: '4h',
      },
    );

    return token;
  }

  async generateRefreshToken(user: AuthTokenPayloadDTO): Promise<string> {
    const token = this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        name: user.name,
      },
      {
        expiresIn: '7d',
      },
    );

    return token;
  }

  async verifyToken(token: string): Promise<AuthTokenPayloadDTO> {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<JWTConfig>('jwt').secret,
    });

    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
    };
  }
}
