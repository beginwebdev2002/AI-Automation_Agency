import { IsIn, IsNotEmpty, IsNumber, IsString, IsUrl } from 'class-validator';

export class AddDressDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsIn(['Wedding', 'Evening', 'Traditional'])
  category!: string;

  @IsString()
  @IsNotEmpty()
  size!: string;

  @IsNumber()
  price!: number;

  @IsString()
  @IsUrl()
  imageUrl!: string;
}
