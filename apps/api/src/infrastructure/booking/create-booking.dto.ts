import { IsString, IsDateString, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class BookingItemDto {
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
  @Type(() => BookingItemDto)
  items!: BookingItemDto[];
}
