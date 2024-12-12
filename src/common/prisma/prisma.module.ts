import { Module } from '@nestjs/common';
import { PrismaClient } from './client';

@Module({
  providers: [PrismaClient],
  exports: [PrismaClient],
})
export class PrismaModule {}
