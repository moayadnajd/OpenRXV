import { Module } from '@nestjs/common';
import { DSpaceAltmetrics } from './dspace_altmetrics';
import { HarvesterModule } from 'src/harvester/harvester.module';
import { MELDowbloadsAndViews } from './mel_downloads_and_views';
@Module({
    providers: [DSpaceAltmetrics, MELDowbloadsAndViews],
    exports: [DSpaceAltmetrics, MELDowbloadsAndViews],
    imports: [
        HarvesterModule,

    ],
})
export class PluginsModule { }
