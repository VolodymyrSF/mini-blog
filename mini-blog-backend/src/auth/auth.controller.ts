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
import {ApiTags, ApiOperation, ApiBearerAuth, ApiCookieAuth} from '@nestjs/swagger';
import { GetUser } from '../common/decorators/get-user.decorator';
import { Response, Request } from 'express';
import {JwtUser} from "../common/types/user-from-jwt.interface";
import {ConfigService} from "@nestjs/config";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService,
    private configService: ConfigService,) {}

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
    async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
        try {
            const tokens = await this.authService.login(dto.email, dto.password);

            const accessMaxAge = this.configService.get<number>('jwt.accessExpMs');
            const refreshMaxAge = this.configService.get<number>('jwt.refreshExpMs');

            res.cookie('refreshToken', tokens.refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: refreshMaxAge,
                path: '/auth/refresh',
            });

            res.cookie('accessToken', tokens.accessToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: accessMaxAge,
            });

            return { message: 'Login successful' };
        } catch (error) {
            console.error('🔥 Error in login controller:', error);
            throw error;
        }
    }


    @Post('refresh')
    @ApiOperation({ summary: 'Rotate tokens using refresh token' })
    async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const refreshToken = req.cookies['refreshToken'];
        if (!refreshToken) throw new UnauthorizedException('Refresh token required');

        const tokens = await this.authService.refreshTokens(refreshToken);

        const accessMaxAge = this.configService.get<number>('jwt.accessExpMs');
        const refreshMaxAge = this.configService.get<number>('jwt.refreshExpMs');

        // Новий accessToken
        res.cookie('accessToken', tokens.accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: accessMaxAge,
        });

        // Новий refreshToken
        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: refreshMaxAge,
            path: '/auth/refresh',
        });

        return { message: 'Tokens refreshed' };
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard) // ОБОВ’ЯЗКОВО, інакше нема user
    @ApiCookieAuth() // Щоб Swagger знав, що треба токен
    @ApiOperation({ summary: 'Logout (invalidate refresh token)' })
    async logout(@GetUser('userId') userId: string, @Res({ passthrough: true }) res: Response) {
        await this.authService.logout(userId);
        res.clearCookie('refreshToken', { path: '/auth/refresh', secure: false, sameSite: 'lax' });
        res.clearCookie('accessToken', { httpOnly: true, secure: false, sameSite: 'lax' });
        return { message: 'Logged out' };
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiCookieAuth()
    @ApiOperation({ summary: 'Get current user info (from access token)' })
    me(@GetUser() user: JwtUser) {
        return user;
    }

}
