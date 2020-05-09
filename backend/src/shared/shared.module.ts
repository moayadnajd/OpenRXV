import { Module, HttpModule } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ElasticService } from './services/elastic/elastic.service';
import { MetadataService } from './services/metadata.service';
import { ValuesService } from './services/values.service';
import { ShareService } from './services/share.service';
import { StartupService } from './services/startup/startup.service';

@Module({
    imports: [
        ElasticsearchModule.register({
            node: 'http://localhost:9200',
        }),
        HttpModule
    ],
    providers: [ElasticService, MetadataService,ValuesService,ShareService,StartupService],

    exports: [ElasticsearchModule, ElasticService, MetadataService,ValuesService,ShareService,HttpModule]
})
export class SharedModule {

}
