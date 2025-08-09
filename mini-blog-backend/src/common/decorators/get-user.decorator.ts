/**
 * @GetUser() decorator
 * Витягує user з request (після Passport JwtStrategy).
 *
 * Використання:
 * @GetUser() user
 * або @GetUser('userId') userId
 */

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;
    return data ? user?.[data] : user;
});
