import { Controller, UseGuards, Post, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonFilesService } from '../json-files/json-files.service';

@Controller('settings')
export class SettingsController {

    constructor(private jsonfielServoce: JsonFilesService) { }

    @UseGuards(AuthGuard('jwt'))
    @Post('')
    NewUser(@Body() body: any) {

        return this.jsonfielServoce.save(body,'../../data.json');
    }

}
