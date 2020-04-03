import { Controller, HttpCode, Post, Body, Get, Param } from '@nestjs/common';
import { ElasticService } from 'src/shared/services/elastic/elastic.service';

@Controller('share')
export class ShareController {
    constructor(private readonly elasticSearvice: ElasticService) { }
    @HttpCode(200)
    @Post('/')
    save(@Body() query: any) {

        return this.elasticSearvice.saveShare(query);
    }

    @HttpCode(200)
    @Get('/:id')
    get(@Param('id') id: string) {
        console.log(id);
        return this.elasticSearvice.findShare(id);
    }



}
