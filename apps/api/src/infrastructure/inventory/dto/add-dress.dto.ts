import { IsString, IsNotEmpty, IsNumber, Min, IsUrl } from 'class-validator';

export class AddDressDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  category!: string;

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
