/**
 * PrismaService wraps PrismaClient and implements Nest lifecycle hooks.
 * Це забезпечує автоматичне підключення/відключення при старті/зупинці модуля.
 */

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
