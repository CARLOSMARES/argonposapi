import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateProductsDto, UpdateProductsDto } from 'src/dto/products.dto';
import { ProductsService } from 'src/service/products/products.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('products')
@Controller('products')
export class ProductsController {

  constructor(
    @Inject()
    private readonly productsService: ProductsService
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() payload: CreateProductsDto) {
    return this.productsService.create(payload);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateProductsDto,
  ) {
    return this.productsService.update(id, payload);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.productsService.remove(id);
    return { success: true };
  }
}
