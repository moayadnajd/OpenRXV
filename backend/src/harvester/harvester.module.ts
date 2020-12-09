import { Module } from '@nestjs/common';

import { BullModule } from '@nestjs/bull';
import { TasksService } from './services/tasks.service';
import { HarvesterService } from './services/harveter.service';
import { FetchConsumer } from './consumers/dspace.consumer';
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
                attempts: 10,
            },
            settings: {
                stalledInterval: 1000,
                maxStalledCount: 10,
                retryProcessDelay: 1000,
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
                attempts: 5
            },
            settings: {
                retryProcessDelay: 5000,
                drainDelay: 9000,
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
