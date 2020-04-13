import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { async } from 'rxjs/internal/scheduler/async';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { JsonFilesService } from 'src/admin/json-files/json-files.service';

@Injectable()
export class HarvesterService {
    private readonly logger = new Logger(HarvesterService.name);
    constructor(
        public readonly elasticsearchService: ElasticsearchService,
        public readonly jsonFilesService: JsonFilesService,
        @InjectQueue('fetch') private fetchQueue: Queue,
        @InjectQueue('index') private indexQueue: Queue
    ) { }
    async stopHarvest() {
        this.logger.debug("Stopping Harvest")
        await this.fetchQueue.pause();
        await this.indexQueue.pause();
        await this.fetchQueue.clean(0)
        await this.indexQueue.clean(0)
        await this.fetchQueue.clean(0, 'failed')
        await this.fetchQueue.clean(0, 'wait')
        await this.fetchQueue.clean(0, 'active')
        await this.fetchQueue.clean(0, 'delayed')
        await this.indexQueue.clean(0, 'failed')
        return await this.indexQueue.clean(0, 'delayed')

    }
    async startHarvest() {
        this.logger.debug("Starting Harvest")
        await this.fetchQueue.pause();
        await this.indexQueue.pause();
        await this.fetchQueue.clean(0)
        await this.indexQueue.clean(0)
        await this.fetchQueue.clean(0, 'failed')
        await this.fetchQueue.clean(0, 'wait')
        await this.fetchQueue.clean(0, 'active')
        await this.fetchQueue.clean(0, 'delayed')
        await this.indexQueue.clean(0, 'failed')
        await this.indexQueue.clean(0, 'delayed')
        await this.fetchQueue.resume();
        await this.indexQueue.resume();

        let settings = await this.jsonFilesService.read('../../../../config/dataToUse.json');
        settings.repositories.forEach(repo => {
            for (let i = 0; i < 4; i++) {
                this.fetchQueue.add('fetch', { page: 1 + i, pipe: 4, repo, index: settings.index_alias }, { attempts: 10 })
            }
        });
        return "started";
    }

    async Reindex() {
        let config = {
            temp_index: "items-temp",
            final_index: "items-final",
            index_type: "item",
            index_alias: "items",
        }
        this.logger.debug("reindex function is called")

        await this.elasticsearchService.indices.updateAliases({
            body: {
                actions: [
                    { remove: { index: config.final_index, alias: 'items' } },
                    { add: { index: config.temp_index, alias: 'items' } }
                ]
            }
        })

        this.logger.debug("updateAliases final to tmep")

        await this.elasticsearchService.indices.delete({
            index: config.final_index,
            ignore_unavailable: true
        })
        this.logger.debug("delete final")

        await this.elasticsearchService.indices.create({
            index: config.final_index,

        })
        this.logger.debug("create final")

        await this.elasticsearchService.reindex({
            wait_for_completion: true,
            body: {
                "conflicts": "proceed",
                source: {
                    index: config.temp_index
                },
                dest: { index: config.final_index }
            }
        })
        this.logger.debug("reindex to final")


        await this.elasticsearchService.indices.updateAliases({
            body: {
                actions: [
                    { remove: { index: config.temp_index, alias: 'items' } },
                    { add: { index: config.final_index, alias: 'items' } }
                ]
            }
        })

        this.logger.debug("updateAliases temp to final")

        await this.elasticsearchService.indices.delete({
            index: config.temp_index,
            ignore_unavailable: true
        })
        this.logger.debug("delete temp")

        await this.elasticsearchService.indices.create({
            index: config.temp_index,
        })

        this.logger.debug("create temp")

        this.logger.debug("Index All Done ");

    }

}