import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { USER_DEC } from '../constants/decorators';
import { UserModel } from '@/user/models/user.model';

export const User = createParamDecorator((_: unknown, ctx: ExecutionContext): UserModel => {
  const request = ctx.switchToHttp().getRequest();
  return request[USER_DEC] as UserModel;
});
