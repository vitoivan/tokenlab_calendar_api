import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { AuthLoginService } from './services/auth-login.service';
import { AuthRefreshTokenService } from './services/auth-refresh-token.service';
import { AuthLoginDTO } from './dtos/auth-login.dto';
import { AuthRefreshTokenDTO } from './dtos/auth-refresh-token.dto';
import { HttpLoggingInterceptor } from '@/common/middlewares/logging.interceptor';

@UseInterceptors(HttpLoggingInterceptor)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginService: AuthLoginService,
    private readonly refreshTokenService: AuthRefreshTokenService,
  ) {}

  @Post('/login')
  async login(@Body() dto: AuthLoginDTO) {
    return await this.loginService.execute(dto);
  }

  @Post('/token/refresh')
  async refreshToken(@Body() dto: AuthRefreshTokenDTO) {
    return await this.refreshTokenService.execute(dto);
  }
}
