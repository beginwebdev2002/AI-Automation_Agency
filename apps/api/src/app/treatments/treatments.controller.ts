import { Controller, Get, Post, Body } from '@nestjs/common';
import { TreatmentsService } from './treatments.service';

@Controller('treatments')
export class TreatmentsController {
    constructor(private readonly treatmentsService: TreatmentsService) { }

    @Get()
    async findAll() {
        return this.treatmentsService.findAll();
    }

    @Get('faq')
    getFaq() {
        return this.treatmentsService.getFaq();
    }

    @Post('seed')
    async seed() {
        await this.treatmentsService.seed();
        return { message: 'Seeded successfully' };
    }
}
