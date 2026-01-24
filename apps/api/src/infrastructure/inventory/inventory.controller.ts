import { Controller, Post, Get, Body } from '@nestjs/common';
import { AddDressUseCase } from '@application/inventory/add-dress.usecase';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly addDressUseCase: AddDressUseCase) {}

  @Post()
  async add(@Body() body: any) {
    return this.addDressUseCase.execute(
      body.name,
      body.category,
      body.size,
      body.price,
      body.imageUrl,
    );
  }

  // @Get() - Implement GetInventoryUseCase
}
