/**
 * CreateUserDto — використовується тільки для створення користувача.
 */

import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ example: 'john@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'password123' })
    @MinLength(6)
    password: string;

    @ApiProperty({ example: 'John Doe' })
    @IsNotEmpty()
    name: string;
}
