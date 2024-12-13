import { envConfig } from '@/common/config';
import { EnvironmentEnum } from '@/common/enums/environment';
import { Logger } from '@nestjs/common';
import { EventsPrismaRepository } from './event-prisma.repository';
import { EventsMemoryRepository } from './event-memory.repository';

export function eventsRepositoryFactory() {
  const env = envConfig();

  switch (env.app.environment) {
    case EnvironmentEnum.TEST:
    case EnvironmentEnum.DEV:
      Logger.debug(`using in-memory user repository`);
      return EventsMemoryRepository;
    case EnvironmentEnum.HMG:
    case EnvironmentEnum.PROD:
      Logger.debug(`using prisma user repository`);
      return EventsPrismaRepository;
    default:
      Logger.debug(`invalid environment: ${env.app.environment}, using default prisma repository`);
      return EventsPrismaRepository;
  }
}
