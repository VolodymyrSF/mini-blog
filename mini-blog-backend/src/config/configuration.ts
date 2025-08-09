/**
 * Centralized configuration loader.
 * Використовуємо ConfigModule.forRoot(load: [configuration]).
 * Повертає typed конфіг.
 */

export default () => ({
    port: parseInt(process.env.PORT || '3000', 10),
    database: {
        url: process.env.DATABASE_URL,
    },
    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET || 'access-secret',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
        accessExp: process.env.JWT_ACCESS_EXP || '15m',
        refreshExp: process.env.JWT_REFRESH_EXP || '7d',
    },
});
