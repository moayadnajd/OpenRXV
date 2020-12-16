import { Controller, UseGuards, Get, Query, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { HarvesterService } from '../services/harveter.service';
import { query } from 'express';

@Controller('harvester')
export class HarvesterController {

    constructor(private harvestService: HarvesterService) {

    }
    @UseGuards(AuthGuard('jwt'))
    @Get('info')
    async getInfo() {
        return await this.harvestService.getInfo()
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('info/:id')
    async getInfoByID(@Param('id') job_id: number) {
        return await this.harvestService.getInfoById(job_id)
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('startindex')
    async StartIndex() {
        return { message: Date(), start: await this.harvestService.startHarvest() }
    }
    @UseGuards(AuthGuard('jwt'))
    @Get('stopindex')
    async StopIndex() {
        return { message: Date(), start: await this.harvestService.stopHarvest() }
    }
    @UseGuards(AuthGuard('jwt'))
    @Get('reindex')
    async reIndex() {
        return { message: Date(), start: await this.harvestService.Reindex() }
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('plugins')
    async pluginsStart() {
        return { message: Date(), start: await this.harvestService.pluginsStart() }
    }

    
    @Get('test')
    async testStart() {
        return { message: Date(), start: await this.harvestService.StartTest() }
    }


}
