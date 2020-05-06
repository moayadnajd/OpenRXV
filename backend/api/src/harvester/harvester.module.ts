import { Module } from '@nestjs/common';

import { BullModule } from '@nestjs/bull';
import { TasksService } from './services/tasks.service';
import { HarvesterService } from './services/harveter.service';
import { FetchConsumer } from './consumers/fetch.consumer';
import { SharedModule } from 'src/shared/shared.module';
import { JsonFilesService } from 'src/admin/json-files/json-files.service';
import { HarvesterController } from './harvester/harvester.controller';
@Module({
    providers: [TasksService, HarvesterService, FetchConsumer, JsonFilesService],
    exports: [HarvesterService, SharedModule, BullModule],
    imports: [
        SharedModule,
        BullModule.registerQueue({
            name: 'fetch',
            limiter: {
                max: 100,
                duration: 9000
            },
            settings: {
                retryProcessDelay: 10000
            },
            redis: {
                host: 'localhost',
                port: 6379,
            },
        }),
        BullModule.registerQueue({
            name: 'plugins',
            limiter: {
                max: 100,
                duration: 9000
            },
            settings: {
                retryProcessDelay: 10000
            },

            redis: {
                host: 'localhost',
                port: 6379,
            },
        }),
    ],
    controllers: [HarvesterController]
})
export class HarvesterModule {

}
