import { CallHandler, ExecutionContext, HttpException, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Request } from 'express';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(HttpLoggingInterceptor.name);
  private readonly blackList = ['password'];

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();

    const { body, method, url } = request;
    const cleanBody = this.getBodyWithoutBlockedProperties(body);

    this.logger.verbose(`>>> ${method} ${url} ${JSON.stringify(cleanBody)}`);

    return next.handle().pipe(
      tap((response) => {
        if (method === 'GET') {
          return;
        }
        this.logger.verbose(`<<< ${method} ${url} ${JSON.stringify(response || {})}`);
      }),
      catchError((err: any, _: Observable<any>) => {
        if (err instanceof HttpException) {
          const status = err.getStatus();
          this.logger.error(`<<< ${method} ${url} [${status}] ${JSON.stringify(err)}`);
        }
        throw err;
      }),
    );
  }

  private getBodyWithoutBlockedProperties(body: object) {
    const newBody = Object.assign({}, body);
    this.blackList.forEach((prop) => {
      if (body.hasOwnProperty(prop)) {
        delete newBody[prop];
      }
    });

    return newBody;
  }
}
