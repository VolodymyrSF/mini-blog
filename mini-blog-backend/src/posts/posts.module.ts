/**
 * PostsModule — реєструє PostsController, PostsService та PostsRepository.
 */

import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostsRepository } from './posts.repository';
import { PrismaModule } from '../database/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [PostsController],
    providers: [PostsService, PostsRepository],
})
export class PostsModule {}
