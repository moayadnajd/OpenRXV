import { Module, HttpModule } from '@nestjs/common';

import { BullModule } from '@nestjs/bull';
import { TasksService } from './services/tasks.service';
import { HarvesterService } from './services/harveter.service';
import { FetchConsumer } from './consumers/fetch.consumer';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { SharedModule } from 'src/shared/shared.module';
import { JsonFilesService } from 'src/admin/json-files/json-files.service';
@Module({
    providers: [TasksService, HarvesterService, FetchConsumer,JsonFilesService],
    exports: [HarvesterService],
    imports: [
        HttpModule,
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
            name: 'index',
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
    ]
})
export class HarvesterModule {

}
