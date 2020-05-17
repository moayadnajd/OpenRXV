import { Module, HttpModule } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ElasticService } from './services/elastic/elastic.service';
import { MetadataService } from './services/metadata.service';
import { ValuesService } from './services/values.service';
import { ShareService } from './services/share.service';
import { StartupService } from './services/startup/startup.service';
import { ConfigModule } from '@nestjs/config';
import { JsonFilesService } from 'src/admin/json-files/json-files.service';

@Module({
    imports: [
        ConfigModule.forRoot(),
        ElasticsearchModule.register({
            node: process.env.ELASTICSEARCH_HOST,
        }),
        HttpModule.register({ headers: { 'User-agent': 'OpenRXV' } })
    ],
    providers: [ElasticService, MetadataService, ValuesService, ShareService, StartupService, JsonFilesService],

    exports: [ElasticsearchModule, ElasticService, MetadataService, ValuesService, ShareService, HttpModule, JsonFilesService]
})
export class SharedModule {

}
