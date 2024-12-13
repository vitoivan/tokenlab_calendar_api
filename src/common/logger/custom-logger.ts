import { Logger } from '@nestjs/common';
import { envConfig } from '../config';
import { EnvironmentEnum } from '../enums/environment';

export class CustomLogger extends Logger {
  env = envConfig().app.environment;

  constructor(context: string) {
    super(context);
  }

  private canLog(): boolean {
    if (this.env === EnvironmentEnum.TEST) {
      return false;
    }
    return true;
  }

  log(message: string, context?: any) {
    if (this.canLog()) {
      super.log(message, context);
    }
  }

  error(message: unknown, stack?: unknown, context?: unknown, ...rest: unknown[]): void {
    if (this.canLog()) {
      super.error(message, stack, context, ...rest);
    }
  }

  warn(message: unknown, context?: unknown, ...rest: unknown[]): void {
    if (this.canLog()) {
      super.warn(message, context, ...rest);
    }
  }

  debug(message: unknown, context?: unknown, ...rest: unknown[]): void {
    if (this.canLog()) {
      super.debug(message, context, ...rest);
    }
  }
}
