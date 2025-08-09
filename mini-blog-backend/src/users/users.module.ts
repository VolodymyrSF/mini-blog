/**
 * UsersModule — реєструє UsersService та UsersRepository.
 * Експортує UsersService для AuthModule (щоб AuthService міг інжектитись).
 */

import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { PrismaModule } from '../database/prisma.module';
import { UsersController } from './users.controller';

@Module({
    imports: [PrismaModule],
    providers: [UsersService, UsersRepository],
    controllers: [UsersController],
    exports: [UsersService],
})
export class UsersModule {}
