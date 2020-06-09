import { Controller, Post, Body, Response, HttpCode, UseInterceptors, HttpException, HttpStatus, UploadedFile } from '@nestjs/common';
import { ExportService } from './services/export/export.service';
import { ElasticService } from 'src/shared/services/elastic/elastic.service';
import { diskStorage } from 'multer'
import { extname } from 'path'
import { join } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';
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
            res.status(500).json({ message: 'Something went wrong' });
        }
    }


    @Post('import')
    @UseInterceptors(FileInterceptor('file', {
        fileFilter: (req: any, file: any, cb: any) => {
            if (file.mimetype.match(/\/(vnd.ms-excel|vnd.openxmlformats-officedocument.spreadsheetml.sheet)$/)) {
                // Allow storage of file
                cb(null, true);
            } else {
                // Reject file
                cb(new HttpException(`Unsupported file type  ${file.mimetype}`, HttpStatus.BAD_REQUEST), false);
            }
        },
        storage: diskStorage({
            destination: (req: any, file: any, cb: any) => {
                const uploadPath = join(__dirname, '../../data/files/imported');
                // Create folder if doesn't exist
                if (!existsSync(uploadPath)) {
                    mkdirSync(uploadPath);
                }
                cb(null, uploadPath);
            }
            , filename: (req, file, cb) => {
                const randomName = file.originalname.replace(`${extname(file.originalname)}`, '') + '-' + Array(5).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
                cb(null, `${randomName}${extname(file.originalname)}`)
            }
        })
    }))
    async uploadFile(@UploadedFile() file) {

        return await this.exportService.ImportExcleFile(file.path);
    }



}
