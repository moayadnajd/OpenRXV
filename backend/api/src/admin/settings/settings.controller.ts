import { Controller, UseGuards, Post, Body, Get, HttpService, Query, UseInterceptors, UploadedFile, Logger, Request, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonFilesService } from '../json-files/json-files.service';
import { map } from 'rxjs/operators';
import { HarvesterService } from 'src/harvester/services/harveter.service';
import { FileInterceptor, MulterModule } from '@nestjs/platform-express'
import { join } from 'path';
import * as fs from 'fs';

@Controller('settings')
export class SettingsController {

    constructor(private jsonfielServoce: JsonFilesService, private httpService: HttpService) { }

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

            let schema = {
                metadata: []
            };
            repo.schema.filter(d => ['parentCollection', 'parentCollectionList', 'parentCommunityList'].indexOf(d.metadata) >= 0).forEach(item => {
                schema[item.metadata] = {
                    "name": item.disply_name
                }
            });
            repo.schema.filter(d => ['parentCollection', 'parentCollectionList', 'parentCommunityList'].indexOf(d.metadata) == -1).forEach(item => {
                schema[item.metadata] = item.disply_name
            });

            repo.metadata.forEach(item => {
                let temp = {
                    "where": {
                        "key": item.metadata
                    },
                    "value": {
                        "value": item.disply_name
                    }
                }
                if (item.addOn)
                    temp['addOn'] = item.addOn
                schema.metadata.push(temp)
            })


            final['repositories'].push({
                name: repo.name,
                type: "Dspace",
                startPage: repo.startPage,
                itemsEndPoint: repo.itemsEndPoint,
                allCores: repo.allCores,
                schema,
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
    @Post('explorer')
    async  SaveExplorer(@Body() body: any) {
        let tokeep = await this.jsonfielServoce.read('../../../../config/explorer.json')
        let tosave = { ...tokeep, ...body };
        await this.jsonfielServoce.save(tosave, '../../../../config/explorer.json');
        return { success: true }
    }

    @Get('explorer')
    async  ReadExplorer() {
        let settings = await this.jsonfielServoce.read('../../../../config/explorer.json');
        let configs = await this.jsonfielServoce.read('../../../../config/data.json');
        let list_icons = {}
        configs.repositories.map(d => [list_icons[d.name] = d.icon])
        settings.appearance['icons'] = list_icons
        return settings
    }
    @UseGuards(AuthGuard('jwt'))
    @Get('')
    async  Read() {
        return await this.jsonfielServoce.read('../../../../config/data.json');
    }



    @UseGuards(AuthGuard('jwt'))
    @Get('metadata')
    async  getMetadata() {
        let data = await this.jsonfielServoce.read('../../../../config/data.json');
        var merged = [].concat.apply([], data.repositories.map(d => [...d.schema, ...d.metadata]));
        return [... new Set(merged.map(d => d.disply_name))];
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('autometa')
    async  AutoMeta(@Query('link') link: string) {
        let data = await this.httpService.get(link + 'items?expand=metadata,parentCommunityList&limit=25').pipe(map((data: any) => {
            let merged = {
                base: [],
                metadata: [],
            }
            data = data.data.forEach(element => {
                merged.base = Array.from(new Set([].concat.apply(merged.base, Object.keys(element).filter(d => ['metadata', 'bitstreams', 'expand'].indexOf(d) == -1))));;
                merged.metadata = Array.from(new Set([].concat.apply(merged.metadata,
                    element.metadata.map(item => {
                        return item.key
                    })
                )));
            });
            return merged;
        })).toPromise();

        return data;
    }

    @Post('upload/image/:name')
    @UseInterceptors(FileInterceptor('file', {
        preservePath: true, fileFilter: this.imageFileFilter, dest: join(__dirname, '../../public/images')
    }))
    async uploadFile(@UploadedFile() file, @Param('name') name: string) {
        console.log(file)
        let splited = file.originalname.split('.');
        if (name == 'random')
            name = splited[0] + '-' + new Date().getTime();


        let response = join(__dirname, '../../public/images/') + name + '.' + splited[splited.length - 1];
        await fs.renameSync(join(__dirname, '../../public/images/') + file.filename, response)
        return { location: response.slice(response.indexOf('public/') + 6) };
    }
}
