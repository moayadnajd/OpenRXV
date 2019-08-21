import Bull, { Queue, ProcessCallbackFunction, Job, DoneCallback } from 'bull'

import * as config from '../../../../../config/index.json';

export class AddOn {
    queueName: string = "addOns";
    queue: Queue;
    jobName: string = "add on job"
    index: ProcessCallbackFunction<Job> = (job: Job, done: DoneCallback) => { };
    constructor() {
        this.queue = new Bull(this.queueName, {
            limiter: {
                max: 100,
                duration: 9000
            },
            settings: {
                retryProcessDelay: 10000
            },
            redis: config.redis
        });
    }

    process() {
        this.queue.process('altmetric_', 1, this.index)
    }
}