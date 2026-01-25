import { Controller, Post, Body } from '@nestjs/common';
import { AddDressUseCase } from '@application/inventory/add-dress.usecase';
import { AddDressDto } from './add-dress.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly addDressUseCase: AddDressUseCase) {}

  @Post()
  async add(@Body() dto: AddDressDto) {
    return this.addDressUseCase.execute(
      dto.name,
      dto.category,
      dto.size,
      dto.price,
      dto.imageUrl,
    );
  }

  // @Get() - Implement GetInventoryUseCase
}
