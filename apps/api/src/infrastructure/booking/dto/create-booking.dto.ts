import { IsString, IsNotEmpty, IsDateString, IsArray, ValidateNested, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ServiceItemDto {
  @IsString()
  @IsNotEmpty()
  serviceId!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsNumber()
  @Min(0)
  durationMinutes!: number;
}

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  clientId!: string;

  @IsString()
  @IsNotEmpty()
  clientName!: string;

  @IsDateString()
  @IsNotEmpty()
  date!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceItemDto)
  items!: ServiceItemDto[];
}
