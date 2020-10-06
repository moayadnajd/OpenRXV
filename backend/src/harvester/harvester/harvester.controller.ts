import { Controller, UseGuards, Get, UseInterceptors, HttpException, HttpStatus, UploadedFile, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { HarvesterService } from '../services/harveter.service';
import { diskStorage } from 'multer'
import { extname } from 'path'
import { join } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';
@Controller('harvester')
export class HarvesterController {

    constructor(private harvestService: HarvesterService) {

    }
    @UseGuards(AuthGuard('jwt'))
    @Get('info')
    async  Save() {
        return await this.harvestService.getInfo()
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('startindex')
    async  StartIndex() {
        return { message: Date(), start: await this.harvestService.startHarvest() }
    }
    @UseGuards(AuthGuard('jwt'))
    @Get('stopindex')
    async  StopIndex() {
        return { message: Date(), start: await this.harvestService.stopHarvest() }
    }
   // @UseGuards(AuthGuard('jwt'))
    @Get('reindex')
    async  reIndex() {
        return { message: Date(), start: await this.harvestService.Reindex() }
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('plugins')
    async  pluginsStart() {
        return { message: Date(), start: await this.harvestService.pluginsStart() }
    }

   // @UseGuards(AuthGuard('jwt'))
    @Post('import')
    @UseInterceptors(FileInterceptor('file', {
        fileFilter: (req: any, file: any, cb: any) => {
            cb(null, true);
            // if (file.mimetype.match(/\/(vnd.ms-excel|vnd.openxmlformats-officedocument.spreadsheetml.sheet)$/)) {
            //     // Allow storage of file
            //     cb(null, true);
            // } else {
            //     // Reject file
            //     cb(new HttpException(`Unsupported file type  ${file.mimetype}`, HttpStatus.BAD_REQUEST), false);
            // }
        },
        storage: diskStorage({
            destination: (req: any, file: any, cb: any) => {
                const uploadPath = join(__dirname, '../../../data/files/imported');
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

        return await this.harvestService.ImportExcleFile(file.path);
    }


}
