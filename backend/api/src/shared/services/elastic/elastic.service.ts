import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class ElasticService {

    constructor(private readonly elasticsearchService: ElasticsearchService) { }

    async search(query) {
        const { body } = await this.elasticsearchService.search({
            index: 'items',
            method: 'POST',
            body: query
        });
        return body;
    }

    async get(q: any, scrollId?: string) {
        try {
            let scrollSearch: any;
            if (scrollId) {
                scrollSearch = await this.elasticsearchService.scroll({
                    scroll_id: scrollId,
                    scroll: '10m',
                    method: 'POST'
                });
            } else {
                scrollSearch = await this.elasticsearchService.search({
                    index: 'items',
                    scroll: '10m',
                    method: 'POST',
                    body: { ...q }
                });
            }
            return scrollSearch;
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }
}
