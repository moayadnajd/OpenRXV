import { Controller, Post, Body, Response, HttpCode } from '@nestjs/common';
import { ExportService } from './services/export/export.service';
import { ElasticService } from 'src/shared/services/elastic/elastic.service';

@Controller('export')
export class ExportController {
    constructor(private exportService: ExportService, private elasticService: ElasticService) { }
    @HttpCode(200)
    @Post('/')
    async ExportData(@Body() body: any, @Response() res: any) {

        try {
            const { type, scrollId, query, part } = body;
            const searchQuery: any = { ...query, size: 2000 };
            this.exportService.downloadFile(
                res,
                await this.elasticService.get(searchQuery, scrollId),
                type,
                part
            );
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Something went wrong' });
        }
    }



}
