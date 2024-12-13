import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envConfig } from './common/config';
import { HealthCheckModule } from './healthcheck/healthcheck.module';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './common/guards/auth.guard';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
    }),
    JwtModule.register({
      global: true,
      secret: envConfig().jwt.secret,
      signOptions: { expiresIn: envConfig().jwt.expiresIn },
    }),
    HealthCheckModule,
    UserModule,
    AuthModule,
    EventsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
