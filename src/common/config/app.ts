import { EnvironmentEnum } from '../enums/environment';

export type AppConfig = {
  port: number;
  environment: EnvironmentEnum;
};

export function appConfig(): AppConfig {
  return {
    port: parseInt(process.env.PORT ?? '3000', 10) || 3000,
    environment: (process.env.NODE_ENV as EnvironmentEnum) || EnvironmentEnum.HMG,
  };
}
