/**
 * Entry point for the application.
 * - Global validation pipe (DTO validation)
 * - Global exception filter (uniform error responses)
 * - Global logging interceptor (request/response logs)
 * - Security middlewares: helmet, rate limiter, compression
 * - Swagger setup
 *
 * Використовувати ts-node-dev для деву: `npm run start:dev`
 */

import { NestFactory } from '@nestjs/core';
import 'reflect-metadata';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import compression from 'compression';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true });
    const logger = new Logger('Bootstrap');

    // Basic security middlewares
    app.use(cookieParser());
    app.use(helmet());
    app.use(
        rateLimit.default({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100, // limit each IP to 100 requests per windowMs
        }),
    );
    app.use(compression());

    // Global validation pipe: whitelisting removes unknown props
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: false,
        }),
    );

    // Global exception filter
    app.useGlobalFilters(new HttpExceptionFilter());

    // Logging interceptor
    app.useGlobalInterceptors(new LoggingInterceptor());

    // Swagger
    const configService = app.get(ConfigService);
    const port = configService.get<number>('port') || 3000;

    const swaggerConfig = new DocumentBuilder()
        .setTitle('Mini-Blog API')
        .setDescription('API documentation for Mini-Blog')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('/api', app, document);

    // Global route prefix
    //app.setGlobalPrefix('api');

    await app.listen(port);
    logger.log(`Application listening on http://localhost:${port}`);
    logger.log(`Swagger available at http://localhost:${port}/api`);
}

bootstrap();
