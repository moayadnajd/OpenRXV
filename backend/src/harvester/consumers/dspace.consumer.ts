import { Processor, Process, InjectQueue, OnGlobalQueueDrained, OnGlobalQueueResumed } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { HttpService, Logger } from '@nestjs/common';
import { map } from 'rxjs/operators';


import * as _ from 'underscore';

import * as ISO from 'iso-3166-1';

import * as moment from 'moment';
(moment as any).suppressDeprecationWarnings = true;
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ApiResponse } from '@elastic/elasticsearch';
import { HarvesterService } from '../services/harveter.service';

let langISO = require('iso-639-1');
let mapto: any = {};

@Processor('fetch')
export class FetchConsumer {
    private logger = new Logger(FetchConsumer.name);
    timeout
    constructor(private http: HttpService,
        public readonly elasticsearchService: ElasticsearchService,
        private readonly harvesterService: HarvesterService,
        @InjectQueue('fetch') private fetchQueue: Queue,
    ) { }

    @Process({ name: 'openrxv', concurrency: 1 })
    async openrxv(job: Job<any>) {
        let scroll = job.data.scroll
        let url = job.data.repo.itemsEndPoint
        await job.progress(20);
        let result: any = []

        if (scroll) {
            url = job.data.repo.itemsEndPoint + '/scroll/' + scroll
            result = await this.http.post(url).pipe(map((data: any) => data.data)).toPromise();
        } else {
            url = job.data.repo.itemsEndPoint + '?scroll=10m'
            result = await this.http.post(url).pipe(map((data: any) => data.data)).toPromise();
            scroll = result._scroll_id
        }

        let data: any = result.hits.hits.map(d => d._source)
        await job.progress(50);
        if (Array.isArray(data) && data.length == 0) {
            return "done"
        }
        job.progress(60);
        await this.fetchQueue.add('openrxv', { scroll: scroll, repo: job.data.repo })
        let finaldata: Array<any> = [];
        data.forEach((item: any) => {
            let formated = this.format(item, job.data.repo.schema);
            formated['id'] = item.uuid ? item.uuid : item.id;
            formated['repo'] = job.data.repo.name;
            finaldata.push({ index: { _index: process.env.OPENRXV_TEMP_INDEX } });
            finaldata.push(formated);
        });
        await job.progress(70);

        let resp: ApiResponse = await this.elasticsearchService.bulk({
            refresh: 'wait_for',
            body: finaldata
        });

        job.progress(90);
        resp.body.items.forEach((item: any, index: number) => {
            //item.index.status
            if (item.index.status != 200 && item.index.status != 201) {
                let error = new Error('error update or create item ' + finaldata[index].id);
                error.stack = JSON.stringify(item);
                job.moveToFailed(error, true);
                return error
            }
        })

        job.progress(100);

        return resp;
    }

    @Process({ name: 'eprints', concurrency: 1 })
    async eprint(job: Job<any>) {
        let page = parseInt(job.data.page)
        let url = job.data.repo.itemsEndPoint + `?page=${page}&limit=100`
        await job.progress(20);
        let data: any = await this.http.get(url).pipe(map((data: any) => data.data)).toPromise();
        await job.progress(50);
        if (data.meta.itemCount == 0) {
            return "done"
        }
        job.progress(60);
        await this.fetchQueue.add('eprints', { page: page + job.data.pipe, pipe: job.data.pipe, repo: job.data.repo })
        let finaldata: Array<any> = [];
        data.items.forEach((item: any) => {
            let formated = this.format(item, job.data.repo.schema);
            formated['id'] = item.uuid ? item.uuid : item.id;
            formated['repo'] = job.data.repo.name;
            finaldata.push({ index: { _index: process.env.OPENRXV_TEMP_INDEX } });
            finaldata.push(formated);
        });
        await job.progress(70);

        let resp: ApiResponse = await this.elasticsearchService.bulk({
            refresh: 'wait_for',
            body: finaldata
        });

        job.progress(90);
        resp.body.items.forEach((item: any, index: number) => {
            //item.index.status
            if (item.index.status != 200 && item.index.status != 201) {
                let error = new Error('error update or create item ' + finaldata[index].id);
                error.stack = JSON.stringify(item);
                job.moveToFailed(error, true);
                return error
            }
        })

        job.progress(100);

        return resp;
    }


