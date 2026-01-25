import { IsString, IsNumber, IsEnum } from 'class-validator';
import { DressCategory } from '@domain/inventory/dress.entity';

export class AddDressDto {
  @IsString()
  name!: string;

  @IsString()
  @IsEnum(['Wedding', 'Evening', 'Traditional'])
  category!: DressCategory;

  @IsString()
  size!: string;

  @IsNumber()
  price!: number;

  @IsString()
  imageUrl!: string;
}
