import { Processor, Process, OnQueueActive, InjectQueue, OnGlobalQueueDrained, OnQueueResumed, OnGlobalQueueResumed } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { HttpService, Logger } from '@nestjs/common';
import { map } from 'rxjs/operators';


import * as _ from 'underscore';

import * as ISO from 'iso-3166-1';

import * as moment from 'moment';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ApiResponse } from '@elastic/elasticsearch';
import { HarvesterService } from '../services/harveter.service';
import e = require('express');


let langISO = require('iso-639-1');
let mapto: any = {};

@Processor('fetch')
export class FetchConsumer {
    private logger = new Logger(FetchConsumer.name);
    constructor(private http: HttpService,
        public readonly elasticsearchService: ElasticsearchService,
        private readonly harvesterService: HarvesterService,
        @InjectQueue('fetch') private fetchQueue: Queue,
    ) { }

    @Process('fetch')
    async transcode(job: Job<any>) {
        await job.progress(20);
        let offset = job.data.page * 50;
        let page = job.data.page + job.data.pipe
        let data: any = await this.http.get(job.data.repo.itemsEndPoint + 'items?expand=metadata,parentCommunityList' + '&limit=50&offset=' + offset).pipe(map((data: any) => data.data)).toPromise();
        await job.progress(50);
        if (data.length == 0) {
            let error = new Error('no data exist on page ' + job.data.page + ' and offset ' + offset);
            error.name = "NoData"
            await job.moveToFailed(error)
        }
        else {
            job.progress(60);
            // await this.fetchQueue.add('fetch', { page, pipe: job.data.pipe,repo:job.data.repo }, { attempts: 10 })
            return this.index(job, data);

        }
    }
    async index(job, data) {
        let config = {
            temp_index: job.data.index + "-temp",
            final_index: job.data.index + "-final",
            index_type: "item",
            index_alias: job.data.index,
        }


        let finaldata: Array<any> = [];


        data.forEach((item: any) => {
            let formated = this.format(item, job.data.repo.schema);

            if (formated.date) {
                if (_.isArray(formated.date))
                    formated.date = formated.date[0];
                formated.date = moment(new Date(formated.date)).format('YYYY-MM-DD')
                if (!formated['year'])
                    formated['year'] = formated.date.split("-")[0]
            }
            formated['repo'] = job.data.repo.name;
            finaldata.push({ index: { _index: config.temp_index, _type: config.index_type, _id: job.data.repo.name + "_" + formated.id } });
            finaldata.push(formated);
        });

        job.progress(70);

        let resp: ApiResponse = await this.elasticsearchService.bulk({
            refresh: 'wait_for',
            body: finaldata
        });
        job.progress(90);
        resp.body.items.forEach((item: any) => {
            //item.index.status
            if (item.index.status != 200 && item.index.status != 201) {
                let error = new Error('error update or create item ' + item.index._id);
                error.stack = JSON.stringify(item);
                job.moveToFailed(error);
            }
        })

        job.progress(100);

        return resp.body.items;
    }


    format(json: any, schema: any) {
        let finalValues: any = {}
        _.each(schema, (item: any, index: string) => {
            if (json[index]) {
                if (_.isArray(item)) {
                    _.each(item, (subItem: any, subIndex: string) => {
                        let values = json[index].
                            filter((d: any) => d[Object.keys(subItem.where)[0]] == subItem.where[Object.keys(subItem.where)[0]])
                            .map((d: any) => subItem.prefix ? subItem.prefix + this.mapIt(d[Object.keys(subItem.value)[0]], subItem.addOn ? subItem.addOn : null) : this.mapIt(d[Object.keys(subItem.value)[0]], subItem.addOn ? subItem.addOn : null))
                        if (values.length)
                            finalValues[subItem.value[Object.keys(subItem.value)[0]]] = this.getArrayOrValue(values)
                    })
                }
                else if (_.isObject(item)) {
                    if (_.isArray(json[index])) {
                        let values = this.getArrayOrValue(json[index].map((d: any) => this.mapIt(d[Object.keys(item)[0]])))
                        if (values)
                            finalValues[<string>Object.values(item)[0]] = values
                    }
                }
                else
                    finalValues[index] = this.mapIt(json[index])
            }
        })
        return finalValues;

    }

    capitalizeFirstLetter(string: string) {
        return string.charAt(0).toUpperCase() + string.toLocaleLowerCase().slice(1);
    }

    mapIsoToLang = (value: string) => langISO.validate(value) ? langISO.getName(value) : value
    mapIsoToCountry = (value: string) => ISO.whereAlpha2(value) ? ISO.whereAlpha2(value).country : this.capitalizeFirstLetter(value)


    mapIt(value: any, addOn = null): string {

        if (addOn) {
            if (typeof value === 'string' || value instanceof String) {
                let splited = <Array<string>>value.split(',')
                if (addOn == "country")
                    value = splited.map(d => this.mapIsoToCountry(d.trim().toLowerCase()));
                if (addOn == "language")
                    value = splited.map(d => this.mapIsoToLang(d.trim().toLowerCase()));
            }
        }
        return mapto[value] ? mapto[value] : value
    }
    getArrayOrValue(values: Array<any>) {
        if (values.length > 1)
            return values
        else
            return values[0]
    }
    @OnGlobalQueueDrained()
    async onDrained(job: Job) {
        await this.harvesterService.Reindex();
    }

    @OnGlobalQueueResumed()
    async onResumed(job: Job) {
        mapto = await this.harvesterService.getMappingValues()
    }
}