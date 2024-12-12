import { appConfig, AppConfig } from './app';
import { DatabaseConfig, databaseConfig } from './database';

export type EnvConfig = {
  database: DatabaseConfig;
  app: AppConfig;
};

export function envConfig(): EnvConfig {
  return {
    app: appConfig(),
    database: databaseConfig(),
  };
}
