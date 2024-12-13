import { Module } from '@nestjs/common';
import { UserModule } from '@/user/user.module';
import { AuthLoginService } from './services/auth-login.service';
import { AuthRefreshTokenService } from './services/auth-refresh-token.service';
import { AuthController } from './auth.controller';
import { AuthTokensService } from './services/auth-tokens.service';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthTokensService, AuthLoginService, AuthRefreshTokenService],
  exports: [AuthTokensService],
})
export class AuthModule {}
