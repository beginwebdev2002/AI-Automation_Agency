import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { AddDressUseCase } from '@application/inventory/add-dress.usecase';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly addDressUseCase: AddDressUseCase) {}

  @Post()
  @UseGuards(AdminGuard)
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
