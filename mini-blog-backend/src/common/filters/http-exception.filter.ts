

import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        if (exception instanceof HttpException) {
            const status = exception.getStatus();
            const resBody = exception.getResponse();
            const message =
                typeof resBody === 'string' ? resBody : (resBody as any).message || (resBody as any).error || resBody;

            response.status(status).json({
                statusCode: status,
                message,
                timestamp: new Date().toISOString(),
            });
        } else {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error',
                timestamp: new Date().toISOString(),
            });
        }
    }
}
