import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ElasticService } from './services/elastic/elastic.service';
import { MetadataService } from './services/metadata.service';
import { ValuesService } from './services/values.service';
import { ShareService } from './services/share.service';

@Module({
    imports: [
        ElasticsearchModule.register({
            node: 'http://localhost:9200',
        })
    ],
    providers: [ElasticService, MetadataService,ValuesService,ShareService],
    exports: [ElasticsearchModule, ElasticService, MetadataService,ValuesService,ShareService]
})
export class SharedModule {

}
