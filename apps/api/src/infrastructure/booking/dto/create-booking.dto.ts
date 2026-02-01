import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

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
  @Min(1)
  durationMinutes!: number;
}

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  clientId!: string;

  @IsString()
  @IsNotEmpty()
  clientName!: string;

  @Type(() => Date)
  @IsDate()
  date!: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceItemDto)
  items!: ServiceItemDto[];
}
