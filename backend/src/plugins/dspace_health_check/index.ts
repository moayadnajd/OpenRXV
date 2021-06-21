import { InjectQueue, Processor, Process, JOB_REF } from "@nestjs/bull";
import { Logger, HttpService } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { Queue, Job } from "bull";
import Sitemapper from "sitemapper";
import { JsonFilesService } from "src/admin/json-files/json-files.service";

@Processor('plugins')
export class DSpaceHealthCheck {
    private logger = new Logger(DSpaceHealthCheck.name);
    missingIds: any = null;
    sitemapHandles: string[];
    constructor(
        public readonly elasticsearchService: ElasticsearchService,
        public readonly jsonFilesService: JsonFilesService,
        @InjectQueue('plugins') private pluginsQueue: Queue,
    ) { }
    @Process({ name: 'dspace_health_check', concurrency: 1 })
    async transcode(job: Job<any>) {
        this.logger.log('Health Check Started');
        let settings = await this.jsonFilesService.read('../../../data/dataToUse.json');

        let repo = settings.repositories.filter(d => d.name = job.data.repo)[0]
        job.progress(30);
        const Sitemap = new Sitemapper({
            url: repo.siteMap,
            timeout: 15000, // 15 seconds
        });

        const { sites } = await Sitemap.fetch();
        job.progress(50);
        this.sitemapHandles = sites.map(d => d.split('/handle/')[1])

        let indexedHandles = await this.getnotMissing(job).catch(e => {
            job.moveToFailed(e, true)
            return null;
        });

        if (indexedHandles) {
            let missingHandles = this.sitemapHandles.filter(e => !indexedHandles.includes(e));
            this.logger.log('missing handles founded ' + missingHandles.length);
            this.addjob_missing_items(missingHandles, repo, job, 0);
            await this.deleteDuplicates(job);
            this.logger.log('Duplicates Done');
            job.progress(100);
            job.moveToCompleted('done', true);
            return 'done';
        }
        job.progress(100);
        return 'done';


    }
    async addjob_missing_items(missingHandles, repo, job, i) {
        if (missingHandles[i]) {
            let handle = missingHandles[i];
            await this.pluginsQueue.add('dspace_add_missing_items', { repo, handle, itemEndPoint: job.data.itemEndPoint },{attempts:0})
            this.addjob_missing_items(missingHandles, repo, job, i + 1)
        }
    }
    async deleteDuplicates(job: Job) {
        let elastic_data = {
            index: process.env.OPENRXV_TEMP_INDEX,
            body: {
                size: 0,
                _source: ["handle"],
                "track_total_hits": true,
                query: {
                    "bool": {
                        "must": [
                            {
                                "match": {
                                    "repo.keyword": job.data.repo
                                }
                            },
                            {
                                "exists": { "field": "handle" }
                            }
                        ]
                    }
                },
                "aggs": {
                    "duplicateCount": {
                        "terms": {
                            "field": "handle.keyword",
                            "min_doc_count": 2,
                            "size": 999
                        },
                        "aggs": {
                            "duplicateDocuments": {
                                "top_hits": {
                                    "size": 100,
                                    "_source": [
                                        "handle"
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        };
        let response: any = await this.elasticsearchService.search(elastic_data).catch((e) => {
            this.logger.error(e)
            job.moveToFailed(e, true);
            return null;
        });

        let duplicates = [];
        if (response) {
            this.logger.log('searching for duplicates')
            response.body.aggregations.duplicateCount.buckets.forEach(async (item) => {
                item.duplicateDocuments.hits.hits.forEach(async (element, index) => {
                    if (item.duplicateDocuments.hits.hits.length - 1 > index) {
                        await this.elasticsearchService.delete({ id: element._id, index: process.env.OPENRXV_TEMP_INDEX }).catch(e => this.logger.error(e));
                        duplicates.push(element._id);
                    }
                });
            })
        }
        setTimeout(() => {
            this.logger.log(duplicates.length + ' duplicates deleted')
        }, 2000);
    }

    async getnotMissing(job: Job): Promise<Array<any>> {
        return new Promise(async (resolve, reject) => {

            try {
                if (this.missingIds != null) {
                    resolve(this.missingIds)
                    return;
                }
                let allRecords: any = [];
                let elastic_data = {
                    index: process.env.OPENRXV_TEMP_INDEX,
                    body: {
                        size: 9999,
                        _source: ["handle"],
                        "track_total_hits": true,
                        query: {
                            "bool": {
                                "must": [
                                    {
                                        "match": {
                                            "repo.keyword": job.data.repo
                                        }
                                    },
                                    {
                                        "exists": { "field": "handle" }
                                    }
                                ]
                            },

                        }
                    },
                    scroll: '10m'
                };
                let response3 = await this.elasticsearchService.search(elastic_data).catch(e => this.logger.error(e));
                let getMoreUntilDone = async (response) => {
                    this.logger.log(allRecords.length + ' handles count')
                    let handleIDs = response.body.hits.hits.filter((d) => {
                        if (d._source.handle && this.sitemapHandles.indexOf(d._source.handle) >= 0)
                            return true;
                        return false;
                    }).map(d => d._source.handle)
                    allRecords = [...allRecords, ...handleIDs];
                    if (response.body.hits.hits.length != 0) {
                        let response2 = await this.elasticsearchService.scroll({
                            scroll_id: <string>response.body._scroll_id,
                            scroll: '10m'
                        }).catch(e => this.logger.error(e));
                        getMoreUntilDone(response2)
                    } else {
                        resolve(allRecords)
                    }
                }
                getMoreUntilDone(response3)
            } catch (e) {
                this.logger.error(e)
                reject(e);
            }
        });
    }
}