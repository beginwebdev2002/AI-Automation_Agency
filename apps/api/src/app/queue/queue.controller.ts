import { Controller, Get, Post, Body, UseGuards, Req, Patch, Param, UnauthorizedException } from '@nestjs/common';
import { QueueService } from './queue.service';
import { TelegramAuthGuard } from '../auth/telegram-auth.guard';

@Controller('queue')
export class QueueController {
    constructor(private readonly queueService: QueueService) { }

    @Post()
    @UseGuards(TelegramAuthGuard)
    async joinQueue(@Req() req: any, @Body() body: { serviceCategory: string }) {
        const user = req.user;
        return this.queueService.addToQueue(user.id, user.first_name, user.username, body.serviceCategory);
    }

    @Get()
    async getQueue() {
        return this.queueService.getQueue();
    }

    @Patch(':id/status')
    @UseGuards(TelegramAuthGuard)
    async updateStatus(@Req() req: any, @Param('id') id: string, @Body() body: { status: 'in-progress' | 'completed' | 'cancelled' }) {
        if (req.user.role !== 'admin') {
            throw new UnauthorizedException('Only admins can update status');
        }
        return this.queueService.updateStatus(id, body.status);
    }
}
