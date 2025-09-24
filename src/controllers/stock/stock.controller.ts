import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateStockDto, UpdateStockDto } from 'src/dto/stock.dto';
import { StockService } from 'src/service/stock/stock.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('stock')
@Controller('stock')
export class StockController {

  constructor(
    @Inject()
    private readonly stockService: StockService
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() payload: CreateStockDto) {
    return this.stockService.create(payload);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.stockService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.stockService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateStockDto,
  ) {
    return this.stockService.update(id, payload);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.stockService.remove(id);
    return { success: true };
  }
}
