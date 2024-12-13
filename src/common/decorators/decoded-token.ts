import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { DECODED_TOKEN_DEC } from '../constants/decorators';
import { AuthTokenPayloadDTO } from '@/auth/dtos/auth-token-payload.dto';

export const DecodedToken = createParamDecorator((_: unknown, ctx: ExecutionContext): AuthTokenPayloadDTO => {
  const request = ctx.switchToHttp().getRequest();
  return request[DECODED_TOKEN_DEC] as AuthTokenPayloadDTO;
});
