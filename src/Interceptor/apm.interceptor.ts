import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import * as apm from 'elastic-apm-node';
import { Observable, tap } from 'rxjs';

@Injectable()
export class ApmInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();

    const transaction = apm.startTransaction(
      request.method + ' ' + request.path,
    );
    return next.handle().pipe(
      tap(() => {
        if (transaction) transaction.end();
      }),
    );
  }
}
