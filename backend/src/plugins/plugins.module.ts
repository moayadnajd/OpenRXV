import { Module } from '@nestjs/common';
import { DSpaceAltmetrics } from './dspace_altmetrics';
import { HarvesterModule } from 'src/harvester/harvester.module';
import { MELDownloadsAndViews } from './mel_downloads_and_views';
import { DSpaceDownloadsAndViews } from './dspace_downloads_and_views';
@Module({
    providers: [DSpaceAltmetrics, MELDownloadsAndViews, DSpaceDowbloadsAndViews],
    exports: [DSpaceAltmetrics, MELDownloadsAndViews, DSpaceDowbloadsAndViews],
    imports: [
        HarvesterModule,

    ],
})
export class PluginsModule { }
