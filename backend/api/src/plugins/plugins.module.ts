import { Module } from '@nestjs/common';

import { BullModule } from '@nestjs/bull';
import { DSpaceAltmetrics } from './dspace_altmetrics';
import { SharedModule } from 'src/shared/shared.module';
@Module({
    providers: [DSpaceAltmetrics],
    exports: [DSpaceAltmetrics, BullModule],
    imports: [

        SharedModule,
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
})
export class PluginsModule { }
