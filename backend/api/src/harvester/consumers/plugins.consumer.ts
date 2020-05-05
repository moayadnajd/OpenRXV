import { Processor, OnGlobalQueueDrained } from '@nestjs/bull';
import { Job } from 'bull';

import { HarvesterService } from '../services/harveter.service';
import { Logger } from '@nestjs/common';

@Processor('plugins')
export class PluginsConsumer {
    private logger = new Logger(PluginsConsumer.name);
    constructor(
        private readonly harvesterService: HarvesterService,
    ) { }

    @OnGlobalQueueDrained()
    async onDrained(job: Job) {
        this.logger.log("OnGlobalQueueDrained");
        await this.harvesterService.Reindex();
    }

}