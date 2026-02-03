import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsNumber, IsString, ValidateNested } from 'class-validator';

export class ServiceItemDto {
  @IsString()
  serviceId!: string;

  @IsString()
  name!: string;

  @IsNumber()
  price!: number;

  @IsNumber()
  durationMinutes!: number;
}

export class CreateBookingDto {
  @IsString()
  clientId!: string;

  @IsString()
  clientName!: string;

  @IsDateString()
  date!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceItemDto)
  items!: ServiceItemDto[];
}
