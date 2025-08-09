/**
 * Simple request/response logging interceptor.
 * Логування запитів/відповідей (метод, шлях, статус, час виконання).
 *
 * У prod можна замінити на більш серйозне логування (Winston, Pino).
 */

import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger('HTTP');

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest();
        const { method, originalUrl } = req;
        const now = Date.now();

        return next.handle().pipe(
            tap(() => {
                const res = context.switchToHttp().getResponse();
                const statusCode = res.statusCode;
                const elapsed = Date.now() - now;
                this.logger.log(`${method} ${originalUrl} ${statusCode} - ${elapsed}ms`);
            }),
        );
    }
}
