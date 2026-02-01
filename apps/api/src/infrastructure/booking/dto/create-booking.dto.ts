import { IsString, IsNotEmpty, IsDateString, IsArray } from 'class-validator';

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
  @IsNotEmpty()
  items!: any[];
}
