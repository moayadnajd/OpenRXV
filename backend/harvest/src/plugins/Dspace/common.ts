

import { Client } from 'elasticsearch'
import { Queue } from 'bull'
import { Request, RequestAPI, CoreOptions, RequiredUriUrl, Response } from 'request'
import { Harvester } from '../../interfaces';
import * as config from '../../../../config/index.json';
import * as mappings from '../../../../config/mapping.json';
let mapto: any = mappings;
const request = <RequestAPI<Request, CoreOptions, RequiredUriUrl>>require('request');
import Bull from 'bull'
import * as _ from 'underscore'
const ISO = require('iso-3166-1')
const langISO = require('iso-639-1')
let moment = require('moment')
export class common implements Harvester {
    repo: any
    esClient: Client;
    repeatJobs: Queue;
    fetchQueue: Queue;
    indexQueue: Queue;
    fetchJobTitle: string = "Fetch Data"
    indexJobTitle: string = "Index Data"
    attempts: number = 10;
    constructor(repo: any) {
        this.repo = repo;
        this.fetchJobTitle += " from " + this.repo.name
        this.indexJobTitle += " from " + this.repo.name
        this.fetchQueue = new Bull(this.repo.name + '_fetch', {
            limiter: {
                max: 100,
                duration: 9000
            },
            settings: {
                retryProcessDelay: 10000
            },
            redis: config.redis
        });
        this.indexQueue = new Bull(this.repo.name + '_index', { redis: config.redis });

        this.repeatJobs = new Bull(this.repo.name + '_repeat', { redis: config.redis });

        this.esClient = new Client(this.conf());
    }

    conf() {
        return { host: config.elasticsearch.host }
    }
    fetch = (job: any, done: any) => {
        job.progress(20);
        let offset = job.data.page * 50;
        let page = job.data.page + job.data.pipe

        request({
            url: this.repo.itemsEndPoint + '&limit=50&offset=' + offset,
            method: "GET",
        }, (error, response, body) => {
            job.progress(50);
            if (!error) {
                if (response.statusCode == 200) {
                    let data: Array<any> = JSON.parse(body)
                    if (data.length == 0) {
                        let error = new Error('no data exist on page ' + job.data.page + ' and offset ' + offset);
                        error.name = "NoData"
                        done(error);
                    }
                    else {
                        this.fetchQueue.add(this.fetchJobTitle, { page, pipe: job.data.pipe }, { attempts: this.attempts })
                        this.indexQueue.add(this.indexJobTitle, { data })
                        job.progress(100);
                        done();
                    }
                } else {
                    let error = new Error('something wrong happened')
                    error.stack = <any>JSON.stringify(response.toJSON());
                    done(error);
                }
            }
            else
                done(error);
        });
    }


    index = (job: any, done: any) => {


        let finaldata: Array<any> = [];
        job.progress(0);
        job.data.data.forEach((item: any) => {
            let formated = this.format(item, this.repo.schema);

            // TODO
            if (formated.date) {
                if (_.isArray(formated.date))
                    formated.date = formated.date[0];
                formated.date = moment(new Date(formated.date)).format('YYYY-MM-DD')
                if (!formated['year'])
                    formated['year'] = formated.date.split("-")[0]
            }
            formated['repo'] = this.repo.name;
            // End TODO

            finaldata.push({ index: { _index: config.temp_index, _type: config.index_type, _id: this.repo.name + "_" + formated.id } });
            finaldata.push(formated);
        });
        job.progress(50);

        this.esClient.bulk({
            refresh: 'wait_for',
            body: finaldata
        }, (err: Error, resp: any) => {
            job.progress(90);
            if (err)
                done(err)
            resp.items.forEach((item: any) => {
                //item.index.status
                if (item.index.status != 200 && item.index.status != 201) {
                    let error = new Error('error update or create item ' + item.index._id);
                    error.stack = JSON.stringify(item);
                    console.log(item)
                }

            })
            job.progress(100);
            done(null, resp.items)
        });
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

        value = addOn == "country" ? this.mapIsoToCountry(value) : value
        value = addOn == "language" ? this.mapIsoToLang(value) : value

        return mapto[value] ? mapto[value] : value
    }
    getArrayOrValue(values: Array<any>) {
        if (values.length > 1)
            return values
        else
            return values[0]
    }

}