import { InjectQueue, Processor, Process } from "@nestjs/bull";
import { HttpService } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { Queue, Job } from "bull";
import { map } from "rxjs/operators";

@Processor('plugins')
export class DSpaceDowbloadsAndViews {
    constructor(
        private http: HttpService,
        public readonly elasticsearchService: ElasticsearchService,
        @InjectQueue('plugins') private pluginQueue: Queue,
    ) { }
    @Process({ name: 'dspace_downloads_and_views', concurrency: 1 })
    async transcode(job: Job<any>) {
        let config = {
            temp_index: job.data.index + "-temp",
            final_index: job.data.index + "-final",
            index_type: "item",
            index_alias: job.data.index,
        }
        let link = job.data.link;
        let page = job.data.page;
        job.progress(20);
        const cgspacenumbersUrl = link;
        const limit = 100;
        let toUpdateIndexes: Array<any> = [];
        let stats = await this.http.get(`${cgspacenumbersUrl}?page=${page}&limit=${limit}`).pipe(map(d => d.data)).toPromise();
        job.progress(50);
        if (stats.statistics && stats.statistics.length > 0) {
            stats.statistics.forEach((stat: any) => {
                const numbers = {
                    views: parseInt(stat.views),
                    downloads: parseInt(stat.downloads),
                    score: parseInt(stat.views) + parseInt(stat.downloads)
                };
                //TODO: CGSPACE_ must change 
                toUpdateIndexes.push({ update: { _index: config.temp_index, _type: config.index_type, _id: job.data.repo + "_" + stat.id } });
                toUpdateIndexes.push({ "doc": { numbers } })
            });
            job.progress(70);
            let newJob = await this.pluginQueue.add('dspace_downloads_and_views', { page: page + 1, link, index: job.data.index, repo: job.data.repo })
            let currentResult = await await this.elasticsearchService.bulk({
                refresh: 'wait_for',
                body: toUpdateIndexes
            })
            job.progress(100);
            if (newJob)
                return currentResult
        }
        else {
            return "Done updating downloads and views";
        }
    }
}