import { Controller, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { HarvesterService } from '../services/harveter.service';

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
    @UseGuards(AuthGuard('jwt'))
    @Get('reindex')
    async  reIndex() {
        return { message: Date(), start: await this.harvestService.Reindex() }
    }

}
