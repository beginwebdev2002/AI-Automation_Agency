import { IsNotEmpty, IsString } from 'class-validator';

export class JoinQueueDto {
  @IsString()
  @IsNotEmpty()
  serviceCategory!: string;
}
