/**
 * CreatePostDto — валідація для створення поста.
 */

import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
    @ApiProperty({ example: 'My first post' })
    @IsNotEmpty()
    @MinLength(3)
    title: string;

    @ApiProperty({ example: 'This is the content of my first post' })
    @IsNotEmpty()
    @MinLength(10)
    content: string;
}
