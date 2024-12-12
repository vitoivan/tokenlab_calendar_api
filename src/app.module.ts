import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envConfig } from './common/config';
import { HealthCheckModule } from './healthcheck/healthcheck.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [envConfig],
    }),
    HealthCheckModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
