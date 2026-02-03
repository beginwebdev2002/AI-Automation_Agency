import { IsIn, IsNumber, IsString } from 'class-validator';

export class AddDressDto {
  @IsString()
  name!: string;

  @IsIn(['Wedding', 'Evening', 'Traditional'])
  category!: 'Wedding' | 'Evening' | 'Traditional';

  @IsString()
  size!: string;

  @IsNumber()
  price!: number;

  @IsString()
  imageUrl!: string;
}
