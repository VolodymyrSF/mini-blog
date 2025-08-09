/**
 * PostsService — бізнес-логіка над постами.
 * Гарантує, що користувач може працювати тільки зі своїми постами.
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';

@Injectable()
export class PostsService {
    constructor(private repo: PostsRepository) {}

    async create(dto: CreatePostDto, userId: string) {
        return this.repo.create({ ...dto, userId });
    }

    async getOwn(userId: string, query: PaginationQueryDto) {
        return this.repo.findAllByUser(userId, query.page, query.limit);
    }

    async delete(id: string, userId: string) {
        const result = await this.repo.deleteOwnPost(id, userId);
        if (result.count === 0) {
            throw new NotFoundException('Post not found or not owned by user');
        }
        return { message: 'Post deleted' };
    }
}
