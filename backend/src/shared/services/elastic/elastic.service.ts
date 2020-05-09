import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Update } from '@elastic/elasticsearch/api/requestParams';
import { ApiResponse } from '@elastic/elasticsearch';
import * as bcrypt from 'bcrypt';
@Injectable()
export class ElasticService {
    index: string = 'users'
    constructor(public readonly elasticsearchService: ElasticsearchService) { }
    async startup() {
        let values_exist: ApiResponse = await this.elasticsearchService.indices.exists({ index: "values" })
        let users_exist: ApiResponse = await this.elasticsearchService.indices.exists({ index: "users" })
        let shared_exist: ApiResponse = await this.elasticsearchService.indices.exists({ index: "shared" })
        let items_final_exist: ApiResponse = await this.elasticsearchService.indices.exists({ index: "items-final" })
        let items_temp_exist: ApiResponse = await this.elasticsearchService.indices.exists({ index: "items-temp" })

        if (!items_final_exist.body)
            await this.elasticsearchService.indices.create(({ index: "items-final" }));
        if (!items_temp_exist.body)
            await this.elasticsearchService.indices.create(({ index: "items-temp" }));
        if (!shared_exist.body)
            await this.elasticsearchService.indices.create(({ index: "shared" }));
        if (!values_exist.body)
            await this.elasticsearchService.indices.create(({ index: "values" }));

        if (!users_exist.body) {
            let body = {
                name: "admin",
                role: "Admin",
                email: "admin",
                password: 'admin'
            }
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(body.password, salt);
            body.password = hash;
            return this.add(body);
        }

        await this.elasticsearchService.indices.putSettings({
            body: {
                "index.blocks.read_only_allow_delete": false
            }
        })
        await this.elasticsearchService.cluster.putSettings({
            body: {
                "transient": {
                    "cluster.routing.allocation.disk.threshold_enabled": false
                }
            }
        })

    }
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
            body: item
        })
        return body;
    }
    async update(id, item) {

        let update: Update = {
            id,
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

    async findByTerm(term = '') {
        try {
            let obj
            if (term != '')
                obj = {
                    "multi_match": {
                        "query": term,
                    }
                }
            else
                obj = {
                    match_all: {}
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
                                "order": "desc",
                            }
                        }
                    ]
                }
            });
            return body.hits;
        } catch (e) {
            return { "total": { "value": 0, "relation": "eq" }, "max_score": null, "hits": [] }
        }
    }
    async find(obj: Object = null) {
        try {
            if (obj)
                obj = { bool: { filter: { term: obj } } }
            else
                obj = {
                    "match_all": {}
                }

            let { body } = await this.elasticsearchService.search({
                index: this.index,
                from: 0,
                method: "POST",
                size: 9999,
                body: {
                    "query": obj,
                    "sort": {
                        "created_at": {
                            "order": "desc"
                        }
                    }
                }
            });
            return body.hits;
        } catch (e) {
            return { "total": { "value": 0, "relation": "eq" }, "max_score": null, "hits": [] }
        }
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
