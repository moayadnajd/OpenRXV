import { InjectQueue, Processor, Process, OnGlobalQueueProgress, OnQueueDrained } from "@nestjs/bull";
import { Logger, HttpService } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { Queue, Job } from "bull";
import { map } from "rxjs/operators";

@Processor('plugins')
export class DSpaceAltmetrics {
    private logger = new Logger(DSpaceAltmetrics.name);
    handlesIds = null;
    constructor(
        private http: HttpService,
        public readonly elasticsearchService: ElasticsearchService,
        @InjectQueue('plugins') private pluginQueue: Queue,
    ) { }
    @Process('dspace_altmetrics')
    async transcode(job: Job<any>) {
        let config = {
            temp_index: job.data.index + "-temp",
            final_index: job.data.index + "-final",
            index_type: "item",
            index_alias: job.data.index,
        }
        this.handlesIds = await this.generateCache(config.temp_index)
        let handle_prefix = job.data.handle_prefix;
        let page = job.data.page;
        job.progress(20);
        let Allindexing: Array<any> = []
        let data: any = await this.http.get("https://api.altmetric.com/v1/citations/at?num_results=100&handle_prefix=" + handle_prefix + "&page=" + page).pipe(map((data: any) => data.data)).toPromise();
        if (data.results) {
            data.results.forEach((element: any) => {
                let altmetric = {
                    score: element.score,
                    readers: element.readers_count,
                    mentions: element.cited_by_accounts_count
                }
                if (this.handlesIds[element.handle]) {
                    Allindexing.push({ update: { _index: config.temp_index, _type: 'item', _id: this.handlesIds[element.handle] } });
                    Allindexing.push({ "doc": { altmetric } });
                }
            });
            await job.progress(80);
            if (Allindexing.length) {
                let currentResult: any = await this.elasticsearchService.bulk({
                    refresh: 'wait_for',
                    body: Allindexing
                })

                if (page < Math.ceil(parseInt(data.query.total) / 100)) {
                    await this.pluginQueue.add('dspace_altmetrics', { page: page + 1, handle_prefix, index: job.data.index })
                    await job.progress(100);
                    return currentResult
                } else {
                    await job.progress(100);
                    return currentResult
                }
            } else {
                return new Error('No Data to add');
            }
        }
    }

    generateCache(index) {
        return new Promise((resolve, reject) => {
            if (this.handlesIds) {
                resolve(this.handlesIds)
                return;
            }
            let allRecords: any = [];
            let total = 0;

            let elastic_data = {
                index: index,
                type: 'item',
                body: {
                    size: 500,
                    _source: ["handle"],
                    query: {
                        "exists": { "field": "handle" }
                    }
                },
                scroll: '10m'
            };

            this.elasticsearchService.search(elastic_data, function getMoreUntilDone(error, response: any) {
                if (error == null) {
                    let handleID = response.body.hits.hits.map((d: any) => {
                        if (d._source.handle) {
                            let obj: any = {};
                            obj[d._source.handle] = d._id
                            return obj
                        }

                    })
                    allRecords = [...allRecords, ...handleID];
                    if (total === 0) {
                        total = response.body.hits.total;
                    }
                    if (response.body.hits.total !== allRecords.length) {
                        this.elasticsearchService.scroll({
                            scrollId: <string>response._scroll_id,
                            scroll: '10m'
                        }, getMoreUntilDone);
                    } else {
                        let finalobj: any = {};
                        allRecords.forEach((element: any) => {
                            finalobj[Object.keys(element)[0]] = Object.values(element)[0]
                        });
                        this.handlesIds = finalobj;
                        resolve(finalobj)
                    }
                } else {
                    reject(error);
                }
            });
        });

    }

    @OnQueueDrained()
    async onDrained(job: Job) {
        this.logger.log("OnQueueDrained");
    }


}