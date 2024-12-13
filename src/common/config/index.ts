import { appConfig, AppConfig } from './app';
import { DatabaseConfig, databaseConfig } from './database';
import { jwtConfig, JWTConfig } from './jwt';

export type EnvConfig = {
  database: DatabaseConfig;
  app: AppConfig;
  jwt: JWTConfig;
};

export function envConfig(): EnvConfig {
  return {
    app: appConfig(),
    database: databaseConfig(),
    jwt: jwtConfig(),
  };
}
