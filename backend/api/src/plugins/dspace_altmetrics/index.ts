import { InjectQueue, Processor, Process, OnGlobalQueueProgress, OnQueueDrained, OnGlobalQueueDrained, OnGlobalQueueResumed } from "@nestjs/bull";
import { Logger, HttpService } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { Queue, Job } from "bull";
import { map } from "rxjs/operators";
import { HarvesterService } from "src/harvester/services/harveter.service";
import { async } from "rxjs/internal/scheduler/async";

@Processor('plugins')
export class DSpaceAltmetrics {
    private logger = new Logger(DSpaceAltmetrics.name);
    handlesIds: any = null;
    constructor(
        private http: HttpService,
        public readonly elasticsearchService: ElasticsearchService,
        private readonly harvesterService: HarvesterService,
        @InjectQueue('plugins') private pluginQueue: Queue,
    ) { }
    @Process('dspace_altmetrics')
    async transcode(job: Job<any>) {
        let config = {
            temp_index: job.data.index + "-temp",
            index_type: "item",
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

    async generateCache(index) {
        return new Promise(async (resolve, reject) => {
            try {
                if (this.handlesIds != null) {
                    resolve(this.handlesIds)
                    return;
                }
                let allRecords: any = [];
                let total = 0;
                let elastic_data = {
                    index: index,
                    body: {
                        size: 500,
                        _source: ["handle"],
                        query: {

                            "exists": { "field": "handle" }
                        }
                    },
                    scroll: '10m'
                };
                let response3 = await this.elasticsearchService.search(elastic_data).catch(e => this.logger.error(e));
                let getMoreUntilDone = async (response) => {
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
                        let response2 = await this.elasticsearchService.scroll({
                            scroll_id: <string>response.body._scroll_id,
                            scroll: '10m'
                        }).catch(e => this.logger.error(e));
                        getMoreUntilDone(response2)
                    } else {
                        let finalobj: any = {};
                        allRecords.forEach((element: any) => {
                            finalobj[Object.keys(element)[0]] = Object.values(element)[0]
                        });
                        resolve(finalobj)
                    }
                }
                getMoreUntilDone(response3)
            } catch (e) {
                this.logger.error(e)
                reject(e);
            }
        });
    }
    timeout
    @OnGlobalQueueDrained()
    async onDrained(job: Job) {
       
        if (this.timeout)
            clearTimeout(this.timeout)
        this.timeout = setTimeout(async () => {
             this.logger.log("OnGlobalQueueDrained");
            await await this.harvesterService.Reindex();
            
        }, 60000)

    }

    @OnGlobalQueueResumed()
    async onResumed(job: Job) {
        this.timeout = undefined;
    }


}