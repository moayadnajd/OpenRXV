import { Module } from '@nestjs/common';

import { BullModule } from '@nestjs/bull';
import { DSpaceAltmetrics } from './dspace_altmetrics';
import { HarvesterModule } from 'src/harvester/harvester.module';
@Module({
    providers: [DSpaceAltmetrics],
    exports: [DSpaceAltmetrics],
    imports: [
        HarvesterModule,
       
    ],
})
export class PluginsModule { }
