import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Patch,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { QueueService } from './queue.service';
import { TelegramAuthGuard } from '@app/auth/telegram-auth.guard';
import { JoinQueueDto } from './dto/join-queue.dto';
import { UpdateQueueStatusDto } from './dto/update-queue-status.dto';

interface TelegramUser {
  id: number;
  first_name: string;
  username?: string;
  role: string;
}

interface RequestWithUser {
  user: TelegramUser;
}

@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Post()
  @UseGuards(TelegramAuthGuard)
  async joinQueue(
    @Req() req: RequestWithUser,
    @Body() body: JoinQueueDto,
  ) {
    const user = req.user;
    return this.queueService.addToQueue(
      user.id,
      user.first_name,
      user.username ?? '',
      body.serviceCategory,
    );
  }

  @Get()
  async getQueue() {
    return this.queueService.getQueue();
  }

  @Patch(':id/status')
  @UseGuards(TelegramAuthGuard)
  async updateStatus(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() body: UpdateQueueStatusDto,
  ) {
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException('Only admins can update status');
    }
    return this.queueService.updateStatus(id, body.status);
  }
}
