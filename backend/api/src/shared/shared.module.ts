import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ElasticService } from './services/elastic/elastic.service';

@Module({
    imports: [
        ElasticsearchModule.register({
            node: 'http://localhost:9200',
        })
    ],
    providers:[ElasticService],
    exports: [ElasticsearchModule,ElasticService]
})
export class SharedModule {

}
