import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ElasticService } from './services/elastic/elastic.service';
import { MetadataService } from './services/metadata.service';

@Module({
    imports: [
        ElasticsearchModule.register({
            node: 'http://localhost:9200',
        })
    ],
    providers: [ElasticService, MetadataService],
    exports: [ElasticsearchModule, ElasticService, MetadataService]
})
export class SharedModule {

}
