import { envConfig } from '@/common/config';
import { EnvironmentEnum } from '@/common/enums/environment';
import { UserMemoryRepository } from './user-memory.repository';
import { UserPrismaRepository } from './user-prisma.repository';
import { Logger } from '@nestjs/common';

export function usersRepositoryFactory() {
  const env = envConfig();

  switch (env.app.environment) {
    case EnvironmentEnum.TEST:
    case EnvironmentEnum.DEV:
      Logger.debug(`using in-memory user repository`);
      return UserMemoryRepository;
    case EnvironmentEnum.HMG:
    case EnvironmentEnum.PROD:
      Logger.debug(`using prisma user repository`);
      return UserPrismaRepository;
    default:
      Logger.debug(`invalid environment: ${env.app.environment}, using default prisma repository`);
      return UserPrismaRepository;
  }
}