    @Process({ name: 'dspace', concurrency: 1 })
    async dspace(job: Job<any>) {
        try {
            await job.progress(20);
            let page = parseInt(job.data.page)
            let offset = (parseInt(job.data.page) - 1) * 100;
            let url = job.data.repo.itemsEndPoint + '/items?expand=metadata,parentCommunityList,parentCollectionList,bitstreams' + '&limit=100&offset=' + offset;
            let data: any = await this.http.get(url).pipe(map((data: any) => data.data)).toPromise();
            await job.progress(50);
            if (Array.isArray(data) && data.length == 0) {
                return "done"
            }
            else {
                job.progress(60);
                let newjob = await this.fetchQueue.add('dspace', { page: page + job.data.pipe, pipe: job.data.pipe, repo: job.data.repo })
                if (newjob)
                    return this.index(job, data);
            }
        } catch (e) {
            job.moveToFailed(e, true)
            return e;
        }
    }
    async index(job, data) {

        let finaldata: Array<any> = [];


        data.forEach((item: any) => {
            let formated = this.format(item, job.data.repo.schema);

            if (job.data.repo.years) {
                let spleted = job.data.repo.years.split(/_(.+)/)

                if (formated[spleted[1]]) {
                    if (typeof formated[spleted[1]] === 'string')
                        formated[job.data.repo.years] = formated[spleted[1]].split("-")[0]
                    if (Array.isArray(formated[spleted[1]]) && typeof formated[spleted[1]][0] === 'string')
                        formated[job.data.repo.years] = formated[spleted[1]][0].split("-")[0]
                }

            }
            formated['id'] = item.uuid ? item.uuid : item.id;
            formated['repo'] = job.data.repo.name;
            finaldata.push({ index: { _index: process.env.OPENRXV_TEMP_INDEX } });
            finaldata.push(formated);
        });

        job.progress(70);

        let resp: ApiResponse = await this.elasticsearchService.bulk({
            refresh: 'wait_for',
            body: finaldata
        });
        job.progress(90);

        resp.body.items.forEach((item: any, index: number) => {
            //item.index.status
            if (item.index.status != 200 && item.index.status != 201) {
                let error = new Error('error update or create item ' + finaldata[index].id);
                error.stack = JSON.stringify(item);
                job.moveToFailed(error, true);
                return error
            }
        })

        job.progress(100);

        return resp;
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
                            finalValues[subItem.value[Object.keys(subItem.value)[0]]] = this.setValue(finalValues[subItem.value[Object.keys(subItem.value)[0]]], this.getArrayOrValue(values))

                    })
                }
                else if (_.isObject(item)) {
                    if (_.isArray(json[index])) {
                        let values = this.getArrayOrValue(json[index].map((d: any) => this.mapIt(d[Object.keys(item)[0]])))
                        if (values)
                            finalValues[<string>Object.values(item)[0]] = this.setValue(finalValues[<string>Object.values(item)[0]], values)
                    }
                }
                else
                    finalValues[item] = this.mapIt(json[index])
            }
        })
        return finalValues;

    }
    setValue(oldvalue, value) {
        if (_.isArray(oldvalue) && _.isArray(value))
            return [...oldvalue, ...value];
        else if (_.isArray(oldvalue) && !_.isArray(value)) {
            oldvalue.push(value);
            return oldvalue
        }
        else
            return value
    }

    capitalizeFirstLetter(string: string) {
        return string.charAt(0).toUpperCase() + string.toLocaleLowerCase().slice(1);
    }

    mapIsoToLang = (value: string) => langISO.validate(value) ? langISO.getName(value) : value
    mapIsoToCountry = (value: string) => ISO.whereAlpha2(value) ? ISO.whereAlpha2(value).country : this.capitalizeFirstLetter(value)


    mapIt(value: any, addOn = null): string {

        if (addOn) {
            if (typeof value === 'string' || value instanceof String) {
                if (addOn == "country")
                    value = value.split(',').map(d => this.mapIsoToCountry(d.trim().toLowerCase()));
                if (addOn == "language")
                    value = value.split(',').map(d => this.mapIsoToLang(d.trim().toLowerCase()));
                if (addOn == "date") {
                    if (_.isArray(value))
                        value = value[0];
                    try {
                        value = moment(new Date(value)).format('YYYY-MM-DD')
                        if (!moment(value).isValid())
                            value = null
                    } catch (e) {
                        value = null;
                    }
                }
                if (addOn == "lowercase")
                    value = value.trim().toLowerCase();
                if (addOn == "commaseparated")
                    value = value.split(',').map(d => d.trim);
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
        if (this.timeout)
            clearTimeout(this.timeout)
        this.timeout = setTimeout(async () => {
            this.logger.log("OnGlobalQueueDrained");
            await this.harvesterService.pluginsStart();
        }, 12000)
    }


    @OnGlobalQueueResumed()
    async onResumed(job: Job) {
        this.timeout = undefined;
        mapto = await this.harvesterService.getMappingValues()
    }
}