import { Controller, UseGuards, Post, Body, Get, HttpService, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonFilesService } from '../json-files/json-files.service';
import { map } from 'rxjs/operators';
import { RequestParams } from '@elastic/elasticsearch';

@Controller('settings')
export class SettingsController {

    constructor(private jsonfielServoce: JsonFilesService, private httpService: HttpService) { }
    Data = {
        temp_index: "items-temp",
        final_index: "items-final",
        index_type: "item",
        index_alias: "items",
        elasticsearch: {
            "host": "localhost:9200"
        },
        redis: {
            host: "localhost",
            port: 6379
        },
        cron: "0 0 * * *",
        AddOns: [
            {
                "name": "Altmetric",
                "param": "10947",
                "description": "get altmetric numbers from altmetric api for cgspace",
                "active": true
            },
            {
                "name": "Altmetric",
                "param": "10568",
                "description": "get altmetric numbers from altmetric api for cgspace",
                "active": true
            },
            {
                "name": "Altmetric",
                "param": "20.500.12348",
                "description": "get altmetric numbers from altmetric api for worldfish",
                "active": true
            },
            {
                "name": "Altmetric",
                "param": "20.500.11766",
                "description": "get altmetric numbers from altmetric api for melspace",
                "active": true
            },
            {
                "name": "DownloadsAndViewsMEL",
                "description": "get mel downloads and views numbers",
                "active": true
            },
            {
                "name": "DownloadsAndViews",
                "param": "https://cgspace.cgiar.org",
                "description": "get cgspace downloads and views numbers",
                "active": true
            }
        ],
        startOnFirstInit: true,
        repositories: [

            {
                "type": "Dspace",
                "name": "MELSPACE",
                "startPage": 0,
                "allCores": true,
                "itemsEndPoint": "http://repo.mel.cgiar.org/rest/items?expand=metadata,parentCommunityList",
                "schema": {
                    "id": "id",
                    "handle": "handle",
                    "metadata": [
                        {
                            "where": {
                                "key": "mel.file.thumbnail"
                            },
                            "value": {
                                "value": "thumbnail"
                            }
                        },
                        {
                            "where": {
                                "key": "dc.date"
                            },
                            "value": {
                                "value": "date"
                            }
                        },
                        {
                            "where": {
                                "key": "dc.identifier"
                            },
                            "value": {
                                "value": "identifier"
                            }
                        },
                        {
                            "where": {
                                "key": "dc.identifier.uri"
                            },
                            "value": {
                                "value": "uri"
                            }
                        },
                        {
                            "where": {
                                "key": "dc.description.abstract"
                            },
                            "value": {
                                "value": "abstract"
                            }
                        },
                        {
                            "where": {
                                "key": "cg.coverage.region"
                            },
                            "value": {
                                "value": "region"
                            }
                        },
                        {
                            "where": {
                                "key": "cg.coverage.country"
                            },
                            "value": {
                                "value": "country"
                            },
                            "addOn": "country"
                        },
                        {
                            "where": {
                                "key": "dc.language"
                            },
                            "value": {
                                "value": "language"
                            },
                            "addOn": "language"
                        },
                        {
                            "where": {
                                "key": "dc.publisher"
                            },
                            "value": {
                                "value": "publisher"
                            }
                        },
                        {
                            "where": {
                                "key": "dc.subject"
                            },
                            "value": {
                                "value": "subject"
                            }
                        },
                        {
                            "where": {
                                "key": "dc.type"
                            },
                            "value": {
                                "value": "type"
                            }
                        },
                        {
                            "where": {
                                "key": "dc.title"
                            },
                            "value": {
                                "value": "title"
                            }
                        },
                        {
                            "where": {
                                "key": "dc.identifier.status"
                            },
                            "value": {
                                "value": "status"
                            }
                        },
                        {
                            "where": {
                                "key": "dc.identifier.citation"
                            },
                            "value": {
                                "value": "citation"
                            }
                        },
                        {
                            "where": {
                                "key": "cg.contributor.funder"
                            },
                            "value": {
                                "value": "sponsorship"
                            }
                        },
                        {
                            "where": {
                                "key": "dc.description.sponsorship"
                            },
                            "value": {
                                "value": "sponsorship"
                            }
                        },
                        {
                            "where": {
                                "key": "cg.contributor.center"
                            },
                            "value": {
                                "value": "affiliation"
                            }
                        },
                        {
                            "where": {
                                "key": "cg.contributor.crp"
                            },
                            "value": {
                                "value": "crp"
                            }
                        },
                        {
                            "where": {
                                "key": "dc.creator"
                            },
                            "value": {
                                "value": "author"
                            }
                        },
                        {
                            "where": {
                                "key": "dc.contributor"
                            },
                            "value": {
                                "value": "author"
                            }
                        },
                        {
                            "where": {
                                "key": "dc.contributor"
                            },
                            "value": {
                                "value": "author"
                            }
                        }
                    ],
                    "parentCommunityList": {
                        "name": "community"
                    }
                }
            },

        ]

    }

    format(body: any) {
        let final = {};
        final['temp_index'] = `${body.index_name}-temp`
        final['final_index'] = `${body.index_name}-final`
        final['index_type'] = `${body.index_name}`
        final['index_alias'] = body.index_name
        final['elasticsearch'] = {
            host: body.elasticsearch
        }
        final['redis'] = {
            host: body.redis,
            port: 6379
        }
        final['cron'] = body.cron
        final['startOnFirstInit'] = body.startOnFirstInit;
        final['repositories'] = []
        body.repositories.forEach(repo => {

            let schema = [];
            repo.schema.forEach(item => {
                schema.push({
                    "where": {
                        "key": item.metadata
                    },
                    "value": {
                        "value": item.disply_name
                    }
                })
            });

            final['repositories'].push({
                type: "Dspace",
                startPage: repo.startPage,
                itemsEndPoint: repo.itemsEndPoint,
                allCores: repo.allCores,
                schema: { metadata: { schema } },

            })
        });

        return final;
    }
    @UseGuards(AuthGuard('jwt'))
    @Post('')
    async  Save(@Body() body: any) {

        await this.jsonfielServoce.save(body, '../../../../config/data.json');
        await this.jsonfielServoce.save(this.format(body), '../../../../config/dataToUse.json');

        return { success: true }
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('')
    async  Read() {
        return await this.jsonfielServoce.read('../../../../config/data.json');
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('autometa')
    async  AutoMeta(@Query('link') link: string) {
        let data = await this.httpService.get(link + 'items?expand=metadata,parentCommunityList&limit=25').pipe(map((data: any) => {
            data = data.data.map(element => {
                return element.metadata.map(item => {
                    return item.key
                })
            })
            let merged = [].concat.apply([], data);
            return Array.from(new Set(merged));
        }


        )).toPromise();

        return data;
    }

}
