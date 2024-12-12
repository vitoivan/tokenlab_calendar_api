import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient as _PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaClient extends _PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  constructor() {
    super({
      log: [{ emit: 'event', level: 'query' }, 'info', 'warn', 'error'],
      errorFormat: 'pretty',
    });
  }
}
