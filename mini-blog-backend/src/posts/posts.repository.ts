/**
 * PostsRepository — абстрагує Prisma для роботи з постами.
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsRepository {
    constructor(private prisma: PrismaService) {}

    async create(data: CreatePostDto & { userId: string }) {
        return this.prisma.post.create({ data });
    }

    async findAllByUser(userId: string, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const posts = await this.prisma.post.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
        });
        const total = await this.prisma.post.count({ where: { userId } });
        return { data: posts, meta: { total, page, limit } };
    }

    async deleteOwnPost(id: string, userId: string) {
        // Використовуємо deleteMany, щоб уникнути помилок доступу; перевірка count
        return this.prisma.post.deleteMany({ where: { id, userId } });
    }
}
