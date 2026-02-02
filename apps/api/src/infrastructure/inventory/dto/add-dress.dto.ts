import { IsString, IsNotEmpty, IsNumber, Min, IsIn, IsUrl } from 'class-validator';

export class AddDressDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsIn(['Wedding', 'Evening', 'Traditional'])
  category!: 'Wedding' | 'Evening' | 'Traditional';

  @IsString()
  @IsNotEmpty()
  size!: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsString()
  @IsUrl()
  imageUrl!: string;
}
