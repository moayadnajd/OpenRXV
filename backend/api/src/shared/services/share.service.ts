import { Injectable } from '@nestjs/common';
import { ElasticService } from './elastic/elastic.service';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import * as hash from 'object-hash';
@Injectable()
export class ShareService extends ElasticService {
    index: string = 'shared'
    constructor(public readonly elasticsearchService: ElasticsearchService) {

        super(elasticsearchService)
    }

    async saveShare(item) {
        let hashedItem = hash(item);
        let result = await this.find({ 'hashedItem.keyword': hashedItem });
        console.log(result);
        if (result.total == 0) {
            let { body } = await this.elasticsearchService.index({
                index: 'shared',
                refresh: 'wait_for',
                type: '_doc', // uncomment this line if you are using Elasticsearch ≤ 6
                body: { created_at: new Date(), hashedItem, attr: item }
            })
            return body;
        } else {
            return result.hits[0]
        }
    }



}
