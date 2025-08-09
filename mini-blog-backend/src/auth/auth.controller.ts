/**
 * AuthController:
 * - /auth/register
 * - /auth/login
 * - /auth/refresh
 * - /auth/logout
 * - /auth/me
 *
 * Використовує AuthService для логіки.
 */

import {
    Body,
    Controller,
    Post,
    UseGuards,
    Get,
    Req,
    UnauthorizedException, Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GetUser } from '../common/decorators/get-user.decorator';
import { Response, Request } from 'express';
import {JwtUser} from "../common/types/user-from-jwt.interface";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }
/*
    @Post('login')
    @ApiOperation({ summary: 'Login and receive tokens' })
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto.email, dto.password);
    }


    @Post('refresh')
    @ApiOperation({ summary: 'Rotate tokens using refresh token' })
    async refresh(@Body('refreshToken') refreshToken: string) {
        if (!refreshToken) throw new UnauthorizedException('Refresh token required');
        return this.authService.refreshTokens(refreshToken);
    }

     */

    @Post('login')
    @ApiOperation({ summary: 'Login and receive tokens' })
    async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
        const tokens = await this.authService.login(dto.email, dto.password);

        // Встановлюємо refresh token в httpOnly cookie
        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 днів
            path: '/auth/refresh', // cookie доступний лише на цьому шляху
        });

        // 🔥 Set accessToken
        res.cookie('accessToken', tokens.accessToken, {
            httpOnly: true, // або false, якщо фронту треба читати
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000, // 15 хв
        });

        return { message: 'Login successful' };
    }

    @Post('refresh')
    @ApiOperation({ summary: 'Rotate tokens using refresh token' })
    async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const refreshToken = req.cookies['refreshToken'];
        if (!refreshToken) throw new UnauthorizedException('Refresh token required');

        const tokens = await this.authService.refreshTokens(refreshToken);

        // Оновлюємо refresh token в cookie
        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/auth/refresh',
        });

        // Віддаємо новий access token
        return { refreshToken: tokens.refreshToken };
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard) // ОБОВ’ЯЗКОВО, інакше нема user
    @ApiBearerAuth() // Щоб Swagger знав, що треба токен
    @ApiOperation({ summary: 'Logout (invalidate refresh token)' })
    async logout(@GetUser('userId') userId: string, @Res({ passthrough: true }) res: Response) {
        await this.authService.logout(userId);
        res.clearCookie('refreshToken', { path: '/auth/refresh' });
        return { message: 'Logged out' };
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get current user info (from access token)' })
    me(@GetUser() user: JwtUser) {
        return user;
    }

}
