import { Controller, Get, Post, Body, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { TreatmentsService } from './treatments.service';

@Controller('treatments')
export class TreatmentsController {
    constructor(private readonly treatmentsService: TreatmentsService) { }

    @Get()
    async findAll(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
    ) {
        return this.treatmentsService.findAll(page, limit);
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
