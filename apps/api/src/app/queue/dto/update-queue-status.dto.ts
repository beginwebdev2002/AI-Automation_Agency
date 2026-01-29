import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateQueueStatusDto {
  @IsEnum(['in-progress', 'completed', 'cancelled'], {
    message: 'Status must be one of: in-progress, completed, cancelled',
  })
  @IsNotEmpty()
  status!: 'in-progress' | 'completed' | 'cancelled';
}
