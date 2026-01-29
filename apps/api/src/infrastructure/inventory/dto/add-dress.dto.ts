import { IsString, IsNotEmpty, IsNumber, IsIn } from 'class-validator';
import { DressCategory } from '@domain/inventory/dress.entity';

export class AddDressDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsIn(['Wedding', 'Evening', 'Traditional'])
  category: DressCategory;

  @IsString()
  @IsNotEmpty()
  size: string;

  @IsNumber()
  price: number;

  @IsString()
  @IsNotEmpty()
  imageUrl: string;
}
