import { Controller, Post } from '@nestjs/common';

@Controller('auth')
export class UserController {
  constructor() {}

  @Post('/login')
  async login() {
    return;
  }

  @Post('/token/verify')
  async verifyToken() {
    return;
  }

  @Post('/token/refresh')
  async refreshToken() {
    return;
  }
}
