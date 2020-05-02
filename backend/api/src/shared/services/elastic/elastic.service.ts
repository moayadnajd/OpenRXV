import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Update } from '@elastic/elasticsearch/api/requestParams';
@Injectable()
export class ElasticService {
    index: string = 'users'
    constructor(public readonly elasticsearchService: ElasticsearchService) { }

    async search(query) {
        const { body } = await this.elasticsearchService.search({
            index: 'items',
            method: 'POST',
            body: query
        });
        return body;
    }

    async add(item) {
        item['created_at'] = new Date();
        let { body } = await this.elasticsearchService.index({
            index: this.index,
            refresh: 'wait_for',
            type: '_doc', // uncomment this line if you are using Elasticsearch ≤ 6
            body: item
        })
        return body;
    }
    async update(id, item) {

        let update: Update = {
            id,
            type: '_doc',
            index: this.index,
            refresh: 'wait_for',
            body: { doc: item }
        }
        return this.elasticsearchService.update(update);
    }

    async delete(id) {
        let { body } = await this.elasticsearchService.delete({
            index: this.index,
            refresh: 'wait_for',
            id
        })

        return body._source;
    }

    async findOne(id) {
        let { body } = await this.elasticsearchService.get({
            index: this.index,

            id
        })

        return body._source;
    }
    async find(obj: Object = null) {
        if (obj)
            obj = { bool: { filter: { term: obj } } }
        else
            obj = {

                "match_all": {}
            }

        let { body } = await this.elasticsearchService.search({
            index: this.index,
            method: 'POST',
            from: 0,
            size: 9999,
            body: {

                "query": obj,
                "sort": [
                    {
                        "created_at": {
                            "order": "desc"
                        }
                    }
                ]
            }
        });
        return body.hits;
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
