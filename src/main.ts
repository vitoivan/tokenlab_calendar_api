import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from './common/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppConfig } from './common/config/app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors({ origin: '*' });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const configService = app.get<ConfigService<EnvConfig>>(ConfigService);
  const appConfig = configService.get<AppConfig>('app');
  await app.listen(appConfig.port, () => {
    Logger.log(`\n\n ----> Application is running on: http://localhost:${appConfig.port} <---- \n\n`);
  });
}
bootstrap();
