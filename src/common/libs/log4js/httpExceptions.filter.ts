import { Catch, HttpException, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Logger } from './log4j.util';
import _ from 'lodash';

@Catch(HttpException)
export class HttpExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const logFormat = `-----------------------------------------------------------------------
        Request original url: ${request.originalUrl}
        Method: ${request.method}
        IP: ${request.ip}
        Status code: ${status}
        Response: ${`(${exceptionResponse?.message || exception?.message})`}
        -----------------------------------------------------------------------
        `;
    Logger.info(logFormat);
    const error = exceptionResponse?.message || exception?.message;
    let message = 'Service Error';
    if (!_.isEmpty(error) && _.isArray(error)) {
      message = error[0];
    }
    response.status(status).json({
      code: status,
      message: `${status >= 500 ? 'Service Error' : message}`,
    });
  }
}
