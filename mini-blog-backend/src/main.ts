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
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const port = configService.get<number>('port') || 3000;

    app.use(cookieParser());
    app.use(helmet({ crossOriginResourcePolicy: false }));
    app.use(
        rateLimit.default({
            windowMs: 15 * 60 * 1000,
            max: 500,
        }),
    );
    app.use(compression());


    app.enableCors({
        origin: 'http://localhost:3002',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        preflightContinue: false,
        optionsSuccessStatus: 204,
    });




    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: false,
        }),
    );

    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new LoggingInterceptor());

    const swaggerConfig = new DocumentBuilder()
        .setTitle('Mini-Blog API')
        .setDescription('API documentation for Mini-Blog')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('/api', app, document);

    await app.listen(port);
    const logger = new Logger('Bootstrap');
    logger.log(`Application listening on http://localhost:${port}`);
    logger.log(`Swagger available at http://localhost:${port}/api`);
}

bootstrap();
