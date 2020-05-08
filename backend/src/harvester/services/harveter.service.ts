import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { async } from 'rxjs/internal/scheduler/async';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { JsonFilesService } from 'src/admin/json-files/json-files.service';
import { ValuesService } from 'src/shared/services/values.service';

@Injectable()
export class HarvesterService {
    private readonly logger = new Logger(HarvesterService.name);
    constructor(
        public readonly elasticsearchService: ElasticsearchService,
        public readonly jsonFilesService: JsonFilesService,
        public readonly valuesServes: ValuesService,
        @InjectQueue('plugins') private pluginsQueue: Queue,
        @InjectQueue('fetch') private fetchQueue: Queue,
    ) { }

    async getInfo() {
        let obj = {
            active_count: 0,
            waiting_count: 0,
            completed_count: 0,
            failed_count: 0,
            active: [],
            waiting: [],
            completed: [],
            failed: []

        }
        obj.active_count = await this.fetchQueue.getActiveCount()
        obj.waiting_count = await this.fetchQueue.getWaitingCount()
        obj.completed_count = await this.fetchQueue.getCompletedCount()
        obj.failed_count = await this.fetchQueue.getFailedCount()

        obj.active = await this.fetchQueue.getActive()
        obj.waiting = await this.fetchQueue.getWaiting()
        obj.completed = await this.fetchQueue.getCompleted()
        obj.failed = await this.fetchQueue.getFailed()

        return obj;
    }

    async getMappingValues() {

        let data = await this.valuesServes.find();
        let values = {}
        data.hits.map(d => values[d._source.find] = d._source.replace)
        return values;
    }

    async stopHarvest() {
        this.logger.debug("Stopping Harvest")
        await this.fetchQueue.empty();
        await this.fetchQueue.clean(0, 'failed')
        await this.fetchQueue.clean(0, 'wait')
        await this.fetchQueue.clean(0, 'active')
        await this.fetchQueue.clean(0, 'delayed')
        await this.fetchQueue.clean(0, 'completed')
        return await this.fetchQueue.pause();
    }
    async startHarvest() {
        this.logger.debug("Starting Harvest")
        await this.fetchQueue.pause();
        await this.fetchQueue.empty();
        await this.fetchQueue.clean(0, 'failed')
        await this.fetchQueue.clean(0, 'wait')
        await this.fetchQueue.clean(0, 'active')
        await this.fetchQueue.clean(0, 'delayed')
        await this.fetchQueue.clean(0, 'completed')
        await this.fetchQueue.resume();

        let settings = await this.jsonFilesService.read('../../../data/dataToUse.json');
        settings.repositories.forEach(repo => {
            for (let i = 0; i < 2; i++) {
                this.fetchQueue.add('fetch', { page: repo.startPage + i, pipe: 2, repo, index: settings.index_alias }, { attempts: 10 })
            }
        });
        return "started";
    }
    async pluginsStart() {
        await this.pluginsQueue.pause();
        await this.pluginsQueue.empty();
        await this.pluginsQueue.clean(0, 'failed')
        await this.pluginsQueue.clean(0, 'wait')
        await this.pluginsQueue.clean(0, 'active')
        await this.pluginsQueue.clean(0, 'delayed')
        await this.pluginsQueue.clean(0, 'completed')
        await this.pluginsQueue.resume();
        let settings = await this.jsonFilesService.read('../../../data/dataToUse.json');
        let plugins: Array<any> = await this.jsonFilesService.read('../../../data/plugins.json');
        if (plugins.filter(plugin => plugin.value).length > 0)
            for (let plugin of plugins) {
                for (let param of plugin.value) {
                    await this.pluginsQueue.add(plugin.name, { ...param, page: 1, index: settings.index_alias }, { attempts: 10 })
                }

            }
        else
            this.Reindex()

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
        }, { requestTimeout: 2000000 })
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