/**
 * Prisma seed script
 *
 * Створює прикладного користувача (admin) для локальної розробки.
 */

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const hashed = await bcrypt.hash('password123', 10);

    const existing = await prisma.user.findUnique({
        where: { email: 'admin@example.com' },
    });

    if (!existing) {
        await prisma.user.create({
            data: {
                email: 'admin@example.com',
                password: hashed,
                name: 'Admin',
            },
        });
        console.log('Seed: created admin@example.com / password123');
    } else {
        console.log('Seed: admin already exists');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
