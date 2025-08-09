/**
 * Root application module.
 *
 * Імпортуємо: конфіг, prisma, auth, users, posts.
 * Використовується DI (Dependency Injection) через NestJS.
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AppController } from './app.controller';

@Module({
    imports: [
        // Configuration module (global)
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
        }),
        PrismaModule,
        AuthModule,
        UsersModule,
        PostsModule,
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
