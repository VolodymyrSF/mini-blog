/**
 * AuthService — вся логіка аутентифікації:
 * - реєстрація
 * - логін
 * - генерація токенів (access + refresh)
 * - refresh token rotation and verification
 * - logout (видалення refresh token)
 *
 * Стратегія зберігання refresh token: зберігаємо **хеш** refresh token в базі.
 * При refresh — порівнюємо bcrypt.compare(provided, storedHash).
 */

import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    // Перевіряємо email/password
    async validateUser(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new UnauthorizedException('Invalid credentials');

        return user;
    }

    // Реєстрація: хеш пароля, створити юзера
    async register(dto: { email: string; password: string; name: string }) {
        const existing = await this.usersService.findByEmail(dto.email);
        if (existing) throw new ConflictException('Email already in use');

        const hashed = await bcrypt.hash(dto.password, 10);
        const user = await this.usersService.create({ ...dto, password: hashed });

        // Не створюємо токени автоматично (можна змінити під вимогу)
        return { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt };
    }

    // Генеруємо access + refresh
    async generateTokens(user: { id: string; email: string, name: string }) {
        const payload = { sub: user.id, email: user.email,name: user.name };

        const accessToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('jwt.accessSecret'),
            expiresIn: this.configService.get<string>('jwt.accessExp'),
        });

        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('jwt.refreshSecret'),
            expiresIn: this.configService.get<string>('jwt.refreshExp'),
        });

        return { accessToken, refreshToken };
    }

    // Логін: повертаємо токени + зберігаємо хеш refresh token
    async login(email: string, password: string,name:string) {
        const user = await this.validateUser(email, password);
        const tokens = await this.generateTokens({ id: user.id, email: user.email, name: user.name});

        // Хешуємо refresh token і зберігаємо
        const refreshHash = await bcrypt.hash(tokens.refreshToken, 10);
        await this.usersService.setCurrentRefreshToken(user.id, refreshHash);

        return tokens;
    }

    // Refresh: verify token signature, перевірити що збережений хеш відповідає
    async refreshTokens(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>('jwt.refreshSecret'),
            });

            const user = await this.usersService.findById(payload.sub);
            if (!user || !user.refreshToken) throw new UnauthorizedException('Access denied');

            const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
            if (!isValid) throw new UnauthorizedException('Access denied');

            // Generate new tokens and persist new refresh hash (rotation)
            const tokens = await this.generateTokens({ id: user.id, email: user.email, name: user.name});
            const newHash = await bcrypt.hash(tokens.refreshToken, 10);
            await this.usersService.setCurrentRefreshToken(user.id, newHash);

            return tokens;
        } catch (e) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    // Logout: видаляємо refresh token з бази
    async logout(userId: string) {
        await this.usersService.removeRefreshToken(userId);
    }
}
