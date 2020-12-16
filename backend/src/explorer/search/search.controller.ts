import { Controller, Get, Body, Post, HttpCode, Param } from '@nestjs/common';
import { json } from 'express';
import { ElasticService } from 'src/shared/services/elastic/elastic.service';

@Controller('search')
export class SearchController {

    constructor(private readonly elasticSearvice: ElasticService) {

    }
    @HttpCode(200)
    @Post('/')
    search(@Body() query: any) {
        query['track_total_hits'] = true;
        return this.elasticSearvice.search(query);
    }
    @HttpCode(200)
    @Post('/:size')
    Sizesearch(@Body() query: any, @Param('size') size: number = 10) {
        query['track_total_hits'] = true;
        return this.elasticSearvice.search(query, size);
    }
}
