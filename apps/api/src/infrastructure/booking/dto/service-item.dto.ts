import { IsString, IsNumber, Min } from 'class-validator';

export class ServiceItemDto {
  @IsString()
  serviceId!: string;

  @IsString()
  name!: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsNumber()
  @Min(1)
  durationMinutes!: number;
}
