import { CallHandler, ExecutionContext, NestInterceptor, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Logger } from './log4j.util';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    return next.handle().pipe(
      map((respond) => {
        const logFormat = `-----------------------------------------------------------------------
        Request original url: ${req.originalUrl}
        Method: ${req.method}
        IP: ${req.ip}
        User: ${JSON.stringify(req.user)}
        Response data: ${JSON.stringify(respond.data)}
        -----------------------------------------------------------------------`;
        Logger.info(logFormat);
        Logger.access(logFormat);
        return respond;
      })
    );
  }
}
