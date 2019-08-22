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
        console.log("this.jobName =>", this.jobName, this.index)
        this.queue.process(this.jobName, 1, this.index)
    }

    clean() {
        let cleners: Array<Promise<any>> = [];
        cleners.push(this.queue.clean(0, 'completed'))
        cleners.push(this.queue.clean(0, 'active'))
        cleners.push(this.queue.clean(0, 'failed'))
        cleners.push(this.queue.clean(0, 'wait'))
        return Promise.all(cleners)
    }
}