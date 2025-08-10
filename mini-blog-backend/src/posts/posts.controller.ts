

import {
    Controller,
    Post,
    Body,
    UseGuards,
    Request,
    Get,
    Query,
    Delete,
    Param,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { RequestWithUser } from '../common/types/request-with-user';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Posts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
    constructor(private postsService: PostsService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new post' })
    create(@Body() dto: CreatePostDto, @Request() req:RequestWithUser) {
        const userId = req.user.userId;
        return this.postsService.create(dto, userId);
    }

    @Get()
    @ApiOperation({ summary: 'Get your own posts (paginated)' })
    async getAll(@Request() req: RequestWithUser, @Query() query: PaginationQueryDto) {
        const userId = req.user.userId;
        const { data, meta } = await this.postsService.getOwn(userId, query);

        const totalPages = Math.ceil(meta.total / meta.limit) || 0;

        return {
            posts: data,
            totalPages,
            currentPage: meta.page,
        };
    }



    @Delete(':id')
    @ApiOperation({ summary: 'Delete your own post' })
    delete(@Param('id') id: string, @Request() req:RequestWithUser) {
        const userId = req.user.userId;
        return this.postsService.delete(id, userId);
    }
}
