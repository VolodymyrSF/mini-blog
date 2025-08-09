/**
 * Passport JWT strategy.
 * Валідатор токену (access token).
 * validate() повертає payload, який потім буде доступний через req.user
 */

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                ExtractJwt.fromAuthHeaderAsBearerToken(),
                (req: Request) => {
                    return req.cookies?.accessToken || null;
                },
            ]),
            ignoreExpiration: false,
            secretOrKey: config.get<string>('jwt.accessSecret'),
        });
    }

    async validate(payload: any) {
        return {
            userId: payload.sub,
            email: payload.email,
            name: payload.name,
        };
    }
}
