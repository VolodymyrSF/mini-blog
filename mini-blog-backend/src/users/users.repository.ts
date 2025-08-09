/**
 * UsersRepository — data access через Prisma.
 * Використовуємо DI: PrismaService інжектиться.
 * Репозиторій абстрагує доступ до БД, відповідає за операції CRUD.
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersRepository {
    constructor(private prisma: PrismaService) {}

    async create(data: CreateUserDto) {
        return this.prisma.user.create({ data });
    }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({ where: { email } });
    }

    async findById(id: string) {
        return this.prisma.user.findUnique({ where: { id } });
    }

    async setRefreshToken(userId: string, tokenHash: string) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: tokenHash },
        });
    }

    async removeRefreshToken(userId: string) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: null },
        });
    }
}
