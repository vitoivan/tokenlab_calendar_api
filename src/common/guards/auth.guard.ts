import { AuthTokensService } from '@/auth/services/auth-tokens.service';
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, HttpException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { JsonWebTokenError } from '@nestjs/jwt';
import { GetUserByIdService } from '@/user/services/get-user-by-id.service';
import { DECODED_TOKEN_DEC, IS_PUBLIC_DEC, USER_DEC } from '../constants/decorators';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly tokenService: AuthTokensService,
    private readonly getUserByIdService: GetUserByIdService,
    private reflector: Reflector,
  ) {}

  private isPublic(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_DEC, [
      context.getHandler(),
      context.getClass(),
    ]);
    return isPublic;
  }

  private extractAccessTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.isPublic(context)) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const token = this.extractAccessTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('missing token');
    }

    try {
      const payload = await this.tokenService.verifyToken(token);
      request[DECODED_TOKEN_DEC] = payload;
      const user = await this.getUserByIdService.execute(payload.id);
      request[USER_DEC] = user;
      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw new UnauthorizedException('invalid token');
      }
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('invalid token');
      }
      throw error;
    }
  }
}
