

import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const user = await this.usersService.findById(id);
        if (!user) return { message: 'User not found' };
        const { password, refreshToken, ...rest } = user as any;
        return rest;
    }
}
