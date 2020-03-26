import { Controller, Get, Body, Post, HttpCode } from '@nestjs/common';
import { json } from 'express';
import { ElasticService } from 'src/shared/services/elastic/elastic.service';

@Controller('search')
export class SearchController {

    constructor(private readonly elasticSearvice: ElasticService) {

    }
    @HttpCode(200)
    @Post('/')
    search(@Body() query: any) {

        return this.elasticSearvice.search(query);
    }
}
