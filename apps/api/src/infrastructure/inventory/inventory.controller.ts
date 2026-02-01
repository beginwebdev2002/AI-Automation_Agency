import { Controller, Post, Get, Body } from '@nestjs/common';
import { AddDressUseCase } from '@application/inventory/add-dress.usecase';
import { AddDressDto } from './dto/add-dress.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly addDressUseCase: AddDressUseCase) {}

  @Post()
  async add(@Body() addDressDto: AddDressDto) {
    return this.addDressUseCase.execute(
      addDressDto.name,
      addDressDto.category,
      addDressDto.size,
      addDressDto.price,
      addDressDto.imageUrl,
    );
  }

  // @Get() - Implement GetInventoryUseCase
}
