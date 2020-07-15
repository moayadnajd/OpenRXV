import { Module } from '@nestjs/common';

import { BullModule } from '@nestjs/bull';
import { TasksService } from './services/tasks.service';
import { HarvesterService } from './services/harveter.service';
import { FetchConsumer } from './consumers/fetch.consumer';
import { SharedModule } from 'src/shared/shared.module';
import { JsonFilesService } from 'src/admin/json-files/json-files.service';
import { HarvesterController } from './harvester/harvester.controller';
import { PluginsConsumer } from './consumers/plugins.consumer';
import { ConfigModule } from '@nestjs/config';
@Module({
    providers: [TasksService, HarvesterService, FetchConsumer, JsonFilesService, PluginsConsumer],
    exports: [HarvesterService, SharedModule, BullModule],
    imports: [
        ConfigModule.forRoot(),
        SharedModule,
        BullModule.registerQueue({
            name: 'fetch',
            defaultJobOptions: {
                delay: 1000,
                attempts: 5,
                lifo: true,
            },
            settings: {
                lockDuration: 90000,
                retryProcessDelay: 10000,
                maxStalledCount: 2,
                drainDelay: 10000
            },
            redis: {
                host: process.env.REDIS_HOST,
                port: parseInt(process.env.REDIS_PORT)
            },
        }),
        BullModule.registerQueue({
            name: 'plugins',
            defaultJobOptions: {
                delay: 1000,
                attempts: 5,
                lifo: true,
            },
            settings: {
                lockDuration: 90000,
                retryProcessDelay: 5000,
                drainDelay: 9000,
                maxStalledCount: 2,
            },
            redis: {
                host: process.env.REDIS_HOST,
                port: parseInt(process.env.REDIS_PORT)
            },
        }),
    ],
    controllers: [HarvesterController]
})
export class HarvesterModule {

}
