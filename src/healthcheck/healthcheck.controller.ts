import { Controller, HttpCode, HttpStatus } from '@nestjs/common';

@Controller('/healthcheck')
export class HealthCheckController {
  @HttpCode(HttpStatus.OK)
  get() {
    return 'OK';
  }
}
