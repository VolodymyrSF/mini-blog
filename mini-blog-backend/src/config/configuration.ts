

export default () => ({
    port: parseInt(process.env.PORT || '3000', 10),
    database: {
        url: process.env.DATABASE_URL,
    },
    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET || 'access-secret',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
        accessExpMs: parseInt(process.env.JWT_ACCESS_EXP_MS || '900000', 10), // 15 хв у мс
        refreshExpMs: parseInt(process.env.JWT_REFRESH_EXP_MS || '604800000', 10), // 7 днів у мс
},
});
