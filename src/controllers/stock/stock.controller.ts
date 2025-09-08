import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateStockDto, UpdateStockDto } from 'src/dto/stock.dto';
import { StockService } from 'src/service/stock/stock.service';

@ApiTags('stock')
@Controller('stock')
export class StockController {

  constructor(
    @Inject()
    private readonly stockService: StockService
  ) {}

  @Post()
  async create(@Body() payload: CreateStockDto) {
    return this.stockService.create(payload);
  }

  @Get()
  async findAll() {
    return this.stockService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.stockService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateStockDto,
  ) {
    return this.stockService.update(id, payload);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.stockService.remove(id);
    return { success: true };
  }
}
